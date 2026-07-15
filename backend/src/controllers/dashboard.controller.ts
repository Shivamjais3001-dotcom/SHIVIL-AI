import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

export class DashboardController {
  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const [studentsCount, facultyCount, coursesCount, attendanceCount] = await Promise.all([
        prisma.student.count({ where: { deletedAt: null } }),
        prisma.faculty.count({ where: { deletedAt: null } }),
        prisma.course.count(),
        prisma.attendance.count()
      ]);

      res.status(200).json({
        success: true,
        data: {
          activeStudents: studentsCount || 0,
          activeFaculty: facultyCount || 0,
          totalCourses: coursesCount || 0,
          totalAttendanceLogs: attendanceCount || 0,
          averages: {
            attendanceRate: "88.5%"
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
