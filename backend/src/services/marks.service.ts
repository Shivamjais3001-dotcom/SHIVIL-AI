import {
  ExamMarkRepository,
  ExamRepository,
  ExamAuditRepository,
  GradingPolicyRepository
} from "../repositories/assessment.repository";
import { ApiError } from "../utils/api-error";
import { GradingService } from "./grading.service";
import { buildPaginatedMeta } from "../utils/pagination";
import prisma from "../config/database";
import { ResultService } from "./result.service";

const markRepo = new ExamMarkRepository();
const examRepo = new ExamRepository();
const auditRepo = new ExamAuditRepository();
const policyRepo = new GradingPolicyRepository();
const gradingService = new GradingService();
const resultService = new ResultService();

export class MarksService {
  // ─── ENTER SINGLE MARK ──────────────────────────────────────────────
  async enterMarks(data: {
    examId: string;
    studentId: string;
    internalMarks?: number;
    externalMarks?: number;
    assignmentMarks?: number;
    quizMarks?: number;
    labMarks?: number;
    projectMarks?: number;
    presentationMarks?: number;
    attendanceMarks?: number;
    actorId: string;
    actorRole: string;
    universityId?: string | null;
    ipAddress?: string;
  }) {
    const exam = await examRepo.findById(data.examId);
    if (!exam) throw ApiError.notFound("Examination not found.");
    if ((exam as any).isLocked) throw ApiError.badRequest("Marks entry is not allowed. The exam is locked.");

    // 1. Validate Faculty course assignment check
    if (data.actorRole === "FACULTY") {
      const faculty = await (prisma as any).faculty.findUnique({
        where: { userId: data.actorId }
      });
      if (!faculty) throw ApiError.forbidden("Faculty profile not found.");

      const isAssigned = await (prisma as any).subject.findFirst({
        where: {
          id: exam.subjectId,
          OR: [
            { facultyId: faculty.id },
            { offerings: { some: { facultyId: faculty.id } } }
          ]
        }
      });
      if (!isAssigned) {
        throw ApiError.forbidden("You are not authorized to enter marks for this subject/examination.");
      }
    }

    // 2. Validate Student course enrollment check
    const enrollment = await (prisma as any).enrollment.findFirst({
      where: {
        studentId: data.studentId,
        offering: {
          subjectId: exam.subjectId
        },
        status: "ENROLLED"
      }
    });
    if (!enrollment) {
      throw ApiError.badRequest("Student is not enrolled in this subject's course offering.");
    }

    // 3. Retrieve assessment component weights for scaling
    const compConfig = await (prisma as any).assessmentComponent.findUnique({
      where: { subjectId: exam.subjectId }
    });

    let totalMarks = 0;
    if (compConfig) {
      // Validate bounds
      if (data.internalMarks !== undefined && data.internalMarks > compConfig.internalMaxMarks) {
        throw ApiError.badRequest(`Internal marks (${data.internalMarks}) cannot exceed maximum internal marks (${compConfig.internalMaxMarks}).`);
      }
      if (data.externalMarks !== undefined && data.externalMarks > compConfig.externalMaxMarks) {
        throw ApiError.badRequest(`External marks (${data.externalMarks}) cannot exceed maximum external marks (${compConfig.externalMaxMarks}).`);
      }
      
      const checkComponent = (val: number | undefined, limit: number, name: string) => {
        if (val !== undefined && limit > 0 && val > limit) {
          throw ApiError.badRequest(`${name} marks (${val}) cannot exceed limit (${limit}).`);
        }
      };
      checkComponent(data.assignmentMarks, compConfig.assignmentWeight, "Assignment");
      checkComponent(data.quizMarks, compConfig.quizWeight, "Quiz");
      checkComponent(data.labMarks, compConfig.labWeight, "Lab");
      checkComponent(data.projectMarks, compConfig.projectWeight, "Project");
      checkComponent(data.presentationMarks, compConfig.presentationWeight, "Presentation");
      checkComponent(data.attendanceMarks, compConfig.attendanceWeight, "Attendance");

      // Scale marks
      const internalScaled = compConfig.internalMaxMarks > 0 ? ((data.internalMarks || 0) / compConfig.internalMaxMarks) * compConfig.internalWeight : 0;
      const externalScaled = compConfig.externalMaxMarks > 0 ? ((data.externalMarks || 0) / compConfig.externalMaxMarks) * compConfig.externalWeight : 0;

      const assignmentScaled = compConfig.assignmentWeight > 0 ? data.assignmentMarks || 0 : 0;
      const quizScaled = compConfig.quizWeight > 0 ? data.quizMarks || 0 : 0;
      const labScaled = compConfig.labWeight > 0 ? data.labMarks || 0 : 0;
      const projectScaled = compConfig.projectWeight > 0 ? data.projectMarks || 0 : 0;
      const presentationScaled = compConfig.presentationWeight > 0 ? data.presentationMarks || 0 : 0;
      const attendanceScaled = compConfig.attendanceWeight > 0 ? data.attendanceMarks || 0 : 0;

      totalMarks = internalScaled + externalScaled + assignmentScaled + quizScaled + labScaled + projectScaled + presentationScaled + attendanceScaled;
      totalMarks = Math.round(totalMarks * 100) / 100;
    } else {
      totalMarks =
        (data.internalMarks || 0) +
        (data.externalMarks || 0) +
        (data.assignmentMarks || 0) +
        (data.quizMarks || 0) +
        (data.labMarks || 0) +
        (data.projectMarks || 0) +
        (data.presentationMarks || 0) +
        (data.attendanceMarks || 0);
    }

    const maxMarks = (exam as any).maxMarks || 100;
    if (totalMarks > maxMarks) {
      throw ApiError.badRequest(
        `Total scaled marks (${totalMarks}) cannot exceed maximum marks (${maxMarks}) for this exam.`
      );
    }

    // Compute grade
    const policy = await policyRepo.findByUniversity(data.universityId || null);
    const { grade, gradePoint } = gradingService.computeGradeFromPolicy(totalMarks, maxMarks, policy);
    
    // Calculate actual credit points based on subject credits
    const subjectCredits = (exam as any).subject?.course?.credits || 3;
    const creditPoints = gradePoint * subjectCredits;

    // Transaction-safe execution
    return prisma.$transaction(async (tx) => {
      const mark = await markRepo.upsertMark({
        examId: data.examId,
        studentId: data.studentId,
        internalMarks: data.internalMarks || 0,
        externalMarks: data.externalMarks || 0,
        assignmentMarks: data.assignmentMarks || 0,
        quizMarks: data.quizMarks || 0,
        labMarks: data.labMarks || 0,
        projectMarks: data.projectMarks || 0,
        presentationMarks: data.presentationMarks || 0,
        attendanceMarks: data.attendanceMarks || 0,
        totalMarks,
        grade,
        gradePoint,
        creditPoints,
        submittedById: data.actorId,
        auditTrail: [
          {
            action: "MARKS_ENTERED",
            actorId: data.actorId,
            actorRole: data.actorRole,
            timestamp: new Date().toISOString(),
            value: totalMarks,
            grade
          }
        ]
      }, tx);

      await auditRepo.append({
        examId: data.examId,
        examMarkId: (mark as any).id,
        action: "MARKS_ENTERED",
        actorId: data.actorId,
        actorRole: data.actorRole,
        newValue: { totalMarks, grade, gradePoint },
        ipAddress: data.ipAddress
      }, tx);

      return mark;
    });
  }

  // ─── BULK MARKS ENTRY ───────────────────────────────────────────────
  async bulkEnterMarks(data: {
    examId: string;
    records: Array<{
      studentId: string;
      internalMarks?: number;
      externalMarks?: number;
      assignmentMarks?: number;
      quizMarks?: number;
      labMarks?: number;
      projectMarks?: number;
      presentationMarks?: number;
      attendanceMarks?: number;
    }>;
    actorId: string;
    actorRole: string;
    universityId?: string | null;
    ipAddress?: string;
  }) {
    const exam = await examRepo.findById(data.examId);
    if (!exam) throw ApiError.notFound("Examination not found.");
    if ((exam as any).isLocked) throw ApiError.badRequest("Bulk marks entry not allowed. Exam is locked.");

    // Validate Faculty course assignment check
    if (data.actorRole === "FACULTY") {
      const faculty = await (prisma as any).faculty.findUnique({
        where: { userId: data.actorId }
      });
      if (!faculty) throw ApiError.forbidden("Faculty profile not found.");

      const isAssigned = await (prisma as any).subject.findFirst({
        where: {
          id: exam.subjectId,
          OR: [
            { facultyId: faculty.id },
            { offerings: { some: { facultyId: faculty.id } } }
          ]
        }
      });
      if (!isAssigned) {
        throw ApiError.forbidden("You are not authorized to enter marks for this subject/examination.");
      }
    }

    const maxMarks = (exam as any).maxMarks || 100;
    const policy = await policyRepo.findByUniversity(data.universityId || null);
    const compConfig = await (prisma as any).assessmentComponent.findUnique({
      where: { subjectId: exam.subjectId }
    });

    // Validate student course enrollments in batch
    const studentIds = data.records.map((r) => r.studentId);
    const enrollments = await (prisma as any).enrollment.findMany({
      where: {
        studentId: { in: studentIds },
        offering: {
          subjectId: exam.subjectId
        },
        status: "ENROLLED"
      },
      select: { studentId: true }
    });
    const enrolledSet = new Set(enrollments.map((e: any) => e.studentId));

    // Validate and process all records
    const processedRecords: any[] = [];
    const validationErrors: any[] = [];
    const subjectCredits = (exam as any).subject?.course?.credits || 3;

    for (const rec of data.records) {
      if (!enrolledSet.has(rec.studentId)) {
        validationErrors.push({
          studentId: rec.studentId,
          error: "Student is not enrolled in the subject's course offering."
        });
        continue;
      }

      let totalMarks = 0;
      if (compConfig) {
        if (rec.internalMarks !== undefined && rec.internalMarks > compConfig.internalMaxMarks) {
          validationErrors.push({ studentId: rec.studentId, error: `Internal marks exceed max ${compConfig.internalMaxMarks}` });
          continue;
        }
        if (rec.externalMarks !== undefined && rec.externalMarks > compConfig.externalMaxMarks) {
          validationErrors.push({ studentId: rec.studentId, error: `External marks exceed max ${compConfig.externalMaxMarks}` });
          continue;
        }

        const internalScaled = compConfig.internalMaxMarks > 0 ? ((rec.internalMarks || 0) / compConfig.internalMaxMarks) * compConfig.internalWeight : 0;
        const externalScaled = compConfig.externalMaxMarks > 0 ? ((rec.externalMarks || 0) / compConfig.externalMaxMarks) * compConfig.externalWeight : 0;

        const assignmentScaled = compConfig.assignmentWeight > 0 ? rec.assignmentMarks || 0 : 0;
        const quizScaled = compConfig.quizWeight > 0 ? rec.quizMarks || 0 : 0;
        const labScaled = compConfig.labWeight > 0 ? rec.labMarks || 0 : 0;
        const projectScaled = compConfig.projectWeight > 0 ? rec.projectMarks || 0 : 0;
        const presentationScaled = compConfig.presentationWeight > 0 ? rec.presentationMarks || 0 : 0;
        const attendanceScaled = compConfig.attendanceWeight > 0 ? rec.attendanceMarks || 0 : 0;

        totalMarks = internalScaled + externalScaled + assignmentScaled + quizScaled + labScaled + projectScaled + presentationScaled + attendanceScaled;
        totalMarks = Math.round(totalMarks * 100) / 100;
      } else {
        totalMarks =
          (rec.internalMarks || 0) + (rec.externalMarks || 0) +
          (rec.assignmentMarks || 0) + (rec.quizMarks || 0) +
          (rec.labMarks || 0) + (rec.projectMarks || 0) +
          (rec.presentationMarks || 0) + (rec.attendanceMarks || 0);
      }

      if (totalMarks > maxMarks) {
        validationErrors.push({
          studentId: rec.studentId,
          error: `Total scaled marks (${totalMarks}) exceeds maximum (${maxMarks})`
        });
        continue;
      }

      const { grade, gradePoint } = gradingService.computeGradeFromPolicy(totalMarks, maxMarks, policy);
      const creditPoints = gradePoint * subjectCredits;

      processedRecords.push({
        ...rec,
        totalMarks,
        grade,
        gradePoint,
        creditPoints
      });
    }

    if (validationErrors.length > 0) {
      throw ApiError.badRequest("Bulk marks validation failed.", validationErrors);
    }

    // Wrap in a transaction block
    return prisma.$transaction(async (tx) => {
      const results = await markRepo.bulkUpsert(data.examId, processedRecords, data.actorId);

      await auditRepo.append({
        examId: data.examId,
        action: "BULK_MARKS_ENTERED",
        actorId: data.actorId,
        actorRole: data.actorRole,
        newValue: { count: results.length },
        ipAddress: data.ipAddress
      }, tx);

      return {
        processed: results.length,
        total: data.records.length,
        marks: results
      };
    });
  }

  // ─── MODERATE MARKS ─────────────────────────────────────────────────
  async moderateMarks(markId: string, data: {
    moderationDelta: number;
    moderationReason: string;
    actorId: string;
    actorRole: string;
    universityId?: string | null;
    ipAddress?: string;
  }) {
    const existingMark = await markRepo.findById(markId);
    if (!existingMark) throw ApiError.notFound("Mark record not found.");
    if ((existingMark as any).isLocked) throw ApiError.badRequest("Cannot moderate a locked mark record.");

    const previousTotal = (existingMark as any).totalMarks;
    const newTotal = Math.max(0, previousTotal + data.moderationDelta);

    // Get max marks from exam
    const exam = await examRepo.findById((existingMark as any).examId);
    const maxMarks = (exam as any)?.maxMarks || 100;

    if (newTotal > maxMarks) {
      throw ApiError.badRequest(
        `Moderated marks (${newTotal}) would exceed maximum marks (${maxMarks}).`
      );
    }

    const policy = await policyRepo.findByUniversity(data.universityId || null);
    const { grade, gradePoint } = gradingService.computeGradeFromPolicy(newTotal, maxMarks, policy);
    
    // Recalculate creditPoints properly
    const subjectCredits = (exam as any)?.subject?.course?.credits || 3;
    const creditPoints = gradePoint * subjectCredits;

    return prisma.$transaction(async (tx) => {
      const updated = await markRepo.moderate(markId, {
        moderationDelta: data.moderationDelta,
        moderationReason: data.moderationReason,
        actorId: data.actorId,
        previousTotal,
        newTotal,
        grade,
        gradePoint,
        creditPoints
      }, tx);

      await auditRepo.append({
        examId: (existingMark as any).examId,
        examMarkId: markId,
        action: "MARKS_MODERATED",
        actorId: data.actorId,
        actorRole: data.actorRole,
        previousValue: { totalMarks: previousTotal, grade: (existingMark as any).grade },
        newValue: { totalMarks: newTotal, grade, moderationDelta: data.moderationDelta, reason: data.moderationReason },
        ipAddress: data.ipAddress
      }, tx);

      return updated;
    });
  }

  // ─── APPROVE / REJECT MARKS ─────────────────────────────────────────
  async approveMarks(markId: string, data: {
    action: "APPROVE" | "REJECT";
    rejectionReason?: string;
    actorId: string;
    actorRole: string;
    ipAddress?: string;
  }) {
    const existingMark = await markRepo.findById(markId);
    if (!existingMark) throw ApiError.notFound("Mark record not found.");
    if ((existingMark as any).isLocked) throw ApiError.badRequest("Cannot change approval for a locked mark.");

    const approvalStatus = data.action === "APPROVE" ? "APPROVED" : "REJECTED";

    if (data.action === "REJECT" && !data.rejectionReason) {
      throw ApiError.badRequest("Rejection reason is required when rejecting marks.");
    }

    return prisma.$transaction(async (tx) => {
      const updated = await markRepo.updateApproval(markId, {
        approvalStatus,
        actorId: data.actorId,
        rejectionReason: data.rejectionReason
      }, tx);

      await auditRepo.append({
        examId: (existingMark as any).examId,
        examMarkId: markId,
        action: data.action === "APPROVE" ? "MARKS_APPROVED" : "MARKS_REJECTED",
        actorId: data.actorId,
        actorRole: data.actorRole,
        previousValue: { approvalStatus: (existingMark as any).approvalStatus },
        newValue: { approvalStatus, rejectionReason: data.rejectionReason },
        ipAddress: data.ipAddress
      }, tx);

      return updated;
    });
  }

  // ─── LOCK ALL MARKS FOR EXAM ─────────────────────────────────────────
  async lockMarksForExam(examId: string, actorId: string, actorRole: string) {
    return prisma.$transaction(async (tx) => {
      await markRepo.lockAllForExam(examId, tx);

      await auditRepo.append({
        examId,
        action: "ALL_MARKS_LOCKED",
        actorId,
        actorRole,
        metadata: { lockedAt: new Date().toISOString() }
      }, tx);

      return { message: "All approved marks for this exam have been locked successfully." };
    });
  }

  // ─── REQUEST RE-EVALUATION ──────────────────────────────────────────
  async requestReEvaluation(data: {
    examId: string;
    examMarkId?: string;
    studentId: string;
    reason: string;
  }) {
    const exam = await examRepo.findById(data.examId);
    if (!exam) throw ApiError.notFound("Examination not found.");

    if (!(exam as any).isLocked) {
      throw ApiError.badRequest("Re-evaluation can only be requested after results are locked.");
    }

    // Prevent duplicate requests
    const existing = await prisma.$queryRaw`
      SELECT id FROM "ReEvaluation"
      WHERE "examId" = ${data.examId} AND "studentId" = ${data.studentId}
      AND status NOT IN ('COMPLETED', 'REJECTED', 'WITHDRAWN')
      LIMIT 1
    ` as any[];

    if (existing && existing.length > 0) {
      throw ApiError.conflict("A re-evaluation request for this exam is already pending.");
    }

    return prisma.reEvaluation.create({
      data: {
        examId: data.examId,
        examMarkId: data.examMarkId,
        studentId: data.studentId,
        reason: data.reason
      },
      include: { exam: { include: { subject: true } }, student: true }
    });
  }

  // ─── PROCESS RE-EVALUATION ──────────────────────────────────────────
  async processReEvaluation(id: string, data: {
    status: "IN_REVIEW" | "COMPLETED" | "REJECTED";
    reviewNotes?: string;
    revisedMarks?: number;
    revisedGrade?: string;
    previousMarks?: number;
    previousGrade?: string;
    actorId: string;
    actorRole: string;
    universityId?: string | null;
  }) {
    const reEval = await prisma.reEvaluation.findUnique({
      where: { id },
      include: { exam: { include: { subject: true } } }
    });
    if (!reEval) throw ApiError.notFound("Re-evaluation request not found.");

    const result = await prisma.$transaction(async (tx) => {
      // a. Update ReEvaluation status
      const updatedReEval = await tx.reEvaluation.update({
        where: { id },
        data: {
          status: data.status,
          reviewedById: data.actorId,
          reviewedAt: new Date(),
          reviewNotes: data.reviewNotes,
          revisedMarks: data.revisedMarks,
          revisedGrade: data.revisedGrade,
          previousMarks: data.previousMarks,
          previousGrade: data.previousGrade,
          resolvedAt: ["COMPLETED", "REJECTED"].includes(data.status) ? new Date() : undefined
        }
      });

      // b. If completed, synchronize with ExamMark table
      if (data.status === "COMPLETED" && data.revisedMarks !== undefined) {
        if (!reEval.examMarkId) {
          throw ApiError.badRequest("Re-evaluation request is not linked to any mark record.");
        }

        const markRecord = await tx.examMark.findUnique({
          where: { id: reEval.examMarkId }
        });
        if (!markRecord) {
          throw ApiError.notFound("Associated exam mark record not found.");
        }

        const exam = reEval.exam;
        const maxMarks = exam.maxMarks || 100;
        const policy = await tx.gradingPolicy.findFirst({
          where: { universityId: data.universityId ?? null }
        });

        const { grade, gradePoint } = gradingService.computeGradeFromPolicy(data.revisedMarks, maxMarks, policy);
        const subjectCredits = (exam as any).subject?.course?.credits || 3;
        const creditPoints = gradePoint * subjectCredits;

        // Scale external marks as delta of new revised marks
        const externalMarks = data.revisedMarks -
          (markRecord.internalMarks || 0) -
          (markRecord.assignmentMarks || 0) -
          (markRecord.quizMarks || 0) -
          (markRecord.labMarks || 0) -
          (markRecord.projectMarks || 0) -
          (markRecord.presentationMarks || 0) -
          (markRecord.attendanceMarks || 0);

        const currentAuditTrail = Array.isArray(markRecord.auditTrail) ? markRecord.auditTrail : [];
        const updatedAuditTrail = [
          ...currentAuditTrail,
          {
            action: "MARKS_RE_EVALUATED",
            actorId: data.actorId,
            actorRole: data.actorRole,
            timestamp: new Date().toISOString(),
            previousValue: markRecord.totalMarks,
            previousGrade: markRecord.grade,
            value: data.revisedMarks,
            grade
          }
        ];

        await tx.examMark.update({
          where: { id: reEval.examMarkId },
          data: {
            totalMarks: data.revisedMarks,
            externalMarks: Math.max(0, externalMarks),
            grade,
            gradePoint,
            creditPoints,
            auditTrail: updatedAuditTrail
          }
        });

        await tx.examAuditLog.create({
          data: {
            examId: exam.id,
            examMarkId: markRecord.id,
            action: "MARKS_RE_EVALUATED",
            actorId: data.actorId,
            actorRole: data.actorRole,
            previousValue: { totalMarks: markRecord.totalMarks, grade: markRecord.grade },
            newValue: { totalMarks: data.revisedMarks, grade },
            metadata: { reEvaluationId: id }
          }
        });
      }

      return updatedReEval;
    });

    // Recalculate results outside lock to avoid long-running locks
    if (data.status === "COMPLETED" && data.revisedMarks !== undefined) {
      try {
        await resultService.processStudentResult({
          studentId: reEval.studentId,
          semester: reEval.exam.semester,
          academicYear: reEval.exam.academicYear,
          universityId: data.universityId,
          processedById: data.actorId
        });
      } catch (err) {
        console.error("Failed to automatically recalculate student GPA after re-evaluation:", err);
      }
    }

    return result;
  }

  // ─── GET MARKS BY EXAM ──────────────────────────────────────────────
  async getMarksByExam(examId: string) {
    const exam = await examRepo.findById(examId);
    if (!exam) throw ApiError.notFound("Examination not found.");
    return markRepo.findByExam(examId);
  }

  // ─── GET STUDENT MARKS ──────────────────────────────────────────────
  async getStudentMarks(studentId: string, params?: {
    semester?: string;
    academicYear?: string;
    examType?: string;
  }) {
    return markRepo.findByStudent(studentId, params);
  }

  // ─── PENDING APPROVALS ──────────────────────────────────────────────
  async getPendingApprovals(universityId: string | null, page: number, limit: number) {
    const data = await markRepo.findPendingApprovals(universityId);
    const meta = buildPaginatedMeta(data.length, {
      page, limit, sort: "submittedAt", order: "asc", search: ""
    });
    const paginated = (data as any[]).slice((page - 1) * limit, page * limit);
    return { data: paginated, meta };
  }
}
