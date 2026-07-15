import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AIService } from "../services/ai.service";
import { sendSuccessResponse } from "../utils/response";
import { ApiError } from "../utils/api-error";

const aiService = new AIService();

export class AIController {
  async getConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw ApiError.unauthorized("Access denied. Unauthorized session.");

      const result = await aiService.getConversations(userId);
      return sendSuccessResponse(res, result, "AI Conversations history retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async saveConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw ApiError.unauthorized("Access denied. Unauthorized session.");

      const { history, context } = req.body;
      const result = await aiService.saveConversation({
        userId,
        history,
        context
      });

      return sendSuccessResponse(res, result, "AI Conversation session logged successfully.", 201);
    } catch (error) {
      next(error);
    }
  }
}
