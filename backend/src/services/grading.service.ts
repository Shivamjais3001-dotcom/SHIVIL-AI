import { GradingPolicyRepository } from "../repositories/assessment.repository";
import { ApiError } from "../utils/api-error";

const policyRepo = new GradingPolicyRepository();

// ─── TYPES ─────────────────────────────────────────────────────────────────
export interface GradeResult {
  grade: string;
  gradePoint: number;
  percentage: number;
  passed: boolean;
}

export interface SGPAResult {
  sgpa: number;
  creditsRegistered: number;
  creditsEarned: number;
  totalCreditPoints: number;
  subjectResults: Array<{
    subjectId: string;
    subjectCode: string;
    subjectName: string;
    credits: number;
    marks: number;
    maxMarks: number;
    grade: string;
    gradePoint: number;
    creditPoints: number;
    passed: boolean;
  }>;
  backlogSubjects: Array<{
    subjectId: string;
    subjectCode: string;
    subjectName: string;
    marks: number;
    grade: string;
  }>;
}

export class GradingService {
  // ─── COMPUTE GRADE FROM POLICY ─────────────────────────────────────────
  computeGradeFromPolicy(marks: number, maxMarks: number, policy: any): GradeResult {
    const percentage = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;

    // Resolve grade boundaries from policy or defaults
    const boundaries: Record<string, number> = policy?.gradeBoundaries || {
      O: 90, "A+": 80, A: 70, "B+": 60, B: 55, C: 50, P: 40, F: 0
    };
    const gradePoints: Record<string, number> = policy?.gradePoints || {
      O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, P: 4, F: 0
    };

    // Sort boundaries descending to find the highest matching grade
    const sortedBoundaries = Object.entries(boundaries)
      .sort(([, a], [, b]) => b - a);

    let grade = "F";
    for (const [g, threshold] of sortedBoundaries) {
      if (percentage >= threshold) {
        grade = g;
        break;
      }
    }

    const gradePoint = gradePoints[grade] ?? 0;
    const passingGradePoint = policy?.passingGradePoint ?? 4.0;

    return {
      grade,
      gradePoint,
      percentage: Math.round(percentage * 100) / 100,
      passed: gradePoint >= passingGradePoint
    };
  }

  // ─── COMPUTE SGPA ──────────────────────────────────────────────────────
  computeSGPA(subjectResults: Array<{
    subjectId: string;
    subjectCode: string;
    subjectName: string;
    credits: number;
    marks: number;
    maxMarks: number;
    grade: string;
    gradePoint: number;
  }>, policy: any): SGPAResult {
    const passingGradePoint = policy?.passingGradePoint ?? 4.0;
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    let earnedCredits = 0;
    const backlogSubjects: any[] = [];
    const fullResults: any[] = [];

    for (const sub of subjectResults) {
      const creditPoints = sub.gradePoint * sub.credits;
      totalWeightedPoints += creditPoints;
      totalCredits += sub.credits;

      const passed = sub.gradePoint >= passingGradePoint;
      if (passed) {
        earnedCredits += sub.credits;
      } else {
        backlogSubjects.push({
          subjectId: sub.subjectId,
          subjectCode: sub.subjectCode,
          subjectName: sub.subjectName,
          marks: sub.marks,
          grade: sub.grade
        });
      }

      fullResults.push({
        ...sub,
        creditPoints,
        passed
      });
    }

    const sgpa = totalCredits > 0
      ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100
      : 0;

    return {
      sgpa,
      creditsRegistered: totalCredits,
      creditsEarned: earnedCredits,
      totalCreditPoints: Math.round(totalWeightedPoints * 100) / 100,
      subjectResults: fullResults,
      backlogSubjects
    };
  }

  // ─── COMPUTE CGPA ──────────────────────────────────────────────────────
  computeCGPA(semesterResults: Array<{
    sgpa: number;
    creditsRegistered: number;
    totalCreditPoints: number;
  }>): number {
    const totalCredits = semesterResults.reduce((acc, s) => acc + s.creditsRegistered, 0);
    const totalPoints = semesterResults.reduce((acc, s) => acc + s.totalCreditPoints, 0);

    if (totalCredits === 0) return 0;
    return Math.round((totalPoints / totalCredits) * 100) / 100;
  }

  // ─── CHECK PROMOTION ───────────────────────────────────────────────────
  checkPromotion(cgpa: number, backlogsCount: number, policy: any): {
    isEligible: boolean;
    reasons: string[];
  } {
    const minCGPA = policy?.promotionMinCGPA ?? 4.0;
    const maxBacklogs = policy?.promotionMaxBacklogs ?? 3;
    const reasons: string[] = [];

    if (cgpa < minCGPA) {
      reasons.push(`CGPA ${cgpa.toFixed(2)} is below minimum required ${minCGPA}.`);
    }
    if (backlogsCount > maxBacklogs) {
      reasons.push(`Backlog count (${backlogsCount}) exceeds maximum allowed (${maxBacklogs}).`);
    }

    return { isEligible: reasons.length === 0, reasons };
  }

  // ─── CHECK GRADUATION ELIGIBILITY ──────────────────────────────────────
  checkGraduationEligibility(totalCreditsEarned: number, cgpa: number, policy: any): {
    isEligible: boolean;
    reasons: string[];
  } {
    const minCredits = policy?.graduationMinCredits ?? 120;
    const minCGPA = policy?.graduationMinCGPA ?? 5.0;
    const reasons: string[] = [];

    if (totalCreditsEarned < minCredits) {
      reasons.push(
        `Insufficient credits: ${totalCreditsEarned} earned, ${minCredits} required.`
      );
    }
    if (cgpa < minCGPA) {
      reasons.push(
        `CGPA ${cgpa.toFixed(2)} below graduation minimum of ${minCGPA}.`
      );
    }

    return { isEligible: reasons.length === 0, reasons };
  }

  // ─── GRADING POLICY API ────────────────────────────────────────────────
  async setGradingPolicy(universityId: string | null, data: {
    gradeBoundaries?: Record<string, number>;
    gradePoints?: Record<string, number>;
    creditSystem?: string;
    promotionMinCGPA?: number;
    promotionMaxBacklogs?: number;
    graduationMinCredits?: number;
    graduationMinCGPA?: number;
    passingGradePoint?: number;
    customRules?: any;
  }) {
    // Validate gradeBoundaries and gradePoints have matching keys
    if (data.gradeBoundaries && data.gradePoints) {
      const boundaryKeys = Object.keys(data.gradeBoundaries).sort();
      const pointKeys = Object.keys(data.gradePoints).sort();
      if (JSON.stringify(boundaryKeys) !== JSON.stringify(pointKeys)) {
        throw ApiError.badRequest(
          "Grade boundaries and grade points must have identical grade letter keys."
        );
      }
    }

    return policyRepo.createOrUpdate(universityId, data);
  }

  async getGradingPolicy(universityId: string | null) {
    return policyRepo.findByUniversity(universityId);
  }
}
