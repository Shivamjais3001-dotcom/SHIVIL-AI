import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { GradingService } from "../services/grading.service";
import { sendSuccessResponse } from "../utils/response";

const gradingService = new GradingService();

export class GradingController {
  async setGradingPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await gradingService.setGradingPolicy(universityId, req.body);
      return sendSuccessResponse(res, result, "University grading policy configured successfully.", 201);
    } catch (error) { next(error); }
  }

  async getGradingPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await gradingService.getGradingPolicy(universityId);
      return sendSuccessResponse(res, result, "University grading policy retrieved.");
    } catch (error) { next(error); }
  }

  // Helper: simulate grade computation without writing to DB (useful for faculty to check)
  async simulateGrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const policy = await gradingService.getGradingPolicy(universityId);
      const { marks, maxMarks } = req.body;
      const result = gradingService.computeGradeFromPolicy(marks, maxMarks || 100, policy);
      return sendSuccessResponse(res, result, "Grade simulation computed.");
    } catch (error) { next(error); }
  }
}
