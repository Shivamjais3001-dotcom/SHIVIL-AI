import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

export class CourseController {
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await prisma.course.findMany();
      res.status(200).json({
        success: true,
        total: result.length,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, credits, semester } = req.body;
      const result = await prisma.course.create({
        data: { code, name, credits: Number(credits) || 3, semester }
      });

      res.status(201).json({
        success: true,
        message: "Course published successfully.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { code, name, credits, semester } = req.body;
      const result = await prisma.course.update({
        where: { id },
        data: { code, name, credits: credits !== undefined ? Number(credits) : undefined, semester }
      });
      res.status(200).json({
        success: true,
        message: "Course parameters updated successfully.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.course.delete({
        where: { id }
      });
      res.status(200).json({
        success: true,
        message: "Course removed from catalog successfully."
      });
    } catch (error) {
      next(error);
    }
  }
}
