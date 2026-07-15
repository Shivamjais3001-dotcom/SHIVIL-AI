import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ExaminationService } from "../services/examination.service";
import { AssessmentService } from "../services/assessment.service";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const examinationService = new ExaminationService();
const assessmentService = new AssessmentService();

export class ExaminationController {
  // ─── EXAM CRUD ──────────────────────────────────────────────────────
  async createExam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const createdById = req.user?.userId;
      const result = await examinationService.createExam({
        ...req.body,
        universityId,
        createdById
      });
      return sendSuccessResponse(res, result, "Examination scheduled and registered successfully.", 201);
    } catch (error) { next(error); }
  }

  async getExams(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "date");
      const { data, meta } = await examinationService.getExams({
        page: pagination.page,
        limit: pagination.limit,
        sort: pagination.sort,
        order: pagination.order,
        subjectId: req.query.subjectId as string || undefined,
        examType: req.query.examType as string || undefined,
        semester: req.query.semester as string || undefined,
        academicYear: req.query.academicYear as string || undefined,
        approvalStatus: req.query.approvalStatus as string || undefined,
        fromDate: req.query.fromDate as string || undefined,
        toDate: req.query.toDate as string || undefined,
        universityId
      });
      return sendSuccessResponse(res, data, "Examination schedule list retrieved.", 200, meta);
    } catch (error) { next(error); }
  }

  async getExamById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await examinationService.getExamById(req.params.id);
      return sendSuccessResponse(res, result, "Examination details retrieved.");
    } catch (error) { next(error); }
  }

  async updateExam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "UNKNOWN";
      const result = await examinationService.updateExam(req.params.id, req.body, actorId, actorRole);
      return sendSuccessResponse(res, result, "Examination record updated successfully.");
    } catch (error) { next(error); }
  }

  async deleteExam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "UNKNOWN";
      const result = await examinationService.deleteExam(req.params.id, actorId, actorRole);
      return sendSuccessResponse(res, result, "Examination record deleted.");
    } catch (error) { next(error); }
  }

  async lockExam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "UNKNOWN";
      const result = await examinationService.lockExam(req.params.id, actorId, actorRole);
      return sendSuccessResponse(res, result, "Examination locked. No further edits are permitted.");
    } catch (error) { next(error); }
  }

  // ─── CALENDAR & CONFLICT ────────────────────────────────────────────
  async getExamCalendar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await examinationService.getExamCalendar(universityId, limit);
      return sendSuccessResponse(res, result, "Exam calendar retrieved.");
    } catch (error) { next(error); }
  }

  async checkConflicts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await examinationService.checkConflicts({
        classroomId: req.query.classroomId as string,
        date: req.query.date as string,
        startTime: req.query.startTime as string,
        endTime: req.query.endTime as string,
        excludeExamId: req.query.excludeExamId as string || undefined
      });
      return sendSuccessResponse(res, result, "Conflict detection completed.");
    } catch (error) { next(error); }
  }

  async getAuditTrail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await examinationService.getExamAuditTrail(req.params.id);
      return sendSuccessResponse(res, result, "Exam audit trail retrieved.");
    } catch (error) { next(error); }
  }

  // ─── ASSESSMENT COMPONENTS ──────────────────────────────────────────
  async setAssessmentComponents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await assessmentService.setComponents(req.body.subjectId, {
        ...req.body,
        universityId
      });
      return sendSuccessResponse(res, result, "Assessment component configuration saved.", 201);
    } catch (error) { next(error); }
  }

  async getAssessmentComponents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await assessmentService.getComponentsBySubject(req.params.subjectId);
      return sendSuccessResponse(res, result, "Assessment components retrieved.");
    } catch (error) { next(error); }
  }
}
