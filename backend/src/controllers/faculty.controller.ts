import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

export class FacultyController {
  async getFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await prisma.faculty.findMany({
        where: { deletedAt: null }
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

  async createFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, name, department, specialty } = req.body;
      const result = await prisma.faculty.create({
        data: { userId, name, department, specialty }
      });

      res.status(201).json({
        success: true,
        message: "Faculty profile created successfully.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
