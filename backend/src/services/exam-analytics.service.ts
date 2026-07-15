import {
  ExamAnalyticsRepository,
  ResultSummaryRepository
} from "../repositories/assessment.repository";

const analyticsRepo = new ExamAnalyticsRepository();
const resultRepo = new ResultSummaryRepository();

export class ExamAnalyticsService {
  // ─── EXAM DASHBOARD OVERVIEW ────────────────────────────────────────
  async getDashboard(universityId: string | null) {
    return analyticsRepo.getDashboardMetrics(universityId);
  }

  // ─── DEPARTMENT COMPARISON ──────────────────────────────────────────
  async getDepartmentComparison(universityId: string | null) {
    return analyticsRepo.getDepartmentComparison(universityId);
  }

  // ─── SUBJECT DIFFICULTY INDEX ───────────────────────────────────────
  async getSubjectDifficulty(universityId: string | null) {
    return analyticsRepo.getSubjectDifficultyIndex(universityId);
  }

  // ─── CGPA DISTRIBUTION HISTOGRAM ───────────────────────────────────
  async getCGPADistribution(universityId: string | null) {
    return analyticsRepo.getCGPADistribution(universityId);
  }

  // ─── TOP PERFORMERS ─────────────────────────────────────────────────
  async getTopPerformers(params: {
    universityId: string | null;
    semester?: string;
    academicYear?: string;
    limit?: number;
  }) {
    return resultRepo.getTopPerformers({
      universityId: params.universityId,
      semester: params.semester,
      academicYear: params.academicYear,
      limit: params.limit || 10
    });
  }

  // ─── PERFORMANCE TRENDS ─────────────────────────────────────────────
  async getPerformanceTrends(universityId: string | null) {
    // Group CGPA averages by semester across all students
    const allSummaries = await (
      await import("../config/database")
    ).default.$queryRaw`
      SELECT 
        semester,
        "academicYear",
        AVG(cgpa) as "avgCGPA",
        AVG(sgpa) as "avgSGPA",
        COUNT(*) as "studentCount",
        SUM(CASE WHEN "resultStatus" = 'BACKLOG' THEN 1 ELSE 0 END) as "backlogCount"
      FROM "StudentResultSummary"
      ${universityId
        ? `WHERE "universityId" = '${universityId}'`
        : ""}
      GROUP BY semester, "academicYear"
      ORDER BY "academicYear" ASC, semester ASC
    ` as any[];

    return (allSummaries as any[]).map((row) => ({
      semester: row.semester,
      academicYear: row.academicYear,
      avgCGPA: parseFloat(row.avgCGPA || 0).toFixed(2),
      avgSGPA: parseFloat(row.avgSGPA || 0).toFixed(2),
      studentCount: Number(row.studentCount || 0),
      backlogCount: Number(row.backlogCount || 0),
      backlogRate: row.studentCount > 0
        ? `${((Number(row.backlogCount) / Number(row.studentCount)) * 100).toFixed(1)}%`
        : "0.0%"
    }));
  }

  // ─── BACKLOG ANALYTICS ──────────────────────────────────────────────
  async getBacklogAnalytics(universityId: string | null) {
    const backlogStudents = await resultRepo.getBacklogStudents(universityId);
    const difficultyIndex = await analyticsRepo.getSubjectDifficultyIndex(universityId);

    const highDifficultySubjects = difficultyIndex.filter((s) => s.difficultyLevel === "HIGH");

    return {
      totalBacklogStudents: (backlogStudents as any[]).length,
      backlogStudents,
      highDifficultySubjects,
      mostFailedSubjects: highDifficultySubjects.slice(0, 5)
    };
  }
}
