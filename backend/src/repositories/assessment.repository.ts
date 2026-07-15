import prisma from "../config/database";
import { PrismaClient } from "@prisma/client";

// ============================================================
// ExamRepository — Core exam scheduling and management
// ============================================================
export class ExamRepository {
  async create(data: {
    title: string;
    examType: string;
    subjectId: string;
    universityId?: string | null;
    semester: string;
    academicYear: string;
    date: Date;
    startTime: string;
    endTime: string;
    classroomId?: string;
    invigilatorId?: string;
    venueDetails?: any;
    maxMarks?: number;
    passingMarks?: number;
    weightagePercent?: number;
    duration?: number;
    difficultyLevel?: string;
    questionBlueprintMetadata?: any;
    createdById?: string;
    conflictHash?: string;
  }) {
    return prisma.exam.create({
      data: data as any,
      include: {
        subject: { include: { course: true } }
      }
    } as any);
  }

  async findById(id: string) {
    return prisma.exam.findFirst({
      where: { id, deletedAt: null } as any,
      include: {
        subject: { include: { course: true } },
        marks: { include: { student: true } } as any
      } as any
    } as any);
  }

  async update(id: string, data: any) {
    return prisma.exam.update({
      where: { id } as any,
      data: data as any,
      include: { subject: true } as any
    } as any);
  }

  async softDelete(id: string) {
    return prisma.exam.update({
      where: { id } as any,
      data: { deletedAt: new Date() } as any
    } as any);
  }

  async lock(id: string, lockedById: string) {
    return prisma.exam.update({
      where: { id } as any,
      data: {
        isLocked: true,
        lockedAt: new Date(),
        lockedById,
        approvalStatus: "LOCKED"
      } as any
    } as any);
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    subjectId?: string;
    examType?: string;
    semester?: string;
    academicYear?: string;
    approvalStatus?: string;
    universityId?: string | null;
    fromDate?: Date;
    toDate?: Date;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    const where: any = { deletedAt: null };

    if (params.subjectId) where.subjectId = params.subjectId;
    if (params.examType) where.examType = params.examType;
    if (params.semester) where.semester = params.semester;
    if (params.academicYear) where.academicYear = params.academicYear;
    if (params.approvalStatus) where.approvalStatus = params.approvalStatus;
    if (params.universityId) where.universityId = params.universityId;
    if (params.fromDate || params.toDate) {
      where.date = {};
      if (params.fromDate) where.date.gte = params.fromDate;
      if (params.toDate) where.date.lte = params.toDate;
    }

    const orderBy: any = {};
    orderBy[params.sort || "date"] = params.order || "desc";

    const [total, data] = await prisma.$transaction([
      (prisma as any).exam.count({ where }),
      (prisma as any).exam.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: { subject: { include: { course: true } } },
        orderBy
      })
    ]);

    return { total, data };
  }

  // Upcoming exams for calendar view
  async findUpcoming(universityId: string | null, limit: number = 10) {
    const where: any = {
      deletedAt: null,
      date: { gte: new Date() }
    };
    if (universityId) where.universityId = universityId;

    return (prisma as any).exam.findMany({
      where,
      take: limit,
      include: { subject: true },
      orderBy: { date: "asc" }
    } as any);
  }

  // Conflict detection: same room + overlapping time on same date
  async detectConflict(params: {
    classroomId: string;
    date: Date;
    startTime: string;
    endTime: string;
    excludeExamId?: string;
  }) {
    const where: any = {
      classroomId: params.classroomId,
      date: params.date,
      deletedAt: null,
      // Overlap: existing.startTime < newEnd AND existing.endTime > newStart
      startTime: { lt: params.endTime },
      endTime: { gt: params.startTime }
    };
    if (params.excludeExamId) where.id = { not: params.excludeExamId };

    return (prisma as any).exam.findMany({
      where,
      include: { subject: true }
    } as any);
  }

  async updateApprovalStatus(id: string, approvalStatus: string) {
    return prisma.exam.update({
      where: { id } as any,
      data: { approvalStatus } as any
    } as any);
  }
}

// ============================================================
// AssessmentComponentRepository
// ============================================================
export class AssessmentComponentRepository {
  async createOrUpdate(subjectId: string, data: any) {
    const existing = await (prisma as any).assessmentComponent.findUnique({
      where: { subjectId } as any
    } as any);

    if (existing) {
      return (prisma as any).assessmentComponent.update({
        where: { subjectId } as any,
        data,
        include: { subject: true }
      } as any);
    }
    return (prisma as any).assessmentComponent.create({
      data: { ...data, subjectId },
      include: { subject: true }
    } as any);
  }

  async findBySubject(subjectId: string) {
    return (prisma as any).assessmentComponent.findUnique({
      where: { subjectId } as any,
      include: { subject: { include: { course: true } } }
    } as any);
  }

  async findByUniversity(universityId: string | null) {
    return (prisma as any).assessmentComponent.findMany({
      where: universityId ? { universityId } : {},
      include: { subject: true }
    } as any);
  }
}

// ============================================================
// ExamMarkRepository — Mark entry with full audit trail
// ============================================================
export class ExamMarkRepository {
  async upsertMark(data: {
    examId: string;
    studentId: string;
    internalMarks?: number;
    externalMarks?: number;
    assignmentMarks?: number;
    quizMarks?: number;
    labMarks?: number;
    projectMarks?: number;
    presentationMarks?: number;
    attendanceMarks?: number;
    totalMarks: number;
    grade?: string;
    gradePoint?: number;
    creditPoints?: number;
    submittedById?: string;
    auditTrail?: any;
  }) {
    const existing = await (prisma as any).examMark.findUnique({
      where: { examId_studentId: { examId: data.examId, studentId: data.studentId } } as any
    } as any);

    const payload: any = {
      ...data,
      submittedAt: new Date(),
      approvalStatus: "SUBMITTED"
    };

    if (existing) {
      // Preserve existing originalMarks if not yet moderated
      if (!(existing as any).originalMarks) {
        payload.originalMarks = (existing as any).totalMarks;
      }
      return (prisma as any).examMark.update({
        where: { id: (existing as any).id } as any,
        data: payload,
        include: { student: true }
      } as any);
    }

    return (prisma as any).examMark.create({
      data: payload,
      include: { student: true }
    } as any);
  }

  async bulkUpsert(examId: string, records: any[], actorId: string) {
    // Transactional bulk entry
    return prisma.$transaction(async (tx) => {
      const results = [];
      for (const record of records) {
        const existing = await (tx as any).examMark.findUnique({
          where: { examId_studentId: { examId, studentId: record.studentId } } as any
        } as any);

        const payload: any = {
          ...record,
          examId,
          submittedById: actorId,
          submittedAt: new Date(),
          approvalStatus: "SUBMITTED"
        };

        let result;
        if (existing) {
          result = await (tx as any).examMark.update({
            where: { id: (existing as any).id } as any,
            data: payload,
            include: { student: true }
          } as any);
        } else {
          result = await (tx as any).examMark.create({
            data: payload,
            include: { student: true }
          } as any);
        }
        results.push(result);
      }
      return results;
    });
  }

  async moderate(markId: string, data: {
    moderationDelta: number;
    moderationReason: string;
    actorId: string;
    previousTotal: number;
    newTotal: number;
    grade?: string;
    gradePoint?: number;
  }) {
    return (prisma as any).examMark.update({
      where: { id: markId } as any,
      data: {
        moderatedMarks: data.newTotal,
        moderationDelta: data.moderationDelta,
        moderationReason: data.moderationReason,
        totalMarks: data.newTotal,
        grade: data.grade,
        gradePoint: data.gradePoint,
        approvalStatus: "UNDER_REVIEW"
      } as any
    } as any);
  }

  async updateApproval(markId: string, data: {
    approvalStatus: string;
    actorId: string;
    rejectionReason?: string;
    isApproved?: boolean;
  }) {
    const updateData: any = {
      approvalStatus: data.approvalStatus,
      approvedById: data.actorId,
      approvedAt: new Date()
    };
    if (data.rejectionReason) updateData.rejectionReason = data.rejectionReason;

    return (prisma as any).examMark.update({
      where: { id: markId } as any,
      data: updateData
    } as any);
  }

  async lockMark(markId: string) {
    return (prisma as any).examMark.update({
      where: { id: markId } as any,
      data: { isLocked: true, approvalStatus: "LOCKED" } as any
    } as any);
  }

  async lockAllForExam(examId: string) {
    return (prisma as any).examMark.updateMany({
      where: { examId, approvalStatus: "APPROVED" } as any,
      data: { isLocked: true, approvalStatus: "LOCKED" } as any
    } as any);
  }

  async findByExam(examId: string, includeStudent: boolean = true) {
    return (prisma as any).examMark.findMany({
      where: { examId, deletedAt: null } as any,
      include: {
        student: includeStudent ? { include: { user: { select: { email: true } } } } : false
      } as any,
      orderBy: { totalMarks: "desc" }
    } as any);
  }

  async findByStudent(studentId: string, params?: {
    semester?: string;
    academicYear?: string;
    examType?: string;
  }) {
    const where: any = { studentId, deletedAt: null };

    return (prisma as any).examMark.findMany({
      where,
      include: {
        exam: {
          include: { subject: { include: { course: true } } }
        }
      } as any,
      orderBy: { createdAt: "desc" }
    } as any);
  }

  async findById(id: string) {
    return (prisma as any).examMark.findFirst({
      where: { id, deletedAt: null } as any,
      include: {
        exam: { include: { subject: true } },
        student: true
      } as any
    } as any);
  }

  async findPendingApprovals(universityId: string | null) {
    const where: any = {
      approvalStatus: { in: ["SUBMITTED", "UNDER_REVIEW"] },
      deletedAt: null
    };

    return (prisma as any).examMark.findMany({
      where,
      include: {
        exam: { include: { subject: true } },
        student: true
      } as any,
      orderBy: { submittedAt: "asc" }
    } as any);
  }
}

// ============================================================
// GradingPolicyRepository — Multi-tenant grading rules
// ============================================================
export class GradingPolicyRepository {
  // Default global grading policy
  private readonly DEFAULT_BOUNDARIES: Record<string, number> = {
    O: 90, "A+": 80, A: 70, "B+": 60, B: 55, C: 50, P: 40, F: 0
  };
  private readonly DEFAULT_GRADE_POINTS: Record<string, number> = {
    O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, P: 4, F: 0
  };

  async createOrUpdate(universityId: string | null, data: any) {
    const existing = await (prisma as any).gradingPolicy.findFirst({
      where: { universityId: universityId ?? null } as any
    } as any);

    if (existing) {
      return (prisma as any).gradingPolicy.update({
        where: { id: (existing as any).id } as any,
        data
      } as any);
    }
    return (prisma as any).gradingPolicy.create({
      data: { ...data, universityId }
    } as any);
  }

  async findByUniversity(universityId: string | null) {
    const policy = await (prisma as any).gradingPolicy.findFirst({
      where: { universityId: universityId ?? null } as any
    } as any);

    if (!policy) {
      // Return global defaults if no university-specific policy exists
      return {
        universityId,
        gradeBoundaries: this.DEFAULT_BOUNDARIES,
        gradePoints: this.DEFAULT_GRADE_POINTS,
        creditSystem: "10_POINT",
        promotionMinCGPA: 4.0,
        promotionMaxBacklogs: 3,
        graduationMinCredits: 120,
        graduationMinCGPA: 5.0,
        passingGradePoint: 4.0
      };
    }
    return policy;
  }
}

// ============================================================
// ResultSummaryRepository — SGPA/CGPA and result summaries
// ============================================================
export class ResultSummaryRepository {
  async upsert(studentId: string, semester: string, academicYear: string, data: any) {
    const existing = await (prisma as any).studentResultSummary.findFirst({
      where: { studentId, semester, academicYear } as any
    } as any);

    if (existing) {
      return (prisma as any).studentResultSummary.update({
        where: { id: (existing as any).id } as any,
        data: { ...data, updatedAt: new Date() }
      } as any);
    }
    return (prisma as any).studentResultSummary.create({
      data: { ...data, studentId, semester, academicYear }
    } as any);
  }

  async findByStudent(studentId: string) {
    return (prisma as any).studentResultSummary.findMany({
      where: { studentId } as any,
      orderBy: [{ academicYear: "asc" }, { semester: "asc" }]
    } as any);
  }

  async findBySemester(params: {
    semester: string;
    academicYear: string;
    universityId?: string | null;
    page: number;
    limit: number;
  }) {
    const where: any = {
      semester: params.semester,
      academicYear: params.academicYear
    };
    if (params.universityId) where.universityId = params.universityId;

    const [total, data] = await prisma.$transaction([
      (prisma as any).studentResultSummary.count({ where }),
      (prisma as any).studentResultSummary.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: { student: true },
        orderBy: { cgpa: "desc" }
      })
    ]);
    return { total, data };
  }

  async getTopPerformers(params: {
    semester?: string;
    academicYear?: string;
    universityId?: string | null;
    limit: number;
  }) {
    const where: any = {};
    if (params.semester) where.semester = params.semester;
    if (params.academicYear) where.academicYear = params.academicYear;
    if (params.universityId) where.universityId = params.universityId;

    return (prisma as any).studentResultSummary.findMany({
      where,
      take: params.limit,
      include: { student: true },
      orderBy: { cgpa: "desc" }
    } as any);
  }

  async getBacklogStudents(universityId: string | null) {
    const where: any = { resultStatus: "BACKLOG" };
    if (universityId) where.universityId = universityId;

    return (prisma as any).studentResultSummary.findMany({
      where,
      include: { student: true },
      orderBy: { backlogsCount: "desc" }
    } as any);
  }
}

// ============================================================
// ExamAuditRepository — Immutable audit trail
// ============================================================
export class ExamAuditRepository {
  async append(data: {
    examId?: string;
    examMarkId?: string;
    action: string;
    actorId: string;
    actorRole: string;
    previousValue?: any;
    newValue?: any;
    ipAddress?: string;
    metadata?: any;
  }) {
    return (prisma as any).examAuditLog.create({ data } as any);
  }

  async findByExam(examId: string, limit: number = 50) {
    return (prisma as any).examAuditLog.findMany({
      where: { examId } as any,
      orderBy: { createdAt: "desc" },
      take: limit
    } as any);
  }

  async findByMark(examMarkId: string) {
    return (prisma as any).examAuditLog.findMany({
      where: { examMarkId } as any,
      orderBy: { createdAt: "asc" }
    } as any);
  }
}

// ============================================================
// ReEvaluationRepository — Re-evaluation request lifecycle
// ============================================================
export class ReEvaluationRepository {
  async create(data: {
    examId: string;
    examMarkId?: string;
    studentId: string;
    reason: string;
  }) {
    return (prisma as any).reEvaluation.create({
      data,
      include: {
        exam: { include: { subject: true } },
        student: true
      }
    } as any);
  }

  async findById(id: string) {
    return (prisma as any).reEvaluation.findUnique({
      where: { id } as any,
      include: {
        exam: { include: { subject: true } },
        student: true,
        examMark: true
      }
    } as any);
  }

  async updateStatus(id: string, data: {
    status: string;
    reviewedById?: string;
    reviewNotes?: string;
    revisedMarks?: number;
    revisedGrade?: string;
    previousMarks?: number;
    previousGrade?: string;
  }) {
    return (prisma as any).reEvaluation.update({
      where: { id } as any,
      data: {
        ...data,
        reviewedAt: new Date(),
        resolvedAt: ["COMPLETED", "REJECTED"].includes(data.status) ? new Date() : undefined
      }
    } as any);
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    status?: string;
    studentId?: string;
    examId?: string;
    universityId?: string | null;
  }) {
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.studentId) where.studentId = params.studentId;
    if (params.examId) where.examId = params.examId;

    const [total, data] = await prisma.$transaction([
      (prisma as any).reEvaluation.count({ where }),
      (prisma as any).reEvaluation.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          exam: { include: { subject: true } },
          student: true
        },
        orderBy: { createdAt: "desc" }
      })
    ]);
    return { total, data };
  }
}

// ============================================================
// ExamAnalyticsRepository — Aggregated analytics queries
// ============================================================
export class ExamAnalyticsRepository {
  async getDashboardMetrics(universityId: string | null) {
    const uniWhere: any = universityId ? { universityId } : {};
    const markWhere: any = universityId
      ? { exam: { universityId } }
      : {};

    const [
      totalExams,
      upcomingExams,
      lockedExams,
      totalMarkRecords,
      failingCount,
      pendingApprovals,
      reEvalRequests
    ] = await Promise.all([
      (prisma as any).exam.count({ where: { ...uniWhere, deletedAt: null } }),
      (prisma as any).exam.count({ where: { ...uniWhere, deletedAt: null, date: { gte: new Date() } } }),
      (prisma as any).exam.count({ where: { ...uniWhere, deletedAt: null, isLocked: true } }),
      (prisma as any).examMark.count({ where: { ...markWhere, deletedAt: null } }),
      (prisma as any).examMark.count({ where: { ...markWhere, deletedAt: null, grade: "F" } }),
      (prisma as any).examMark.count({
        where: { ...markWhere, deletedAt: null, approvalStatus: { in: ["SUBMITTED", "UNDER_REVIEW"] } }
      }),
      (prisma as any).reEvaluation.count({
        where: { status: { in: ["REQUESTED", "IN_REVIEW"] } }
      })
    ]);

    const passRate = totalMarkRecords > 0
      ? (((totalMarkRecords - failingCount) / totalMarkRecords) * 100).toFixed(1)
      : "100.0";

    return {
      totalExams,
      upcomingExams,
      completedLockedExams: lockedExams,
      totalMarkRecords,
      failureCount: failingCount,
      passRate: `${passRate}%`,
      pendingApprovals,
      pendingReEvaluations: reEvalRequests
    };
  }

  async getSubjectDifficultyIndex(universityId: string | null) {
    // Aggregate pass/fail rates per subject
    const where: any = { deletedAt: null };
    if (universityId) where.exam = { universityId };

    const marks = await (prisma as any).examMark.findMany({
      where,
      select: {
        grade: true,
        totalMarks: true,
        exam: { select: { subjectId: true, subject: { select: { name: true, code: true } } } }
      }
    } as any);

    // Group by subject
    const subjectMap: Record<string, { total: number; passed: number; name: string; code: string; totalMarksSum: number }> = {};
    for (const mark of marks as any[]) {
      const sid = mark.exam?.subjectId;
      if (!sid) continue;
      if (!subjectMap[sid]) {
        subjectMap[sid] = {
          total: 0, passed: 0,
          name: mark.exam?.subject?.name || "Unknown",
          code: mark.exam?.subject?.code || "",
          totalMarksSum: 0
        };
      }
      subjectMap[sid].total++;
      subjectMap[sid].totalMarksSum += mark.totalMarks;
      if (mark.grade && mark.grade !== "F") subjectMap[sid].passed++;
    }

    return Object.entries(subjectMap).map(([subjectId, v]) => ({
      subjectId,
      subjectName: v.name,
      subjectCode: v.code,
      totalStudents: v.total,
      passCount: v.passed,
      failCount: v.total - v.passed,
      passRate: v.total > 0 ? `${((v.passed / v.total) * 100).toFixed(1)}%` : "N/A",
      avgMarks: v.total > 0 ? (v.totalMarksSum / v.total).toFixed(1) : "N/A",
      difficultyLevel: v.total > 0 && (v.passed / v.total) < 0.5 ? "HIGH" : "LOW"
    })).sort((a, b) => parseFloat(a.passRate) - parseFloat(b.passRate));
  }

  async getCGPADistribution(universityId: string | null) {
    const where: any = {};
    if (universityId) where.universityId = universityId;

    const summaries = await (prisma as any).studentResultSummary.findMany({
      where,
      select: { cgpa: true }
    } as any);

    const ranges: Record<string, number> = {
      "9.0 - 10.0": 0, "8.0 - 8.9": 0, "7.0 - 7.9": 0,
      "6.0 - 6.9": 0, "5.0 - 5.9": 0, "< 5.0": 0
    };

    for (const s of summaries as any[]) {
      const cgpa = s.cgpa;
      if (cgpa >= 9.0) ranges["9.0 - 10.0"]++;
      else if (cgpa >= 8.0) ranges["8.0 - 8.9"]++;
      else if (cgpa >= 7.0) ranges["7.0 - 7.9"]++;
      else if (cgpa >= 6.0) ranges["6.0 - 6.9"]++;
      else if (cgpa >= 5.0) ranges["5.0 - 5.9"]++;
      else ranges["< 5.0"]++;
    }

    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }

  async getDepartmentComparison(universityId: string | null) {
    // Group result summaries by student branch
    const where: any = {};
    if (universityId) where.universityId = universityId;

    const summaries = await (prisma as any).studentResultSummary.findMany({
      where,
      include: { student: { select: { branch: true } } }
    } as any);

    const deptMap: Record<string, { total: number; cgpaSum: number; backlogs: number }> = {};
    for (const s of summaries as any[]) {
      const dept = s.student?.branch || "Unknown";
      if (!deptMap[dept]) deptMap[dept] = { total: 0, cgpaSum: 0, backlogs: 0 };
      deptMap[dept].total++;
      deptMap[dept].cgpaSum += s.cgpa;
      if (s.resultStatus === "BACKLOG") deptMap[dept].backlogs++;
    }

    return Object.entries(deptMap).map(([department, v]) => ({
      department,
      totalStudents: v.total,
      avgCGPA: v.total > 0 ? (v.cgpaSum / v.total).toFixed(2) : "0.00",
      backlogCount: v.backlogs,
      backlogRate: v.total > 0 ? `${((v.backlogs / v.total) * 100).toFixed(1)}%` : "0.0%"
    })).sort((a, b) => parseFloat(b.avgCGPA) - parseFloat(a.avgCGPA));
  }
}
