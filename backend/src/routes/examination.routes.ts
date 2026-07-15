import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { ExaminationController } from "../controllers/examination.controller";
import { MarksController } from "../controllers/marks.controller";
import { GradingController } from "../controllers/grading.controller";
import { ResultController } from "../controllers/result.controller";
import { ExamAnalyticsController } from "../controllers/exam-analytics.controller";
import {
  createExamSchema,
  updateExamSchema,
  assessmentComponentSchema,
  enterMarksSchema,
  bulkMarksSchema,
  moderationSchema,
  approvalSchema,
  reEvalRequestSchema,
  reEvalProcessSchema,
  gradingPolicySchema,
  gradeSimulateSchema,
  processResultSchema,
  batchProcessResultSchema
} from "../validators/examination.validator";

const router = Router();
const examCtrl = new ExaminationController();
const marksCtrl = new MarksController();
const gradingCtrl = new GradingController();
const resultCtrl = new ResultController();
const analyticsCtrl = new ExamAnalyticsController();

// All routes require authentication
router.use(authenticate);

// ============================================================
// EXAMINATION MANAGEMENT
// ============================================================
router.post(
  "/exams",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  validate(createExamSchema),
  examCtrl.createExam
);

router.get(
  "/exams",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY", "STUDENT"),
  examCtrl.getExams
);

router.get(
  "/exams/calendar",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY", "STUDENT"),
  examCtrl.getExamCalendar
);

router.get(
  "/exams/conflicts",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  examCtrl.checkConflicts
);

router.get(
  "/exams/:id",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY", "STUDENT"),
  examCtrl.getExamById
);

router.put(
  "/exams/:id",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  validate(updateExamSchema),
  examCtrl.updateExam
);

router.delete(
  "/exams/:id",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  examCtrl.deleteExam
);

router.post(
  "/exams/:id/lock",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  examCtrl.lockExam
);

router.get(
  "/exams/:id/audit",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  examCtrl.getAuditTrail
);

// ============================================================
// ASSESSMENT COMPONENTS
// ============================================================
router.post(
  "/components",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  validate(assessmentComponentSchema),
  examCtrl.setAssessmentComponents
);

router.get(
  "/components/:subjectId",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY", "STUDENT"),
  examCtrl.getAssessmentComponents
);

// ============================================================
// MARKS MANAGEMENT
// ============================================================
router.post(
  "/marks/entry",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY"),
  validate(enterMarksSchema),
  marksCtrl.enterMarks
);

router.post(
  "/marks/bulk",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY"),
  validate(bulkMarksSchema),
  marksCtrl.bulkEnterMarks
);

router.get(
  "/marks/pending-approvals",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  marksCtrl.getPendingApprovals
);

router.get(
  "/marks/exam/:examId",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY"),
  marksCtrl.getMarksByExam
);

router.get(
  "/marks/student/:studentId",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY", "STUDENT"),
  marksCtrl.getStudentMarks
);

router.post(
  "/marks/:examId/lock-all",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  marksCtrl.lockMarks
);

router.put(
  "/marks/:id/moderate",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  validate(moderationSchema),
  marksCtrl.moderateMarks
);

router.put(
  "/marks/:id/approve",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  validate(approvalSchema),
  marksCtrl.approveMarks
);

// ============================================================
// RE-EVALUATION
// ============================================================
router.post(
  "/reevaluation",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "STUDENT"),
  validate(reEvalRequestSchema),
  marksCtrl.requestReEvaluation
);

router.get(
  "/reevaluation",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY", "STUDENT"),
  marksCtrl.getReEvaluations
);

router.put(
  "/reevaluation/:id",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  validate(reEvalProcessSchema),
  marksCtrl.processReEvaluation
);

// ============================================================
// GRADING POLICY
// ============================================================
router.post(
  "/grading/policy",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  validate(gradingPolicySchema),
  gradingCtrl.setGradingPolicy
);

router.get(
  "/grading/policy",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY"),
  gradingCtrl.getGradingPolicy
);

router.post(
  "/grading/simulate",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY"),
  validate(gradeSimulateSchema),
  gradingCtrl.simulateGrade
);

// ============================================================
// RESULT PROCESSING
// ============================================================
router.post(
  "/results/process",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  validate(processResultSchema),
  resultCtrl.processStudentResult
);

router.post(
  "/results/process-batch",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER"),
  validate(batchProcessResultSchema),
  resultCtrl.processBatchResults
);

router.get(
  "/results/semester",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY"),
  resultCtrl.getSemesterResults
);

router.get(
  "/results/backlogs",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  resultCtrl.getBacklogStudents
);

router.get(
  "/results/student/:studentId",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY", "STUDENT"),
  resultCtrl.getStudentResults
);

router.get(
  "/results/transcript/:studentId",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "STUDENT"),
  resultCtrl.generateTranscript
);

// ============================================================
// ANALYTICS
// ============================================================
router.get(
  "/analytics/dashboard",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  analyticsCtrl.getDashboard
);

router.get(
  "/analytics/department",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  analyticsCtrl.getDepartmentComparison
);

router.get(
  "/analytics/subject-difficulty",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY"),
  analyticsCtrl.getSubjectDifficulty
);

router.get(
  "/analytics/cgpa-distribution",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  analyticsCtrl.getCGPADistribution
);

router.get(
  "/analytics/top-performers",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD", "FACULTY"),
  analyticsCtrl.getTopPerformers
);

router.get(
  "/analytics/trends",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  analyticsCtrl.getPerformanceTrends
);

router.get(
  "/analytics/backlogs",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "EXAM_CONTROLLER", "HOD"),
  analyticsCtrl.getBacklogAnalytics
);

export default router;
