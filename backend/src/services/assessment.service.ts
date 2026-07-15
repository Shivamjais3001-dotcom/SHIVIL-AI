import { AssessmentComponentRepository } from "../repositories/assessment.repository";
import { ApiError } from "../utils/api-error";

const componentRepo = new AssessmentComponentRepository();

export class AssessmentService {
  // ─── SET ASSESSMENT COMPONENTS ──────────────────────────────────────
  async setComponents(subjectId: string, data: {
    universityId?: string | null;
    internalWeight?: number;
    externalWeight?: number;
    assignmentWeight?: number;
    quizWeight?: number;
    labWeight?: number;
    attendanceWeight?: number;
    projectWeight?: number;
    presentationWeight?: number;
    internalMaxMarks?: number;
    externalMaxMarks?: number;
    totalMaxMarks?: number;
  }) {
    // Validate that weights sum to 100
    const weights = [
      data.internalWeight ?? 30,
      data.externalWeight ?? 70,
      data.assignmentWeight ?? 0,
      data.quizWeight ?? 0,
      data.labWeight ?? 0,
      data.attendanceWeight ?? 0,
      data.projectWeight ?? 0,
      data.presentationWeight ?? 0
    ];
    const total = weights.reduce((a, b) => a + b, 0);

    if (Math.abs(total - 100) > 0.01) {
      throw ApiError.badRequest(
        `Assessment component weightages must sum to 100%. Current sum: ${total}%.`
      );
    }

    return componentRepo.createOrUpdate(subjectId, {
      ...data,
      universityId: data.universityId || null
    });
  }

  // ─── GET COMPONENTS BY SUBJECT ──────────────────────────────────────
  async getComponentsBySubject(subjectId: string) {
    const component = await componentRepo.findBySubject(subjectId);
    if (!component) {
      // Return sensible defaults if not configured
      return {
        subjectId,
        internalWeight: 30,
        externalWeight: 70,
        assignmentWeight: 0,
        quizWeight: 0,
        labWeight: 0,
        attendanceWeight: 0,
        projectWeight: 0,
        presentationWeight: 0,
        internalMaxMarks: 30,
        externalMaxMarks: 70,
        totalMaxMarks: 100,
        isDefault: true
      };
    }
    return component;
  }

  // ─── LIST ALL COMPONENTS FOR UNIVERSITY ─────────────────────────────
  async getUniversityComponents(universityId: string | null) {
    return componentRepo.findByUniversity(universityId);
  }
}
