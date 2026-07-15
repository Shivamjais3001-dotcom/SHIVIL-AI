import { Response, NextFunction } from "express";
import { AttendanceService } from "../services/attendance.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";
import { ApiError } from "../utils/api-error";

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
        sessionId: req.query.sessionId as string || undefined,
        status: req.query.status as string || undefined,
        universityId
      });

      return sendSuccessResponse(res, data, "Attendance logs list retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async markAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Retain for backward compatibility using checkin mapping logic
      const result = await attendanceService.studentCheckin(req.body);
      return sendSuccessResponse(res, result, "Attendance logged successfully.", 201);
    } catch (error) {
      next(error);
    }
  }

  async startSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.startSession(req.body);
      return sendSuccessResponse(res, result, "Attendance session started successfully.", 201);
    } catch (error) {
      next(error);
    }
  }

  async closeSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await attendanceService.closeSession(id);
      return sendSuccessResponse(res, result, "Attendance session closed successfully.");
    } catch (error) {
      next(error);
    }
  }

  async studentCheckin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.studentCheckin(req.body);
      return sendSuccessResponse(res, result, "Student check-in logged successfully.", 201);
    } catch (error) {
      next(error);
    }
  }

  async facultyCheckin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.facultyCheckinCheckout(req.body);
      return sendSuccessResponse(res, result, "Faculty check-in/out recorded successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getAnomalies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await attendanceService.getAnomalies(universityId);
      return sendSuccessResponse(res, result, "Attendance anomalies list retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getAtRiskStudents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const threshold = req.query.threshold ? parseFloat(req.query.threshold as string) : undefined;
      const result = await attendanceService.getAtRiskStudents(universityId, threshold);
      return sendSuccessResponse(res, result, "At-risk students under attendance threshold retrieved.");
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await attendanceService.getSummaryMetrics(universityId);
      return sendSuccessResponse(res, result, "Attendance dashboard rates calculated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async exportReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const type = req.query.type as "student" | "subject" | "faculty";
      const scopeId = req.query.scopeId as string;

      if (!type || !scopeId) {
        throw ApiError.badRequest("Missing type or scopeId query parameters to export reports.");
      }

      const csvData = await attendanceService.getReports(type, scopeId, universityId);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=attendance_${type}_report.csv`);
      return res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}
