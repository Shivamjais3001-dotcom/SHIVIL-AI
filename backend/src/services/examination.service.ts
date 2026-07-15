import {
  ExamRepository,
  ExamAuditRepository
} from "../repositories/assessment.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";

const examRepo = new ExamRepository();
const auditRepo = new ExamAuditRepository();

export class ExaminationService {
  // ─── CREATE EXAM ────────────────────────────────────────────────────
  async createExam(data: {
    title: string;
    examType: string;
    subjectId: string;
    universityId?: string | null;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    classroomId?: string;
    invigilatorId?: string;
    venueDetails?: any;
    maxMarks?: number;
    passingMarks?: number;
    weightagePercent?: number;
    duration?: number;
    difficultyLevel?: string;
    createdById?: string;
  }) {
    const examDate = new Date(data.date);
    examDate.setHours(0, 0, 0, 0);

    // Conflict detection if classroom is specified
    if (data.classroomId) {
      const conflicts = await examRepo.detectConflict({
        classroomId: data.classroomId,
        date: examDate,
        startTime: data.startTime,
        endTime: data.endTime
      });

      if (conflicts.length > 0) {
        const conflicting = (conflicts as any[])[0];
        throw ApiError.conflict(
          `Scheduling conflict detected. Classroom is already booked for ${conflicting.title} (${conflicting.startTime} – ${conflicting.endTime}) on the same date.`
        );
      }
    }

    // Build conflict hash for future quick lookups
    const conflictHash = data.classroomId
      ? `${data.classroomId}:${examDate.toISOString().split("T")[0]}:${data.startTime}`
      : undefined;

    const exam = await examRepo.create({
      ...data,
      date: examDate,
      universityId: data.universityId || null,
      conflictHash
    });

    // Audit trail
    await auditRepo.append({
      examId: (exam as any).id,
      action: "EXAM_CREATED",
      actorId: data.createdById || "SYSTEM",
      actorRole: "EXAM_CONTROLLER",
      newValue: { examType: data.examType, date: data.date, subjectId: data.subjectId }
    });

    return exam;
  }

  // ─── GET EXAM BY ID ─────────────────────────────────────────────────
  async getExamById(id: string) {
    const exam = await examRepo.findById(id);
    if (!exam) throw ApiError.notFound("Examination record not found.");
    return exam;
  }

  // ─── UPDATE EXAM ────────────────────────────────────────────────────
  async updateExam(id: string, data: any, actorId: string, actorRole: string) {
    const exam = await examRepo.findById(id);
    if (!exam) throw ApiError.notFound("Examination record not found.");
    if ((exam as any).isLocked) throw ApiError.badRequest("Cannot modify a locked exam.");

    // Re-check conflicts if classroom or time changed
    if ((data.classroomId || data.startTime || data.endTime) && (data.classroomId || (exam as any).classroomId)) {
      const conflicts = await examRepo.detectConflict({
        classroomId: data.classroomId || (exam as any).classroomId,
        date: data.date ? new Date(data.date) : (exam as any).date,
        startTime: data.startTime || (exam as any).startTime,
        endTime: data.endTime || (exam as any).endTime,
        excludeExamId: id
      });

      if (conflicts.length > 0) {
        const conflicting = (conflicts as any[])[0];
        throw ApiError.conflict(
          `Scheduling conflict detected with: ${conflicting.title} at ${conflicting.startTime}–${conflicting.endTime}.`
        );
      }
    }

    const updated = await examRepo.update(id, data);

    await auditRepo.append({
      examId: id,
      action: "EXAM_UPDATED",
      actorId,
      actorRole,
      previousValue: { subjectId: (exam as any).subjectId },
      newValue: data
    });

    return updated;
  }

  // ─── LOCK EXAM ──────────────────────────────────────────────────────
  async lockExam(id: string, actorId: string, actorRole: string) {
    const exam = await examRepo.findById(id);
    if (!exam) throw ApiError.notFound("Examination record not found.");
    if ((exam as any).isLocked) throw ApiError.badRequest("Exam is already locked.");

    const locked = await examRepo.lock(id, actorId);

    await auditRepo.append({
      examId: id,
      action: "EXAM_LOCKED",
      actorId,
      actorRole,
      metadata: { lockedAt: new Date().toISOString() }
    });

    return locked;
  }

  // ─── SOFT DELETE ────────────────────────────────────────────────────
  async deleteExam(id: string, actorId: string, actorRole: string) {
    const exam = await examRepo.findById(id);
    if (!exam) throw ApiError.notFound("Examination record not found.");
    if ((exam as any).isLocked) throw ApiError.badRequest("Cannot delete a locked exam.");

    await examRepo.softDelete(id);

    await auditRepo.append({
      examId: id,
      action: "EXAM_DELETED",
      actorId,
      actorRole,
      metadata: { deletedAt: new Date().toISOString() }
    });

    return { message: "Examination record deleted successfully." };
  }

  // ─── LIST EXAMS ─────────────────────────────────────────────────────
  async getExams(params: {
    page: number;
    limit: number;
    sort: string;
    order: "asc" | "desc";
    subjectId?: string;
    examType?: string;
    semester?: string;
    academicYear?: string;
    approvalStatus?: string;
    universityId: string | null;
    fromDate?: string;
    toDate?: string;
  }) {
    const { total, data } = await examRepo.findAndCount({
      ...params,
      fromDate: params.fromDate ? new Date(params.fromDate) : undefined,
      toDate: params.toDate ? new Date(params.toDate) : undefined
    });

    const meta = buildPaginatedMeta(total, {
      page: params.page,
      limit: params.limit,
      sort: params.sort || "date",
      order: params.order || "desc",
      search: ""
    });

    return { data, meta };
  }

  // ─── EXAM CALENDAR ──────────────────────────────────────────────────
  async getExamCalendar(universityId: string | null, limit: number = 20) {
    return examRepo.findUpcoming(universityId, limit);
  }

  // ─── CONFLICT CHECK ─────────────────────────────────────────────────
  async checkConflicts(params: {
    classroomId: string;
    date: string;
    startTime: string;
    endTime: string;
    excludeExamId?: string;
  }) {
    const dateObj = new Date(params.date);
    dateObj.setHours(0, 0, 0, 0);

    const conflicts = await examRepo.detectConflict({
      classroomId: params.classroomId,
      date: dateObj,
      startTime: params.startTime,
      endTime: params.endTime,
      excludeExamId: params.excludeExamId
    });

    return {
      hasConflict: (conflicts as any[]).length > 0,
      conflicts,
      message: (conflicts as any[]).length > 0
        ? `${(conflicts as any[]).length} scheduling conflict(s) detected.`
        : "No scheduling conflicts found."
    };
  }

  // ─── AUDIT TRAIL ────────────────────────────────────────────────────
  async getExamAuditTrail(examId: string) {
    const exam = await examRepo.findById(examId);
    if (!exam) throw ApiError.notFound("Examination record not found.");
    return auditRepo.findByExam(examId);
  }
}
