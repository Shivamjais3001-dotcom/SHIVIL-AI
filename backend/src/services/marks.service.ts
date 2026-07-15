import {
  ExamMarkRepository,
  ExamRepository,
  ExamAuditRepository,
  GradingPolicyRepository
} from "../repositories/assessment.repository";
import { ApiError } from "../utils/api-error";
import { GradingService } from "./grading.service";
import { buildPaginatedMeta } from "../utils/pagination";

const markRepo = new ExamMarkRepository();
const examRepo = new ExamRepository();
const auditRepo = new ExamAuditRepository();
const policyRepo = new GradingPolicyRepository();
const gradingService = new GradingService();

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

    // Calculate total marks
    const totalMarks =
      (data.internalMarks || 0) +
      (data.externalMarks || 0) +
      (data.assignmentMarks || 0) +
      (data.quizMarks || 0) +
      (data.labMarks || 0) +
      (data.projectMarks || 0) +
      (data.presentationMarks || 0) +
      (data.attendanceMarks || 0);

    // Validate total doesn't exceed maxMarks
    const maxMarks = (exam as any).maxMarks || 100;
    if (totalMarks > maxMarks) {
      throw ApiError.badRequest(
        `Total marks (${totalMarks}) cannot exceed maximum marks (${maxMarks}) for this exam.`
      );
    }

    // Compute grade
    const policy = await policyRepo.findByUniversity(data.universityId || null);
    const { grade, gradePoint } = gradingService.computeGradeFromPolicy(totalMarks, maxMarks, policy);
    const creditPoints = gradePoint; // Placeholder; actual = gradePoint * subject.credits

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
    });

    await auditRepo.append({
      examId: data.examId,
      examMarkId: (mark as any).id,
      action: "MARKS_ENTERED",
      actorId: data.actorId,
      actorRole: data.actorRole,
      newValue: { totalMarks, grade, gradePoint },
      ipAddress: data.ipAddress
    });

    return mark;
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

    const maxMarks = (exam as any).maxMarks || 100;
    const policy = await policyRepo.findByUniversity(data.universityId || null);

    // Validate all records before transactional write
    const processedRecords: any[] = [];
    const validationErrors: any[] = [];

    for (const rec of data.records) {
      const totalMarks =
        (rec.internalMarks || 0) + (rec.externalMarks || 0) +
        (rec.assignmentMarks || 0) + (rec.quizMarks || 0) +
        (rec.labMarks || 0) + (rec.projectMarks || 0) +
        (rec.presentationMarks || 0);

      if (totalMarks > maxMarks) {
        validationErrors.push({
          studentId: rec.studentId,
          error: `Total marks (${totalMarks}) exceeds maximum (${maxMarks})`
        });
        continue;
      }

      const { grade, gradePoint } = gradingService.computeGradeFromPolicy(totalMarks, maxMarks, policy);

      processedRecords.push({
        ...rec,
        totalMarks,
        grade,
        gradePoint,
        creditPoints: gradePoint
      });
    }

    if (validationErrors.length > 0) {
      throw ApiError.badRequest("Bulk marks validation failed.", validationErrors);
    }

    const results = await markRepo.bulkUpsert(data.examId, processedRecords, data.actorId);

    await auditRepo.append({
      examId: data.examId,
      action: "BULK_MARKS_ENTERED",
      actorId: data.actorId,
      actorRole: data.actorRole,
      newValue: { count: results.length },
      ipAddress: data.ipAddress
    });

    return {
      processed: results.length,
      total: data.records.length,
      marks: results
    };
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

    const updated = await markRepo.moderate(markId, {
      moderationDelta: data.moderationDelta,
      moderationReason: data.moderationReason,
      actorId: data.actorId,
      previousTotal,
      newTotal,
      grade,
      gradePoint
    });

    await auditRepo.append({
      examId: (existingMark as any).examId,
      examMarkId: markId,
      action: "MARKS_MODERATED",
      actorId: data.actorId,
      actorRole: data.actorRole,
      previousValue: { totalMarks: previousTotal, grade: (existingMark as any).grade },
      newValue: { totalMarks: newTotal, grade, moderationDelta: data.moderationDelta, reason: data.moderationReason },
      ipAddress: data.ipAddress
    });

    return updated;
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

    const updated = await markRepo.updateApproval(markId, {
      approvalStatus,
      actorId: data.actorId,
      rejectionReason: data.rejectionReason
    });

    await auditRepo.append({
      examId: (existingMark as any).examId,
      examMarkId: markId,
      action: data.action === "APPROVE" ? "MARKS_APPROVED" : "MARKS_REJECTED",
      actorId: data.actorId,
      actorRole: data.actorRole,
      previousValue: { approvalStatus: (existingMark as any).approvalStatus },
      newValue: { approvalStatus, rejectionReason: data.rejectionReason },
      ipAddress: data.ipAddress
    });

    return updated;
  }

  // ─── LOCK ALL MARKS FOR EXAM ─────────────────────────────────────────
  async lockMarksForExam(examId: string, actorId: string, actorRole: string) {
    await markRepo.lockAllForExam(examId);

    await auditRepo.append({
      examId,
      action: "ALL_MARKS_LOCKED",
      actorId,
      actorRole,
      metadata: { lockedAt: new Date().toISOString() }
    });

    return { message: "All approved marks for this exam have been locked successfully." };
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
    const existing = await (
      await import("../config/database")
    ).default.$queryRaw`
      SELECT id FROM "ReEvaluation"
      WHERE "examId" = ${data.examId} AND "studentId" = ${data.studentId}
      AND status NOT IN ('COMPLETED', 'REJECTED', 'WITHDRAWN')
      LIMIT 1
    ` as any[];

    if (existing && existing.length > 0) {
      throw ApiError.conflict("A re-evaluation request for this exam is already pending.");
    }

    const prismaModule = await import("../config/database");
    return (prismaModule.default as any).reEvaluation.create({
      data: {
        examId: data.examId,
        examMarkId: data.examMarkId,
        studentId: data.studentId,
        reason: data.reason
      },
      include: { exam: { include: { subject: true } }, student: true }
    });
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
