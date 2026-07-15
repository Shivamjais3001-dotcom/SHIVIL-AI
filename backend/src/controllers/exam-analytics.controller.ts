import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ExamAnalyticsService } from "../services/exam-analytics.service";
import { sendSuccessResponse } from "../utils/response";

const analyticsService = new ExamAnalyticsService();

export class ExamAnalyticsController {
  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await analyticsService.getDashboard(universityId);
      return sendSuccessResponse(res, result, "Examination analytics dashboard metrics retrieved.");
    } catch (error) { next(error); }
  }

  async getDepartmentComparison(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await analyticsService.getDepartmentComparison(universityId);
      return sendSuccessResponse(res, result, "Department-wise result comparison retrieved.");
    } catch (error) { next(error); }
  }

  async getSubjectDifficulty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await analyticsService.getSubjectDifficulty(universityId);
      return sendSuccessResponse(res, result, "Subject difficulty index computed.");
    } catch (error) { next(error); }
  }

  async getCGPADistribution(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await analyticsService.getCGPADistribution(universityId);
      return sendSuccessResponse(res, result, "CGPA distribution histogram retrieved.");
    } catch (error) { next(error); }
  }

  async getTopPerformers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await analyticsService.getTopPerformers({
        universityId,
        semester: req.query.semester as string || undefined,
        academicYear: req.query.academicYear as string || undefined,
        limit: parseInt(req.query.limit as string) || 10
      });
      return sendSuccessResponse(res, result, "Top performers list retrieved.");
    } catch (error) { next(error); }
  }

  async getPerformanceTrends(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await analyticsService.getPerformanceTrends(universityId);
      return sendSuccessResponse(res, result, "Performance trend data retrieved.");
    } catch (error) { next(error); }
  }

  async getBacklogAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await analyticsService.getBacklogAnalytics(universityId);
      return sendSuccessResponse(res, result, "Backlog analytics retrieved.");
    } catch (error) { next(error); }
  }
}
