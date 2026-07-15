import { Response, NextFunction } from "express";
import { StudentService } from "../services/student.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

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
        universityId
      });

      return sendSuccessResponse(res, data, "Student catalog retrieved successfully.", 200, meta);
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
      const result = await studentService.createStudent(req.body);
      return sendSuccessResponse(res, result, "Student profile registered successfully.", 210);
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await studentService.updateStudent(id, universityId, req.body);

      return sendSuccessResponse(res, result, "Student record modified successfully.");
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
}
