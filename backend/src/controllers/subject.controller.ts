import { Response, NextFunction } from "express";
import { SubjectService } from "../services/subject.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const subjectService = new SubjectService();

export class SubjectController {
  async getSubjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pagination = parsePaginationParams(req.query, "code");
      const { data, meta } = await subjectService.getSubjects({
        ...pagination,
        courseId: req.query.courseId as string || undefined,
        facultyId: req.query.facultyId as string || undefined
      });

      return sendSuccessResponse(res, data, "Subjects catalog retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async getSubjectById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await subjectService.getSubjectById(id);
      return sendSuccessResponse(res, result, "Subject details retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async createSubject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await subjectService.createSubject(req.body);
      return sendSuccessResponse(res, result, "Subject registered successfully.", 210);
    } catch (error) {
      next(error);
    }
  }

  async updateSubject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await subjectService.updateSubject(id, req.body);
      return sendSuccessResponse(res, result, "Subject updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async deleteSubject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await subjectService.deleteSubject(id);
      return sendSuccessResponse(res, null, "Subject removed from registry.");
    } catch (error) {
      next(error);
    }
  }
}
