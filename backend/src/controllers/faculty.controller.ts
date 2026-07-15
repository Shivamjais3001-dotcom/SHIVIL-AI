import { Response, NextFunction } from "express";
import { FacultyService } from "../services/faculty.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const facultyService = new FacultyService();

export class FacultyController {
  async getFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "name");
      
      const { data, meta } = await facultyService.getFaculty({
        ...pagination,
        department: req.query.department as string || undefined,
        universityId
      });

      return sendSuccessResponse(res, data, "Faculty directory retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async getFacultyById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await facultyService.getFacultyById(id, universityId);

      return sendSuccessResponse(res, result, "Faculty details retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async createFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await facultyService.createFaculty(req.body);
      return sendSuccessResponse(res, result, "Faculty profile registered successfully.", 210);
    } catch (error) {
      next(error);
    }
  }

  async updateFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await facultyService.updateFaculty(id, universityId, req.body);

      return sendSuccessResponse(res, result, "Faculty profile modified successfully.");
    } catch (error) {
      next(error);
    }
  }

  async deleteFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      await facultyService.deleteFaculty(id, universityId);

      return sendSuccessResponse(res, null, "Faculty record soft-deleted successfully.");
    } catch (error) {
      next(error);
    }
  }
}
