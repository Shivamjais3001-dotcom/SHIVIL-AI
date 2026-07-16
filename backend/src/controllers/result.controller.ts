import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ResultService } from "../services/result.service";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const resultService = new ResultService();

export class ResultController {
  // ─── PROCESS SINGLE STUDENT RESULT ──────────────────────────────────
  async processStudentResult(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const processedById = req.user?.userId || "SYSTEM";
      const universityId = req.user?.universityId || null;
      const result = await resultService.processStudentResult({
        studentId: req.body.studentId,
        semester: req.body.semester,
        academicYear: req.body.academicYear,
        universityId,
        processedById
      });
      return sendSuccessResponse(res, result, "Student result processed and SGPA/CGPA computed.", 201);
    } catch (error) { next(error); }
  }

  // ─── BATCH PROCESS ENTIRE SEMESTER (ASYNC QUEUE) ────────────────────
  async processBatchResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const processedById = req.user?.userId || "SYSTEM";
      const universityId = req.user?.universityId || null;
      const job = await resultService.processBatchResults({
        semester: req.body.semester,
        academicYear: req.body.academicYear,
        universityId,
        branch: req.body.branch,
        processedById
      });
      return sendSuccessResponse(
        res,
        job,
        `Batch result processing job queued. Query status using job ID.`,
        202
      );
    } catch (error) { next(error); }
  }

  // ─── GET BATCH JOB STATUS ───────────────────────────────────────────
  async getJobStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const job = await resultService.getJobStatus(req.params.id);
      return sendSuccessResponse(res, job, "Batch processing job status retrieved.");
    } catch (error) { next(error); }
  }

  // ─── GET STUDENT RESULTS ─────────────────────────────────────────────
  async getStudentResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await resultService.getStudentResults(req.params.studentId);
      return sendSuccessResponse(res, result, "Student academic results retrieved.");
    } catch (error) { next(error); }
  }

  // ─── GENERATE TRANSCRIPT ─────────────────────────────────────────────
  async generateTranscript(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await resultService.generateTranscript(req.params.studentId, universityId);
      return sendSuccessResponse(res, result, "Academic transcript generated successfully.");
    } catch (error) { next(error); }
  }

  // ─── SEMESTER RESULTS LIST ───────────────────────────────────────────
  async getSemesterResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "cgpa");
      const { data, meta } = await resultService.getSemesterResults({
        semester: req.query.semester as string || "1",
        academicYear: req.query.academicYear as string || "",
        universityId,
        page: pagination.page,
        limit: pagination.limit
      });
      return sendSuccessResponse(res, data, "Semester results list retrieved.", 200, meta);
    } catch (error) { next(error); }
  }

  // ─── BACKLOG STUDENTS ────────────────────────────────────────────────
  async getBacklogStudents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await resultService.getBacklogStudents(universityId);
      return sendSuccessResponse(res, result, "Students with backlogs retrieved.");
    } catch (error) { next(error); }
  }
}
