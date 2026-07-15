import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/student.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const studentService = new StudentService();

export class StudentController {
  async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, branch, semester } = req.query;
      const result = await studentService.getStudents({
        search: search as string,
        branch: branch as string,
        semester: semester as string
      });

      res.status(200).json({
        success: true,
        total: result.length,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await studentService.getStudentById(id);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await studentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: "Student profile cataloged successfully.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await studentService.updateStudent(id, req.body);
      res.status(200).json({
        success: true,
        message: "Student record modified successfully.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await studentService.deleteStudent(id);
      res.status(200).json({
        success: true,
        message: "Student profile removed from registry."
      });
    } catch (error) {
      next(error);
    }
  }
}
