import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { MarksService } from "../services/marks.service";
import { ReEvaluationRepository } from "../repositories/assessment.repository";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const marksService = new MarksService();
const reEvalRepo = new ReEvaluationRepository();

export class MarksController {
  // ─── SINGLE MARK ENTRY ──────────────────────────────────────────────
  async enterMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "FACULTY";
      const universityId = req.user?.universityId || null;
      const ipAddress = req.ip;

      const result = await marksService.enterMarks({
        ...req.body,
        actorId,
        actorRole,
        universityId,
        ipAddress
      });
      return sendSuccessResponse(res, result, "Marks recorded and submitted for approval.", 201);
    } catch (error) { next(error); }
  }

  // ─── BULK MARKS ENTRY ───────────────────────────────────────────────
  async bulkEnterMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "FACULTY";
      const universityId = req.user?.universityId || null;
      const ipAddress = req.ip;

      const result = await marksService.bulkEnterMarks({
        examId: req.body.examId,
        records: req.body.records,
        actorId,
        actorRole,
        universityId,
        ipAddress
      });
      return sendSuccessResponse(
        res,
        result,
        `Bulk marks entry complete. ${result.processed} records processed.`,
        201
      );
    } catch (error) { next(error); }
  }

  // ─── MODERATE MARKS ─────────────────────────────────────────────────
  async moderateMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "HOD";
      const universityId = req.user?.universityId || null;
      const ipAddress = req.ip;

      const result = await marksService.moderateMarks(req.params.id, {
        moderationDelta: req.body.moderationDelta,
        moderationReason: req.body.moderationReason,
        actorId,
        actorRole,
        universityId,
        ipAddress
      });
      return sendSuccessResponse(res, result, "Marks moderation applied and sent for re-review.");
    } catch (error) { next(error); }
  }

  // ─── APPROVE / REJECT ───────────────────────────────────────────────
  async approveMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "EXAM_CONTROLLER";
      const ipAddress = req.ip;

      const result = await marksService.approveMarks(req.params.id, {
        action: req.body.action,
        rejectionReason: req.body.rejectionReason,
        actorId,
        actorRole,
        ipAddress
      });

      const msg = req.body.action === "APPROVE"
        ? "Marks approved and workflow advanced."
        : "Marks rejected. Faculty will be notified for re-submission.";
      return sendSuccessResponse(res, result, msg);
    } catch (error) { next(error); }
  }

  // ─── LOCK ALL MARKS FOR EXAM ─────────────────────────────────────────
  async lockMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "EXAM_CONTROLLER";
      const result = await marksService.lockMarksForExam(req.params.examId, actorId, actorRole);
      return sendSuccessResponse(res, result, "All marks locked. Results are finalized.");
    } catch (error) { next(error); }
  }

  // ─── GET MARKS BY EXAM ──────────────────────────────────────────────
  async getMarksByExam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await marksService.getMarksByExam(req.params.examId);
      return sendSuccessResponse(res, result, "Marks for examination retrieved.");
    } catch (error) { next(error); }
  }

  // ─── GET STUDENT MARKS ──────────────────────────────────────────────
  async getStudentMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const result = await marksService.getStudentMarks(studentId, {
        semester: req.query.semester as string || undefined,
        academicYear: req.query.academicYear as string || undefined,
        examType: req.query.examType as string || undefined
      });
      return sendSuccessResponse(res, result, "Student marks history retrieved.");
    } catch (error) { next(error); }
  }

  // ─── PENDING APPROVALS ──────────────────────────────────────────────
  async getPendingApprovals(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "submittedAt");
      const { data, meta } = await marksService.getPendingApprovals(
        universityId,
        pagination.page,
        pagination.limit
      );
      return sendSuccessResponse(res, data, "Pending mark approvals retrieved.", 200, meta);
    } catch (error) { next(error); }
  }

  // ─── RE-EVALUATION ──────────────────────────────────────────────────
  async requestReEvaluation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await marksService.requestReEvaluation({
        examId: req.body.examId,
        examMarkId: req.body.examMarkId,
        studentId: req.body.studentId,
        reason: req.body.reason
      });
      return sendSuccessResponse(res, result, "Re-evaluation request submitted successfully.", 201);
    } catch (error) { next(error); }
  }

  async getReEvaluations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "createdAt");
      const { total, data } = await reEvalRepo.findAndCount({
        page: pagination.page,
        limit: pagination.limit,
        status: req.query.status as string || undefined,
        studentId: req.query.studentId as string || undefined,
        examId: req.query.examId as string || undefined,
        universityId
      });

      return sendSuccessResponse(
        res,
        data,
        "Re-evaluation requests retrieved.",
        200,
        { total, page: pagination.page, limit: pagination.limit }
      );
    } catch (error) { next(error); }
  }

  async processReEvaluation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actorId = req.user?.userId || "SYSTEM";
      const actorRole = req.user?.role || "EXAM_CONTROLLER";
      const universityId = req.user?.universityId || null;

      const result = await marksService.processReEvaluation(req.params.id, {
        status: req.body.status,
        reviewNotes: req.body.reviewNotes,
        revisedMarks: req.body.revisedMarks,
        revisedGrade: req.body.revisedGrade,
        previousMarks: req.body.previousMarks,
        previousGrade: req.body.previousGrade,
        actorId,
        actorRole,
        universityId
      });
      return sendSuccessResponse(res, result, "Re-evaluation processed successfully.");
    } catch (error) { next(error); }
  }
}
