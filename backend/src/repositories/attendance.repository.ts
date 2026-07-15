import prisma from "../config/database";

export class AttendanceRepository {
  async createSession(data: any) {
    return prisma.attendanceSession.create({
      data,
      include: { subject: true, faculty: true }
    });
  }

  async findSessionById(id: string) {
    return prisma.attendanceSession.findUnique({
      where: { id },
      include: { subject: true, faculty: true }
    });
  }

  async findActiveSessions(subjectId: string, facultyId: string) {
    return prisma.attendanceSession.findMany({
      where: { subjectId, facultyId, status: "Active" }
    });
  }

  async updateSessionStatus(id: string, status: string) {
    return prisma.attendanceSession.update({
      where: { id },
      data: { status }
    });
  }

  async markStudentAttendance(data: any) {
    return prisma.attendance.create({
      data,
      include: { student: true, subject: true }
    });
  }

  async markFacultyAttendance(data: any) {
    return prisma.facultyAttendance.create({
      data,
      include: { faculty: true }
    });
  }

  async findFacultyAttendance(facultyId: string, date: Date) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    return prisma.facultyAttendance.findFirst({
      where: {
        facultyId,
        date: { gte: startOfDay, lte: endOfDay }
      }
    });
  }

  async updateFacultyAttendance(id: string, data: any) {
    return prisma.facultyAttendance.update({
      where: { id },
      data
    });
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    studentId?: string;
    subjectId?: string;
    sessionId?: string;
    status?: string;
    universityId?: string | null;
  }) {
    const whereClause: any = {};

    if (params.studentId) {
      whereClause.studentId = params.studentId;
    }

    if (params.subjectId) {
      whereClause.subjectId = params.subjectId;
    }

    if (params.sessionId) {
      whereClause.sessionId = params.sessionId;
    }

    if (params.status) {
      whereClause.status = params.status;
    }

    if (params.universityId) {
      whereClause.student = {
        user: { universityId: params.universityId }
      } as any;
    }

    const [total, data] = await prisma.$transaction([
      prisma.attendance.count({ where: whereClause }),
      prisma.attendance.findMany({
        where: whereClause,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          student: true,
          subject: true,
          session: true
        },
        orderBy: { date: "desc" }
      })
    ]);

    return { total, data };
  }

  async findAnomalies(universityId: string | null) {
    const filter: any = {};
    if (universityId) {
      filter.student = {
        user: { universityId }
      } as any;
    }

    // Find geofence anomalies (e.g. location details exist but gps coords mismatch from session)
    // or face recognition confidence below threshold (e.g. < 0.7)
    const records = await prisma.attendance.findMany({
      where: {
        ...filter,
        OR: [
          { remarks: { contains: "GPS geofence breached" } },
          { remarks: { contains: "Face identification low confidence" } }
        ]
      },
      include: { student: true, subject: true, session: true },
      take: 50
    });

    return records;
  }

  async findAtRiskStudents(universityId: string | null, threshold: number = 75.0) {
    const filter: any = {};
    if (universityId) {
      filter.user = { universityId } as any;
    }

    // Load active student counts & their attendance records in a single transactional query
    const students = await prisma.student.findMany({
      where: { ...filter, deletedAt: null, status: "Active" },
      select: {
        id: true,
        name: true,
        rollNo: true,
        attendance: {
          select: { status: true }
        }
      }
    });

    const atRisk: any[] = [];

    students.forEach((s: any) => {
      const total = s.attendance.length;
      if (total > 0) {
        const present = s.attendance.filter((a: any) => a.status === "PRESENT").length;
        const rate = (present / total) * 100;
        if (rate < threshold) {
          atRisk.push({
            id: s.id,
            name: s.name,
            rollNo: s.rollNo,
            attendanceRate: `${rate.toFixed(1)}%`,
            totalClasses: total,
            presentClasses: present
          });
        }
      }
    });

    return atRisk;
  }

  async getSummaryMetrics(universityId: string | null) {
    const filter: any = {};
    if (universityId) {
      filter.student = {
        user: { universityId }
      } as any;
    }

    const [
      total,
      present,
      absent,
      late,
      excused
    ] = await Promise.all([
      prisma.attendance.count({ where: filter }),
      prisma.attendance.count({ where: { ...filter, status: "PRESENT" } }),
      prisma.attendance.count({ where: { ...filter, status: "ABSENT" } }),
      prisma.attendance.count({ where: { ...filter, status: "LATE" } }),
      prisma.attendance.count({ where: { ...filter, status: "EXCUSED" } })
    ]);

    const activeSessionsCount = await prisma.attendanceSession.count({
      where: {
        status: "Active",
        ...(universityId ? { faculty: { user: { universityId } } as any } : {})
      }
    });

    const atRiskCount = (await this.findAtRiskStudents(universityId, 75.0)).length;

    return {
      totalRecords: total,
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      excusedCount: excused,
      activeSessions: activeSessionsCount,
      atRiskStudentsCount: atRiskCount,
      overallPresentRate: total > 0 ? `${((present / total) * 100).toFixed(1)}%` : "100.0%"
    };
  }
}
