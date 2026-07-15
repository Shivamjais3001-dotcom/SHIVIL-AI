import { Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";

const dashboardService = new DashboardService();

export class DashboardController {
  async getMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await dashboardService.getMetrics(universityId);

      return sendSuccessResponse(res, result, "Real-time university ERP dashboard metrics aggregated successfully.");
    } catch (error) {
      next(error);
    }
  }
}
