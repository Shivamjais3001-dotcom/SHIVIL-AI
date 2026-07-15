import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

export class AttendanceController {
  async getAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await prisma.attendance.findMany({
        include: {
          student: true,
          subject: true
        }
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

  async markAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, status, studentId, subjectId } = req.body;
      const result = await prisma.attendance.create({
        data: {
          date: new Date(date),
          status,
          studentId,
          subjectId
        }
      });

      res.status(201).json({
        success: true,
        message: "Attendance entry logged.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
