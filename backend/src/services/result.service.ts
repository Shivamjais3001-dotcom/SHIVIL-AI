import prisma from "../config/database";
import {
  ResultSummaryRepository,
  GradingPolicyRepository,
  ExamMarkRepository
} from "../repositories/assessment.repository";
import { GradingService } from "./grading.service";
import { ApiError } from "../utils/api-error";
import { buildPaginatedMeta } from "../utils/pagination";

const resultRepo = new ResultSummaryRepository();
const policyRepo = new GradingPolicyRepository();
const markRepo = new ExamMarkRepository();
const gradingService = new GradingService();

export class ResultService {
  // ─── PROCESS RESULTS FOR A STUDENT/SEMESTER ─────────────────────────
  async processStudentResult(params: {
    studentId: string;
    semester: string;
    academicYear: string;
    universityId?: string | null;
    processedById: string;
  }) {
    const { studentId, semester, academicYear, universityId, processedById } = params;

    // 1. Fetch all marks for the student in this semester
    const allMarks = await markRepo.findByStudent(studentId);
    const semesterMarks = (allMarks as any[]).filter(
      (m) =>
        m.exam?.semester === semester &&
        m.exam?.academicYear === academicYear &&
        m.isLocked === true // Only process locked/approved marks
    );

    if (semesterMarks.length === 0) {
      throw ApiError.notFound(
        `No locked marks found for student ${studentId} in semester ${semester}, year ${academicYear}.`
      );
    }

    // 2. Get university grading policy
    const policy = await policyRepo.findByUniversity(universityId || null);

    // 3. Build subject results list
    const subjectResults: any[] = semesterMarks.map((m) => ({
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

  // ─── BATCH PROCESS ALL STUDENTS IN A SEMESTER ───────────────────────
  async processBatchResults(params: {
    semester: string;
    academicYear: string;
    universityId?: string | null;
    branch?: string;
    processedById: string;
  }) {
    const { semester, academicYear, universityId, branch, processedById } = params;

    // Find all students with locked marks in this semester
    const where: any = {
      exam: {
        semester,
        academicYear,
        ...(universityId ? { universityId } : {}),
        isLocked: true
      },
      ...(branch ? { student: { branch } } : {})
    };

    const allMarks = await (prisma as any).examMark.findMany({
      where,
      select: { studentId: true },
      distinct: ["studentId"]
    } as any);

    const studentIds = (allMarks as any[]).map((m: any) => m.studentId);
    const results: any[] = [];
    const errors: any[] = [];

    for (const studentId of studentIds) {
      try {
        const result = await this.processStudentResult({
          studentId,
          semester,
          academicYear,
          universityId,
          processedById
        });
        results.push({ studentId, status: "SUCCESS", resultStatus: result.resultStatus });
      } catch (err: any) {
        errors.push({ studentId, status: "FAILED", error: err.message });
      }
    }

    return {
      totalStudents: studentIds.length,
      processed: results.length,
      failed: errors.length,
      results,
      errors
    };
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
      marksDetail: allMarks
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
