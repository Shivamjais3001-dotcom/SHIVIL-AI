import prisma from "../config/database";

export class ProgramRepository {
  async create(data: any) {
    return (prisma as any).program.create({
      data
    } as any);
  }

  async findById(id: string) {
    return (prisma as any).program.findUnique({
      where: { id }
    } as any);
  }

  async findAndCount(params: { page: number; limit: number; universityId?: string | null }) {
    const whereClause: any = {};
    if (params.universityId) {
      whereClause.universityId = params.universityId;
    }

    const [total, data] = await prisma.$transaction([
      (prisma as any).program.count({ where: whereClause } as any),
      (prisma as any).program.findMany({
        where: whereClause,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { code: "asc" }
      } as any)
    ]);

    return { total, data };
  }
}

export class ClassroomRepository {
  async create(data: any) {
    return (prisma as any).classroom.create({
      data
    } as any);
  }

  async findById(id: string) {
    return (prisma as any).classroom.findUnique({
      where: { id }
    } as any);
  }

  async findAndCount(params: { page: number; limit: number; universityId?: string | null }) {
    const whereClause: any = {};
    if (params.universityId) {
      whereClause.universityId = params.universityId;
    }

    const [total, data] = await prisma.$transaction([
      (prisma as any).classroom.count({ where: whereClause } as any),
      (prisma as any).classroom.findMany({
        where: whereClause,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: [{ building: "asc" }, { roomNo: "asc" }]
      } as any)
    ]);

    return { total, data };
  }
}

export class CourseOfferingRepository {
  async create(data: any) {
    return (prisma as any).courseOffering.create({
      data,
      include: { subject: true, faculty: true, classroom: true }
    } as any);
  }

  async findById(id: string) {
    return (prisma as any).courseOffering.findUnique({
      where: { id },
      include: {
        subject: { include: { course: true } },
        faculty: true,
        classroom: true,
        enrollments: { include: { student: true } }
      }
    } as any);
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    subjectId?: string;
    facultyId?: string;
    semester?: string;
    universityId?: string | null;
  }) {
    const whereClause: any = {};

    if (params.subjectId) {
      whereClause.subjectId = params.subjectId;
    }

    if (params.facultyId) {
      whereClause.facultyId = params.facultyId;
    }

    if (params.semester) {
      whereClause.semester = params.semester;
    }

    if (params.universityId) {
      whereClause.subject = {
        course: { universityId: params.universityId }
      } as any;
    }

    const [total, data] = await prisma.$transaction([
      (prisma as any).courseOffering.count({ where: whereClause } as any),
      (prisma as any).courseOffering.findMany({
        where: whereClause,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          subject: { include: { course: true } },
          faculty: true,
          classroom: true,
          _count: { select: { enrollments: true } }
        },
        orderBy: { section: "asc" }
      } as any)
    ]);

    return { total, data };
  }

  async updateStatus(id: string, status: string) {
    return (prisma as any).courseOffering.update({
      where: { id },
      data: { status }
    } as any);
  }
}

export class EnrollmentRepository {
  async create(data: any) {
    return (prisma as any).enrollment.create({
      data,
      include: { student: true, offering: { include: { subject: true } } }
    } as any);
  }

  async findById(id: string) {
    return (prisma as any).enrollment.findUnique({
      where: { id }
    } as any);
  }

  async findActiveEnrollment(studentId: string, offeringId: string) {
    return (prisma as any).enrollment.findFirst({
      where: { studentId, offeringId, status: "ENROLLED" }
    } as any);
  }

  async updateStatus(id: string, status: string) {
    return (prisma as any).enrollment.update({
      where: { id },
      data: { status }
    } as any);
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    studentId?: string;
    offeringId?: string;
    universityId?: string | null;
  }) {
    const whereClause: any = {};

    if (params.studentId) {
      whereClause.studentId = params.studentId;
    }

    if (params.offeringId) {
      whereClause.offeringId = params.offeringId;
    }

    if (params.universityId) {
      whereClause.student = { user: { universityId: params.universityId } } as any;
    }

    const [total, data] = await prisma.$transaction([
      (prisma as any).enrollment.count({ where: whereClause } as any),
      (prisma as any).enrollment.findMany({
        where: whereClause,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          student: true,
          offering: { include: { subject: true, faculty: true } }
        },
        orderBy: { createdAt: "desc" }
      } as any)
    ]);

    return { total, data };
  }
}

export class AcademicCalendarRepository {
  async create(data: any) {
    return (prisma as any).academicCalendar.create({
      data
    } as any);
  }

  async findAndCount(params: { page: number; limit: number; universityId?: string | null }) {
    const whereClause: any = {};
    if (params.universityId) {
      whereClause.universityId = params.universityId;
    }

    const [total, data] = await prisma.$transaction([
      (prisma as any).academicCalendar.count({ where: whereClause } as any),
      (prisma as any).academicCalendar.findMany({
        where: whereClause,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { startDate: "asc" }
      } as any)
    ]);

    return { total, data };
  }
}
