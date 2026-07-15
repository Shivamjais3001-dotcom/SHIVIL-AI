import prisma from "../config/database";

export class ProgramRepository {
  async create(data: any) {
    return prisma.program.create({
      data
    } as any);
  }

  async findById(id: string) {
    return prisma.program.findUnique({
      where: { id }
    } as any);
  }

  async findAndCount(params: { page: number; limit: number; universityId?: string | null }) {
    const whereClause: any = {};
    if (params.universityId) {
      whereClause.universityId = params.universityId;
    }

    const [total, data] = await prisma.$transaction([
      prisma.program.count({ where: whereClause } as any),
      prisma.program.findMany({
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
    return prisma.classroom.create({
      data
    } as any);
  }

  async findById(id: string) {
    return prisma.classroom.findUnique({
      where: { id }
    } as any);
  }

  async findAndCount(params: { page: number; limit: number; universityId?: string | null }) {
    const whereClause: any = {};
    if (params.universityId) {
      whereClause.universityId = params.universityId;
    }

    const [total, data] = await prisma.$transaction([
      prisma.classroom.count({ where: whereClause } as any),
      prisma.classroom.findMany({
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
    return prisma.courseOffering.create({
      data,
      include: { subject: true, faculty: true, classroom: true }
    } as any);
  }

  async findById(id: string) {
    return prisma.courseOffering.findUnique({
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
      prisma.courseOffering.count({ where: whereClause } as any),
      prisma.courseOffering.findMany({
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
    return prisma.courseOffering.update({
      where: { id },
      data: { status }
    } as any);
  }
}

export class EnrollmentRepository {
  async create(data: any) {
    return prisma.enrollment.create({
      data,
      include: { student: true, offering: { include: { subject: true } } }
    } as any);
  }

  async findById(id: string) {
    return prisma.enrollment.findUnique({
      where: { id }
    } as any);
  }

  async findActiveEnrollment(studentId: string, offeringId: string) {
    return prisma.enrollment.findFirst({
      where: { studentId, offeringId, status: "ENROLLED" }
    } as any);
  }

  async updateStatus(id: string, status: string) {
    return prisma.enrollment.update({
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
      prisma.enrollment.count({ where: whereClause } as any),
      prisma.enrollment.findMany({
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
    return prisma.academicCalendar.create({
      data
    } as any);
  }

  async findAndCount(params: { page: number; limit: number; universityId?: string | null }) {
    const whereClause: any = {};
    if (params.universityId) {
      whereClause.universityId = params.universityId;
    }

    const [total, data] = await prisma.$transaction([
      prisma.academicCalendar.count({ where: whereClause } as any),
      prisma.academicCalendar.findMany({
        where: whereClause,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { startDate: "asc" }
      } as any)
    ]);

    return { total, data };
  }
}
