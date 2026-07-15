import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import prisma from "../config/database";
import { CustomError } from "../utils/custom-error";

export class AIController {
  async getConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new CustomError("Access denied", 401);
      
      const result = await prisma.aIConversation.findMany({
        where: { userId: req.user.userId },
        orderBy: { updatedAt: "desc" }
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async saveConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new CustomError("Access denied", 401);
      const { history, context } = req.body;

      const result = await prisma.aIConversation.create({
        data: {
          userId: req.user.userId,
          history: history || [],
          context: context || ""
        }
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
