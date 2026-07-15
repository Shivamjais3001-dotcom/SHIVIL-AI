import { Response, NextFunction } from "express";
import { DepartmentService } from "../services/department.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";

const departmentService = new DepartmentService();

export class DepartmentController {
  async getDepartments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pagination = parsePaginationParams(req.query, "code");
      const { data, meta } = await departmentService.getDepartments(pagination);

      return sendSuccessResponse(res, data, "Departments list retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await departmentService.getDepartmentById(id);
      return sendSuccessResponse(res, result, "Department details retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async createDepartment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await departmentService.createDepartment(req.body);
      return sendSuccessResponse(res, result, "Department created successfully.", 210);
    } catch (error) {
      next(error);
    }
  }

  async updateDepartment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await departmentService.updateDepartment(id, req.body);
      return sendSuccessResponse(res, result, "Department updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async deleteDepartment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await departmentService.deleteDepartment(id);
      return sendSuccessResponse(res, null, "Department deleted successfully.");
    } catch (error) {
      next(error);
    }
  }
}
