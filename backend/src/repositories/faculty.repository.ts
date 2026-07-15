import prisma from "../config/database";

export class FacultyRepository {
  async findById(id: string, universityId?: string | null) {
    const whereClause: any = { id, deletedAt: null };
    if (universityId) {
      whereClause.user = { universityId } as any;
    }

    return prisma.faculty.findFirst({
      where: whereClause,
      include: {
        user: {
          select: { email: true, role: true, universityId: true } as any
        },
        subjects: true,
        schedules: {
          include: { subject: { include: { course: true } } }
        }
      }
    });
  }

  async findByEmployeeId(employeeId: string, universityId?: string | null) {
    const whereClause: any = { employeeId, deletedAt: null };
    if (universityId) {
      whereClause.user = { universityId } as any;
    }

    return prisma.faculty.findFirst({
      where: whereClause
    });
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    sort: string;
    order: "asc" | "desc";
    search: string;
    cursor?: string;
    department?: string;
    designation?: string;
    status?: string;
    universityId?: string | null;
  }) {
    const whereClause: any = { deletedAt: null };

    if (params.department) {
      whereClause.department = params.department;
    }

    if (params.designation) {
      whereClause.designation = params.designation;
    }

    if (params.status) {
      whereClause.status = params.status;
    }

    if (params.universityId) {
      whereClause.user = { universityId: params.universityId } as any;
    }

    if (params.search) {
      whereClause.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { department: { contains: params.search, mode: "insensitive" } },
        { employeeId: { contains: params.search, mode: "insensitive" } },
        { designation: { contains: params.search, mode: "insensitive" } },
        { qualification: { contains: params.search, mode: "insensitive" } }
      ];
    }

    const queryOptions: any = {
      where: whereClause,
      orderBy: { [params.sort]: params.order },
      take: params.limit,
      include: {
        user: {
          select: { email: true, role: true, universityId: true } as any
        }
      }
    };

    if (params.cursor) {
      queryOptions.cursor = { id: params.cursor };
      queryOptions.skip = 1;
    } else {
      queryOptions.skip = (params.page - 1) * params.limit;
    }

    const [total, data] = await prisma.$transaction([
      prisma.faculty.count({ where: whereClause }),
      prisma.faculty.findMany(queryOptions)
    ]);

    const nextCursor = data.length === params.limit ? data[data.length - 1].id : null;

    return { total, data, nextCursor };
  }

  async create(data: any) {
    return prisma.faculty.create({
      data,
      include: {
        user: {
          select: { email: true, role: true, universityId: true } as any
        }
      }
    });
  }

  async update(id: string, data: any) {
    return prisma.faculty.update({
      where: { id },
      data,
      include: {
        user: {
          select: { email: true, role: true, universityId: true } as any
        }
      }
    });
  }

  async archive(id: string) {
    return prisma.faculty.update({
      where: { id },
      data: { status: "Archived" }
    });
  }

  async restore(id: string) {
    return prisma.faculty.update({
      where: { id },
      data: { status: "Active", deletedAt: null }
    });
  }

  async delete(id: string) {
    return prisma.faculty.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async getSummaryMetrics(universityId: string | null) {
    const filter: any = { deletedAt: null };
    if (universityId) {
      filter.user = { universityId } as any;
    }

    const [
      total,
      active,
      departmentsCount,
      classesCount,
      recent
    ] = await Promise.all([
      prisma.faculty.count({ where: filter }),
      prisma.faculty.count({ where: { ...filter, status: "Active" } }),
      prisma.department.count(),
      prisma.timetable.count({
        where: universityId ? { faculty: { user: { universityId } } as any } : {}
      }),
      prisma.faculty.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { email: true } }
        }
      })
    ]);

    // Aggregate workloads & leaves from json fields dynamically in memory
    const faculties = await prisma.faculty.findMany({
      where: filter,
      select: { workload: true, leaveManagement: true }
    });

    let workloadHoursTotal = 0;
    let leaveRequestsCount = 0;

    faculties.forEach((f: any) => {
      if (f.workload && typeof f.workload === "object" && "teachingHours" in f.workload) {
        workloadHoursTotal += (f.workload.teachingHours as number) || 0;
      }
      if (f.leaveManagement && typeof f.leaveManagement === "object" && "leaveRequests" in f.leaveManagement && Array.isArray(f.leaveManagement.leaveRequests)) {
        leaveRequestsCount += (f.leaveManagement.leaveRequests as any[]).filter(r => r.status === "PENDING").length;
      }
    });

    return {
      totalFaculty: total,
      activeFaculty: active,
      totalDepartments: departmentsCount,
      todayClassesCount: classesCount,
      pendingLeaveRequests: leaveRequestsCount,
      totalTeachingHours: workloadHoursTotal,
      recentJoinees: recent.map(r => ({
        id: r.id,
        name: r.name,
        employeeId: r.employeeId,
        designation: r.designation,
        email: r.user.email,
        createdAt: r.createdAt
      }))
    };
  }
}
