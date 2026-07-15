import { Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const courseService = new CourseService();

export class CourseController {
  async getCourses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pagination = parsePaginationParams(req.query, "code");
      const { data, meta } = await courseService.getCourses({
        ...pagination,
        semester: req.query.semester as string || undefined
      });

      return sendSuccessResponse(res, data, "Course catalog retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await courseService.getCourseById(id);
      return sendSuccessResponse(res, result, "Course details retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await courseService.createCourse(req.body);
      return sendSuccessResponse(res, result, "Course added to catalog successfully.", 210);
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await courseService.updateCourse(id, req.body);
      return sendSuccessResponse(res, result, "Course information updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await courseService.deleteCourse(id);
      return sendSuccessResponse(res, null, "Course removed from catalog successfully.");
    } catch (error) {
      next(error);
    }
  }
}
