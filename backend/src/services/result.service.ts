import prisma from "../config/database";
import {
  ResultSummaryRepository,
  GradingPolicyRepository,
  ExamMarkRepository
} from "../repositories/assessment.repository";
import { GradingService } from "./grading.service";
import { ApiError } from "../utils/api-error";
import { buildPaginatedMeta } from "../utils/pagination";

import { ResilientTaskQueue } from "../common/utils/background-job";

const resultRepo = new ResultSummaryRepository();
const policyRepo = new GradingPolicyRepository();
const markRepo = new ExamMarkRepository();
const gradingService = new GradingService();
const resultBatchQueue = new ResilientTaskQueue<{ jobId: string; params: any }>("ResultBatchProcessing", 5);

export class ResultService {
  // ─── PROCESS RESULTS FOR A STUDENT/SEMESTER ─────────────────────────
  async processStudentResult(params: {
    studentId: string;
    semester: string;
    academicYear: string;
    universityId?: string | null;
    processedById: string;
    cachedPolicy?: any;
  }) {
    const { studentId, semester, academicYear, universityId, processedById } = params;

    // 1. Fetch marks for this student for this specific semester only (filtered at DB level)
    const semesterMarks = await markRepo.findByStudent(studentId, {
      semester,
      academicYear
    });

    // Only process approved or locked marks
    const lockedMarks = (semesterMarks as any[]).filter(
      (m) => m.isLocked === true || m.approvalStatus === "LOCKED" || m.approvalStatus === "APPROVED"
    );

    if (lockedMarks.length === 0) {
      throw ApiError.notFound(
        `No locked or approved marks found for student ${studentId} in semester ${semester}, year ${academicYear}.`
      );
    }

    // 2. Get university grading policy (use cached policy if provided, preventing N+1 queries)
    const policy = params.cachedPolicy || await policyRepo.findByUniversity(universityId || null);

    // 3. Build subject results list
    const subjectResults: any[] = lockedMarks.map((m) => ({
      subjectId: m.exam?.subjectId,
      subjectCode: m.exam?.subject?.code || "",
      subjectName: m.exam?.subject?.name || "Unknown Subject",
      credits: m.exam?.subject?.course?.credits || 3,
      marks: m.totalMarks,
      maxMarks: m.exam?.maxMarks || 100,
      grade: m.grade || "F",
      gradePoint: m.gradePoint || 0
    }));

    // 4. Compute SGPA
    const sgpaResult = gradingService.computeSGPA(subjectResults, policy);

    // 5. Compute CGPA across all previous semesters
    const allSummaries = await resultRepo.findByStudent(studentId);
    const previousSummaries = (allSummaries as any[]).filter(
      (s) => !(s.semester === semester && s.academicYear === academicYear)
    );

    const allSemData = [
      ...previousSummaries.map((s: any) => ({
        sgpa: s.sgpa,
        creditsRegistered: s.creditsRegistered,
        totalCreditPoints: s.totalCreditPoints
      })),
      {
        sgpa: sgpaResult.sgpa,
        creditsRegistered: sgpaResult.creditsRegistered,
        totalCreditPoints: sgpaResult.totalCreditPoints
      }
    ];

    const cgpa = gradingService.computeCGPA(allSemData);

    // 6. Check promotion eligibility
    const promotionCheck = gradingService.checkPromotion(
      cgpa,
      sgpaResult.backlogSubjects.length,
      policy
    );

    // 7. Compute total credits earned (across all semesters)
    const totalCreditsEarned =
      previousSummaries.reduce((acc: number, s: any) => acc + (s.creditsEarned || 0), 0) +
      sgpaResult.creditsEarned;

    // 8. Check graduation eligibility
    const graduationCheck = gradingService.checkGraduationEligibility(
      totalCreditsEarned,
      cgpa,
      policy
    );

    // 9. Determine result status
    let resultStatus = "PROMOTED";
    if (!promotionCheck.isEligible) {
      resultStatus = sgpaResult.backlogSubjects.length > 0 ? "BACKLOG" : "DETAINED";
    }
    if (graduationCheck.isEligible) {
      resultStatus = "ELIGIBLE_FOR_GRADUATION";
    }

    // 10. Persist result summary
    const summary = await resultRepo.upsert(studentId, semester, academicYear, {
      universityId: universityId || null,
      sgpa: sgpaResult.sgpa,
      cgpa,
      creditsRegistered: sgpaResult.creditsRegistered,
      creditsEarned: sgpaResult.creditsEarned,
      totalCreditPoints: sgpaResult.totalCreditPoints,
      backlogsCount: sgpaResult.backlogSubjects.length,
      backlogSubjects: sgpaResult.backlogSubjects,
      resultStatus,
      isEligibleForPromotion: promotionCheck.isEligible,
      isEligibleForGraduation: graduationCheck.isEligible,
      processedAt: new Date(),
      processedById,
      aiInsights: {
        promotionReasons: promotionCheck.reasons,
        graduationReasons: graduationCheck.reasons,
        processedAt: new Date().toISOString()
      }
    });

    return {
      summary,
      sgpaDetails: sgpaResult,
      cgpa,
      promotionEligible: promotionCheck.isEligible,
      graduationEligible: graduationCheck.isEligible,
      resultStatus,
      promotionReasons: promotionCheck.reasons
    };
  }

  // ─── ASYNC BATCH PROCESS ALL STUDENTS IN A SEMESTER ────────────────
  async processBatchResults(params: {
    semester: string;
    academicYear: string;
    universityId?: string | null;
    branch?: string;
    processedById: string;
  }) {
    const { semester, academicYear, universityId, branch, processedById } = params;

    // 1. Create a ResultProcessingJob record with status QUEUED
    const job = await (prisma as any).resultProcessingJob.create({
      data: {
        universityId: universityId || null,
        semester,
        academicYear,
        batchFilter: branch ? { branch } : {},
        status: "QUEUED",
        triggeredById: processedById
      }
    });

    // 2. Offload processing to resilient queue to protect Event Loop & memory
    resultBatchQueue.enqueue(
      { jobId: job.id, params },
      async ({ jobId, params }) => {
        await this.runBatchJob(jobId, params);
      }
    );

    // 3. Return the queued job details immediately (with 202 Accepted in controller)
    return job;
  }

  // ─── BACKGROUND BATCH JOB RUNNER (NON-BLOCKING CHUNK WORKER) ───────────
  private async runBatchJob(jobId: string, params: {
    semester: string;
    academicYear: string;
    universityId?: string | null;
    branch?: string;
    processedById: string;
  }) {
    const { semester, academicYear, universityId, branch, processedById } = params;

    try {
      // Update job status to PROCESSING
      await (prisma as any).resultProcessingJob.update({
        where: { id: jobId },
        data: { status: "PROCESSING", startedAt: new Date() }
      });

      // Find all students with locked/approved marks in this semester
      const where: any = {
        exam: {
          semester,
          academicYear,
          isLocked: true
        }
      };
      if (universityId) where.exam.universityId = universityId;
      if (branch) where.student = { branch };

      const allMarks = await (prisma as any).examMark.findMany({
        where,
        select: { studentId: true },
        distinct: ["studentId"]
      });

      const studentIds = (allMarks as any[]).map((m: any) => m.studentId);

      if (studentIds.length === 0) {
        await (prisma as any).resultProcessingJob.update({
          where: { id: jobId },
          data: {
            status: "COMPLETED",
            totalStudents: 0,
            completedAt: new Date()
          }
        });
        return;
      }

      await (prisma as any).resultProcessingJob.update({
        where: { id: jobId },
        data: { totalStudents: studentIds.length }
      });

      // Cache grading policy exactly once for the entire batch
      const cachedPolicy = await policyRepo.findByUniversity(universityId || null);

      let processedCount = 0;
      let failedCount = 0;
      const errorLog: any[] = [];

      // Process in concurrency-limited chunks of 20
      const chunkSize = 20;
      for (let i = 0; i < studentIds.length; i += chunkSize) {
        const chunk = studentIds.slice(i, i + chunkSize);

        const results = await Promise.allSettled(
          chunk.map(async (studentId) => {
            return this.processStudentResult({
              studentId,
              semester,
              academicYear,
              universityId,
              processedById,
              cachedPolicy
            });
          })
        );

        for (let j = 0; j < results.length; j++) {
          const res = results[j];
          const studentId = chunk[j];
          if (res.status === "fulfilled") {
            processedCount++;
          } else {
            failedCount++;
            errorLog.push({
              studentId,
              error: res.reason?.message || "Unknown error during calculation"
            });
          }
        }

        // Update progress in database incrementally after each chunk completes
        await (prisma as any).resultProcessingJob.update({
          where: { id: jobId },
          data: {
            processed: processedCount,
            failed: failedCount,
            errorLog: errorLog.length > 0 ? errorLog : undefined
          }
        });

        // Yield to let other operations execute on Node's Event Loop
        await new Promise((resolve) => setImmediate(resolve));
      }

      const finalStatus = failedCount === studentIds.length ? "FAILED" : "COMPLETED";
      await (prisma as any).resultProcessingJob.update({
        where: { id: jobId },
        data: {
          status: finalStatus,
          completedAt: new Date()
        }
      });

    } catch (error: any) {
      console.error(`Batch processing job ${jobId} failed with critical error:`, error);
      await (prisma as any).resultProcessingJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          errorLog: { message: error.message || "Fatal error during batch execution." }
        }
      }).catch((err: any) => console.error("Error updating failed job:", err));
    }
  }

  // ─── GET JOB STATUS ─────────────────────────────────────────────────
  async getJobStatus(jobId: string) {
    const job = await (prisma as any).resultProcessingJob.findUnique({
      where: { id: jobId }
    });
    if (!job) throw ApiError.notFound("Result processing job not found.");
    return job;
  }

  // ─── GET STUDENT RESULT SUMMARY ─────────────────────────────────────
  async getStudentResults(studentId: string) {
    const summaries = await resultRepo.findByStudent(studentId);
    if (!summaries || (summaries as any[]).length === 0) {
      return {
        studentId,
        semesters: [],
        cgpa: 0,
        totalCreditsEarned: 0,
        message: "No processed results found for this student."
      };
    }

    const cgpa = gradingService.computeCGPA(
      (summaries as any[]).map((s: any) => ({
        sgpa: s.sgpa,
        creditsRegistered: s.creditsRegistered,
        totalCreditPoints: s.totalCreditPoints
      }))
    );

    const totalCreditsEarned = (summaries as any[]).reduce(
      (acc: number, s: any) => acc + (s.creditsEarned || 0),
      0
    );

    return {
      studentId,
      cgpa,
      totalCreditsEarned,
      semesters: summaries
    };
  }

  // ─── GENERATE TRANSCRIPT DATA ───────────────────────────────────────
  async generateTranscript(studentId: string, universityId?: string | null) {
    const student = await (prisma as any).student.findUnique({
      where: { id: studentId } as any,
      include: { user: { select: { email: true } } }
    } as any);

    if (!student) throw ApiError.notFound("Student not found.");

    const summaries = await resultRepo.findByStudent(studentId);
    const allMarks = await markRepo.findByStudent(studentId);
    const policy = await policyRepo.findByUniversity(universityId || null);

    const cgpa = gradingService.computeCGPA(
      (summaries as any[]).map((s: any) => ({
        sgpa: s.sgpa,
        creditsRegistered: s.creditsRegistered,
        totalCreditPoints: s.totalCreditPoints
      }))
    );

    const totalCreditsEarned = (summaries as any[]).reduce(
      (acc: number, s: any) => acc + (s.creditsEarned || 0),
      0
    );

    const latestSummary = (summaries as any[]).slice(-1)[0];
    const graduationEligible = latestSummary?.isEligibleForGraduation || false;

    // Filter to only include approved or locked marks in the transcript
    const approvedMarks = (allMarks as any[]).filter(
      (m) => m.isLocked === true || m.approvalStatus === "LOCKED" || m.approvalStatus === "APPROVED"
    );

    return {
      generatedAt: new Date().toISOString(),
      student: {
        id: (student as any).id,
        name: (student as any).name,
        rollNo: (student as any).rollNo,
        enrollmentNo: (student as any).enrollmentNo,
        registrationNo: (student as any).registrationNo,
        branch: (student as any).branch,
        email: (student as any).user?.email
      },
      cgpa,
      totalCreditsEarned,
      graduationEligible,
      creditSystem: (policy as any).creditSystem || "10_POINT",
      semesters: summaries,
      marksDetail: approvedMarks
    };
  }

  // ─── SEMESTER RESULT LIST ────────────────────────────────────────────
  async getSemesterResults(params: {
    semester: string;
    academicYear: string;
    universityId?: string | null;
    page: number;
    limit: number;
  }) {
    const { total, data } = await resultRepo.findBySemester(params);
    const meta = buildPaginatedMeta(total, {
      page: params.page,
      limit: params.limit,
      sort: "cgpa",
      order: "desc",
      search: ""
    });
    return { data, meta };
  }

  // ─── BACKLOG STUDENTS ────────────────────────────────────────────────
  async getBacklogStudents(universityId: string | null) {
    return resultRepo.getBacklogStudents(universityId);
  }
}
