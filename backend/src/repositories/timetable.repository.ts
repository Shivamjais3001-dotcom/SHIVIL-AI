import prisma from "../config/database";

export class TimetableRepository {
  async findById(id: string) {
    return prisma.timetable.findUnique({
      where: { id },
      include: { subject: { include: { course: true } }, faculty: true }
    });
  }

  async findConflicts(dayOfWeek: number, startTime: string, endTime: string, facultyId: string) {
    return prisma.timetable.findFirst({
      where: {
        dayOfWeek,
        facultyId,
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime }
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime }
          },
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime }
          }
        ]
      } as any
    });
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    dayOfWeek?: number;
    facultyId?: string;
    courseId?: string;
    universityId?: string | null;
  }) {
    const whereClause: any = {};

    if (params.dayOfWeek) {
      whereClause.dayOfWeek = params.dayOfWeek;
    }

    if (params.facultyId) {
      whereClause.facultyId = params.facultyId;
    }

    if (params.courseId) {
      whereClause.subject = { courseId: params.courseId };
    }

    if (params.universityId) {
      whereClause.faculty = {
        user: { universityId: params.universityId }
      } as any;
    }

    const [total, data] = await prisma.$transaction([
      prisma.timetable.count({ where: whereClause }),
      prisma.timetable.findMany({
        where: whereClause,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          subject: { include: { course: true } },
          faculty: true
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
      })
    ]);

    return { total, data };
  }

  async create(data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    subjectId: string;
    facultyId: string;
  }) {
    return prisma.timetable.create({
      data,
      include: { subject: true, faculty: true }
    });
  }

  async delete(id: string) {
    return prisma.timetable.delete({
      where: { id }
    });
  }
}
