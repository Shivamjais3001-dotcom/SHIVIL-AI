import { AttendanceStatus } from "@prisma/client";
import prisma from "../config/database";

export class DashboardRepository {
  async getMetrics(universityId: string | null) {
    // 1. Tenancy filters
    const studentFilter: any = { deletedAt: null };
    const facultyFilter: any = { deletedAt: null };
    const notificationFilter: any = {};
    const aiConversationFilter: any = {};
    const timetableFilter: any = {};
    const feeFilter: any = { status: "PENDING" };

    if (universityId) {
      studentFilter.user = { universityId };
      facultyFilter.user = { universityId };
      notificationFilter.userId = { in: await this.getUserIdsForTenant(universityId) };
      aiConversationFilter.userId = { in: await this.getUserIdsForTenant(universityId) };
      timetableFilter.faculty = { user: { universityId } };
      feeFilter.student = { user: { universityId } };
    }

    const userIds = universityId ? await this.getUserIdsForTenant(universityId) : [];

    // 2. Query stats in parallel using Promise.all (highly optimized)
    const [
      studentsCount,
      facultyCount,
      departmentsCount,
      coursesCount,
      attendanceTotal,
      attendancePresent,
      todayClasses,
      recentNotifications,
      activeConversations,
      pendingFeesCount
    ] = await Promise.all([
      prisma.student.count({ where: studentFilter }),
      prisma.faculty.count({ where: facultyFilter }),
      prisma.department.count(),
      prisma.course.count(),
      prisma.attendance.count({
        where: universityId
          ? { student: { user: { universityId } } }
          : {}
      }),
      prisma.attendance.count({
        where: universityId
          ? { student: { user: { universityId } }, status: AttendanceStatus.PRESENT }
          : { status: AttendanceStatus.PRESENT }
      }),
      prisma.timetable.findMany({
        where: {
          dayOfWeek: new Date().getDay() || 7, // 1 = Monday, ..., 7 = Sunday
          ...timetableFilter
        },
        include: {
          subject: { include: { course: true } },
          faculty: true
        },
        orderBy: { startTime: "asc" }
      }),
      prisma.notification.findMany({
        where: universityId ? { userId: { in: userIds } } : {},
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.aIConversation.count({ where: aiConversationFilter }),
      prisma.feeReceipt.count({ where: feeFilter })
    ]);

    // Calculate attendance percentage rate
    const attendanceRate =
      attendanceTotal > 0
        ? `${((attendancePresent / attendanceTotal) * 100).toFixed(1)}%`
        : "100.0%";

    return {
      activeStudents: studentsCount || 0,
      activeFaculty: facultyCount || 0,
      totalDepartments: departmentsCount || 0,
      totalCourses: coursesCount || 0,
      attendanceRate,
      todayClasses: todayClasses.map(c => ({
        id: c.id,
        subjectCode: c.subject.code,
        subjectName: c.subject.name,
        courseName: c.subject.course.name,
        facultyName: c.faculty.name,
        timeSlot: `${c.startTime} - ${c.endTime}`
      })),
      recentNotifications: recentNotifications.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        createdAt: n.createdAt
      })),
      activeAIConversations: activeConversations || 0,
      pendingTasksCount: pendingFeesCount || 0
    };
  }

  // Helper method to fetch all user IDs belonging to a tenant (universityId)
  private async getUserIdsForTenant(universityId: string): Promise<string[]> {
    const users = await prisma.user.findMany({
      where: { universityId },
      select: { id: true }
    });
    return users.map(u => u.id);
  }
}
