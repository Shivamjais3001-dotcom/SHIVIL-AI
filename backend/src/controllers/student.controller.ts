import { Response, NextFunction } from "express";
import { StudentService } from "../services/student.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";
import { ApiError } from "../utils/api-error";

const studentService = new StudentService();

export class StudentController {
  async getStudents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "rollNo");
      
      const { data, meta } = await studentService.getStudents({
        ...pagination,
        branch: req.query.branch as string || undefined,
        semester: req.query.semester as string || undefined,
        status: req.query.status as string || undefined,
        category: req.query.category as string || undefined,
        scholarship: req.query.scholarship as string || undefined,
        hostel: req.query.hostel === "true" ? true : req.query.hostel === "false" ? false : undefined,
        universityId
      });

      return sendSuccessResponse(res, data, "Student registry retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async getStudentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await studentService.getStudentById(id, universityId);

      return sendSuccessResponse(res, result, "Student details retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async createStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await studentService.createStudent(req.body, universityId);
      return sendSuccessResponse(res, result, "Student admission registered successfully.", 210);
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await studentService.updateStudent(id, universityId, req.body);

      return sendSuccessResponse(res, result, "Student profile modified successfully.");
    } catch (error) {
      next(error);
    }
  }

  async archiveStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await studentService.archiveStudent(id, universityId);

      return sendSuccessResponse(res, result, "Student profile archived successfully.");
    } catch (error) {
      next(error);
    }
  }

  async restoreStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await studentService.restoreStudent(id, universityId);

      return sendSuccessResponse(res, result, "Student profile restored successfully.");
    } catch (error) {
      next(error);
    }
  }

  async deleteStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      await studentService.deleteStudent(id, universityId);

      return sendSuccessResponse(res, null, "Student profile soft-deleted from registry.");
    } catch (error) {
      next(error);
    }
  }

  async getStudentTimeline(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await studentService.getTimeline(id, universityId);

      return sendSuccessResponse(res, result, "Student lifecycle timeline log retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getStudentAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await studentService.getAnalytics(id, universityId);

      return sendSuccessResponse(res, result, "Student GPA & learning analytics data retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getStudentDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await studentService.getSummaryMetrics(universityId);

      return sendSuccessResponse(res, result, "Student dashboard counts aggregated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async bulkImport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const studentsList = req.body.students;

      if (!Array.isArray(studentsList)) {
        throw ApiError.badRequest("Bulk import expects 'students' as an array of objects.");
      }

      const result = await studentService.bulkImport(studentsList, universityId);
      return sendSuccessResponse(res, result, "Batch student records processed.", 201);
    } catch (error) {
      next(error);
    }
  }

  async bulkExport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const csvData = await studentService.bulkExport(universityId);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=students_export.csv");
      return res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}
