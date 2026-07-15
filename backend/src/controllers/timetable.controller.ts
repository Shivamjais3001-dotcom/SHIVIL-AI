import { Response, NextFunction } from "express";
import { TimetableService } from "../services/timetable.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const timetableService = new TimetableService();

export class TimetableController {
  async getTimetable(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "dayOfWeek");

      const { data, meta } = await timetableService.getTimetable({
        page: pagination.page,
        limit: pagination.limit,
        dayOfWeek: req.query.dayOfWeek ? parseInt(req.query.dayOfWeek as string) : undefined,
        facultyId: req.query.facultyId as string || undefined,
        courseId: req.query.courseId as string || undefined,
        universityId
      });

      return sendSuccessResponse(res, data, "Timetable entries list retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async getTimetableById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await timetableService.getTimetableById(id);
      return sendSuccessResponse(res, result, "Timetable entry details retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async createTimetable(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await timetableService.createTimetable(req.body);
      return sendSuccessResponse(res, result, "Timetable entry scheduled successfully.", 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteTimetable(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await timetableService.deleteTimetable(id);
      return sendSuccessResponse(res, null, "Timetable entry cancelled successfully.");
    } catch (error) {
      next(error);
    }
  }
}
