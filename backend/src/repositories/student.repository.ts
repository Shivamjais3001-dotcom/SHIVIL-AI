import prisma from "../config/database";

export class StudentRepository {
  async findById(id: string, universityId?: string | null) {
    const whereClause: any = { id, deletedAt: null };
    if (universityId) {
      whereClause.user = { universityId } as any;
    }

    return prisma.student.findFirst({
      where: whereClause,
      include: {
        user: {
          select: { email: true, role: true, universityId: true } as any
        },
        attendance: { take: 10, orderBy: { date: "desc" } },
        results: true,
        hostelRoom: true,
        libraryIssues: true,
        fees: true
      }
    });
  }

  async findByRoll(rollNo: string, universityId?: string | null) {
    const whereClause: any = { rollNo, deletedAt: null };
    if (universityId) {
      whereClause.user = { universityId };
    }

    return prisma.student.findFirst({
      where: whereClause
    });
  }

  async findByEnrollment(enrollmentNo: string, universityId?: string | null) {
    const whereClause: any = { enrollmentNo, deletedAt: null };
    if (universityId) {
      whereClause.user = { universityId };
    }

    return prisma.student.findFirst({
      where: whereClause
    });
  }

  async findByRegistration(registrationNo: string, universityId?: string | null) {
    const whereClause: any = { registrationNo, deletedAt: null };
    if (universityId) {
      whereClause.user = { universityId };
    }

    return prisma.student.findFirst({
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
    branch?: string;
    semester?: string;
    status?: string;
    category?: string;
    scholarship?: string;
    hostel?: boolean;
    universityId?: string | null;
  }) {
    const whereClause: any = { deletedAt: null };

    if (params.branch) {
      whereClause.branch = params.branch;
    }

    if (params.semester) {
      whereClause.semester = params.semester;
    }

    if (params.status) {
      whereClause.status = params.status;
    }

    if (params.category) {
      whereClause.category = params.category;
    }

    if (params.scholarship) {
      whereClause.scholarship = params.scholarship;
    }

    if (params.hostel !== undefined) {
      if (params.hostel) {
        whereClause.hostelRoom = { isNot: null };
      } else {
        whereClause.hostelRoom = null;
      }
    }

    if (params.universityId) {
      whereClause.user = { universityId: params.universityId };
    }

    if (params.search) {
      whereClause.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { rollNo: { contains: params.search, mode: "insensitive" } },
        { enrollmentNo: { contains: params.search, mode: "insensitive" } },
        { registrationNo: { contains: params.search, mode: "insensitive" } }
      ];
    }

    const queryOptions: any = {
      where: whereClause,
      orderBy: { [params.sort]: params.order },
      take: params.limit,
      include: {
        user: {
          select: { email: true, role: true, universityId: true }
        },
        hostelRoom: true
      }
    };

    if (params.cursor) {
      queryOptions.cursor = { id: params.cursor };
      queryOptions.skip = 1;
    } else {
      queryOptions.skip = (params.page - 1) * params.limit;
    }

    const [total, data] = await prisma.$transaction([
      prisma.student.count({ where: whereClause }),
      prisma.student.findMany(queryOptions)
    ]);

    const nextCursor = data.length === params.limit ? data[data.length - 1].id : null;

    return { total, data, nextCursor };
  }

  async create(data: any) {
    return prisma.student.create({
      data,
      include: {
        user: {
          select: { email: true, role: true, universityId: true } as any
        }
      }
    });
  }

  async update(id: string, data: any) {
    return prisma.student.update({
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
    return prisma.student.update({
      where: { id },
      data: { status: "Archived" }
    });
  }

  async restore(id: string) {
    return prisma.student.update({
      where: { id },
      data: { status: "Active", deletedAt: null }
    });
  }

  async delete(id: string) {
    return prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async getSummaryMetrics(universityId: string | null) {
    const filter: any = { deletedAt: null };
    if (universityId) {
      filter.user = { universityId };
    }

    const [
      total,
      active,
      graduated,
      suspended,
      hostel,
      scholarship,
      attendanceTotal,
      attendancePresent,
      feePending,
      recent
    ] = await Promise.all([
      prisma.student.count({ where: filter }),
      prisma.student.count({ where: { ...filter, status: "Active" } }),
      prisma.student.count({ where: { ...filter, status: "Graduated" } }),
      prisma.student.count({ where: { ...filter, status: "Suspended" } }),
      prisma.student.count({
        where: {
          ...filter,
          hostelRoom: { isNot: null }
        }
      }),
      prisma.student.count({
        where: {
          ...filter,
          scholarship: { not: "None" }
        }
      }),
      prisma.attendance.count({
        where: (universityId ? { student: { user: { universityId } } } : {}) as any
      }),
      prisma.attendance.count({
        where: (universityId
          ? { student: { user: { universityId } }, status: "PRESENT" }
          : { status: "PRESENT" }) as any
      }),
      prisma.feeReceipt.count({
        where: {
          status: "PENDING",
          ...(universityId ? { student: { user: { universityId } } } : {})
        } as any
      }),
      prisma.student.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { email: true } }
        }
      })
    ]);

    const attendanceRate =
      attendanceTotal > 0
        ? `${((attendancePresent / attendanceTotal) * 100).toFixed(1)}%`
        : "100.0%";

    return {
      totalStudents: total,
      activeStudents: active,
      graduatedStudents: graduated,
      suspendedStudents: suspended,
      hostelStudents: hostel,
      scholarshipStudents: scholarship,
      attendanceRate,
      feePendingCount: feePending,
      recentAdmissions: recent.map(r => ({
        id: r.id,
        name: r.name,
        rollNo: r.rollNo,
        email: r.user.email,
        createdAt: r.createdAt
      }))
    };
  }
}
