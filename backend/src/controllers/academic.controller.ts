import { Response, NextFunction } from "express";
import { AcademicService } from "../services/academic.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const academicService = new AcademicService();

export class AcademicController {
  // Programs
  async createProgram(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await academicService.createProgram(req.body, universityId);
      return sendSuccessResponse(res, result, "Academic program catalog registered.", 201);
    } catch (error) {
      next(error);
    }
  }

  async getPrograms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "code");
      const { data, meta } = await academicService.getPrograms({
        page: pagination.page,
        limit: pagination.limit,
        universityId
      });
      return sendSuccessResponse(res, data, "Programs catalog retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  // Classrooms
  async createClassroom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await academicService.createClassroom(req.body, universityId);
      return sendSuccessResponse(res, result, "University classroom resource registered.", 201);
    } catch (error) {
      next(error);
    }
  }

  async getClassrooms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "building");
      const { data, meta } = await academicService.getClassrooms({
        page: pagination.page,
        limit: pagination.limit,
        universityId
      });
      return sendSuccessResponse(res, data, "Classrooms resources retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  // Course Offerings
  async createOffering(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await academicService.createOffering(req.body);
      return sendSuccessResponse(res, result, "Subject offering scheduled successfully.", 201);
    } catch (error) {
      next(error);
    }
  }

  async getOfferings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "section");
      
      const { data, meta } = await academicService.getOfferings({
        page: pagination.page,
        limit: pagination.limit,
        subjectId: req.query.subjectId as string || undefined,
        facultyId: req.query.facultyId as string || undefined,
        semester: req.query.semester as string || undefined,
        universityId
      });

      return sendSuccessResponse(res, data, "Scheduled course offerings list retrieved.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  // Enrollments Engine
  async enrollStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, offeringId } = req.body;
      const result = await academicService.enrollStudent(studentId, offeringId);
      return sendSuccessResponse(res, result, `Student enrollment status: ${result.status}`, 201);
    } catch (error) {
      next(error);
    }
  }

  async dropStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, offeringId } = req.body;
      const result = await academicService.dropStudent(studentId, offeringId);
      return sendSuccessResponse(res, result, "Course dropped and waitlists updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getEnrollments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "createdAt");

      const { data, meta } = await academicService.getEnrollments({
        page: pagination.page,
        limit: pagination.limit,
        studentId: req.query.studentId as string || undefined,
        offeringId: req.query.offeringId as string || undefined,
        universityId
      });

      return sendSuccessResponse(res, data, "Student course enrollments list retrieved.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  // Academic Calendar Events
  async createCalendarEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await academicService.createCalendarEvent(req.body, universityId);
      return sendSuccessResponse(res, result, "Academic calendar event registered.", 201);
    } catch (error) {
      next(error);
    }
  }

  async getCalendarEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "startDate");
      const { data, meta } = await academicService.getCalendarEvents({
        page: pagination.page,
        limit: pagination.limit,
        universityId
      });
      return sendSuccessResponse(res, data, "Academic calendar events list retrieved.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  // Academic Dashboard Summary
  async getAcademicDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await academicService.getAcademicDashboard(universityId);
      return sendSuccessResponse(res, result, "Academic dashboard utilization metrics aggregated.");
    } catch (error) {
      next(error);
    }
  }
}
