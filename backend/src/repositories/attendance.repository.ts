import { AttendanceStatus } from "@prisma/client";
import prisma from "../config/database";

export class AttendanceRepository {
  async findById(id: string) {
    return prisma.attendance.findUnique({
      where: { id },
      include: { student: true, subject: true }
    });
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    sort: string;
    order: "asc" | "desc";
    search: string;
    cursor?: string;
    studentId?: string;
    subjectId?: string;
    status?: AttendanceStatus;
    universityId?: string | null;
  }) {
    const whereClause: any = {};

    if (params.studentId) {
      whereClause.studentId = params.studentId;
    }

    if (params.subjectId) {
      whereClause.subjectId = params.subjectId;
    }

    if (params.status) {
      whereClause.status = params.status;
    }

    if (params.universityId) {
      whereClause.student = {
        user: { universityId: params.universityId }
      };
    }

    if (params.search) {
      whereClause.student = {
        ...(whereClause.student || {}),
        name: { contains: params.search, mode: "insensitive" }
      };
    }

    const queryOptions: any = {
      where: whereClause,
      orderBy: { [params.sort]: params.order },
      take: params.limit,
      include: {
        student: true,
        subject: { include: { course: true } }
      }
    };

    if (params.cursor) {
      queryOptions.cursor = { id: params.cursor };
      queryOptions.skip = 1; // Skip the cursor itself to avoid duplication
    } else {
      queryOptions.skip = (params.page - 1) * params.limit;
    }

    const [total, data] = await prisma.$transaction([
      prisma.attendance.count({ where: whereClause }),
      prisma.attendance.findMany(queryOptions)
    ]);

    const nextCursor = data.length === params.limit ? data[data.length - 1].id : null;

    return { total, data, nextCursor };
  }

  async mark(data: { date: Date; status: AttendanceStatus; studentId: string; subjectId: string }) {
    return prisma.attendance.create({
      data,
      include: { student: true, subject: true }
    });
  }

  async update(id: string, data: { status: AttendanceStatus; date?: Date }) {
    return prisma.attendance.update({
      where: { id },
      data,
      include: { student: true, subject: true }
    });
  }

  async delete(id: string) {
    return prisma.attendance.delete({
      where: { id }
    });
  }

  async calculateRate(studentId: string): Promise<number> {
    const total = await prisma.attendance.count({
      where: { studentId }
    });

    if (total === 0) return 100.0;

    const present = await prisma.attendance.count({
      where: { studentId, status: AttendanceStatus.PRESENT }
    });

    return (present / total) * 100;
  }
}
