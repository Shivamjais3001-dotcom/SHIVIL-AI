import { Response, NextFunction } from "express";
import { AttendanceService } from "../services/attendance.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";
import { AttendanceStatus } from "@prisma/client";

const attendanceService = new AttendanceService();

export class AttendanceController {
  async getAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "date");

      const { data, meta } = await attendanceService.getAttendance({
        ...pagination,
        studentId: req.query.studentId as string || undefined,
        subjectId: req.query.subjectId as string || undefined,
        status: req.query.status as AttendanceStatus || undefined,
        universityId
      });

      return sendSuccessResponse(res, data, "Attendance logs list retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async markAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.markAttendance(req.body);
      return sendSuccessResponse(res, result, "Attendance logged successfully.", 201);
    } catch (error) {
      next(error);
    }
  }
}
