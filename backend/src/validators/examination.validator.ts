import { z } from "zod";

// ─── EXAM TIME PATTERN ──────────────────────────────────────────────────────
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// ─── CREATE EXAM ────────────────────────────────────────────────────────────
export const createExamSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Exam title is required" }).min(3).max(200),
    examType: z.enum([
      "MID_SEMESTER", "END_SEMESTER", "QUIZ", "ASSIGNMENT",
      "LAB_EXAM", "PRACTICAL", "VIVA", "PROJECT_EVALUATION",
      "RETEST", "SUPPLEMENTARY"
    ], { required_error: "Exam type is required" }),
    subjectId: z.string({ required_error: "Subject ID is required" }).uuid(),
    semester: z.string({ required_error: "Semester is required" }),
    academicYear: z.string({ required_error: "Academic year is required" }),
    date: z.string({ required_error: "Exam date is required" }).datetime({ message: "Invalid date format. Use ISO 8601." }),
    startTime: z.string({ required_error: "Start time is required" }).regex(timeRegex, "Use HH:MM format"),
    endTime: z.string({ required_error: "End time is required" }).regex(timeRegex, "Use HH:MM format"),
    classroomId: z.string().uuid().optional(),
    invigilatorId: z.string().uuid().optional(),
    venueDetails: z.any().optional(),
    maxMarks: z.number().positive().default(100),
    passingMarks: z.number().min(0).default(40),
    weightagePercent: z.number().min(0).max(100).default(100),
    duration: z.number().int().positive().default(180),
    difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]).optional()
  })
});

// ─── UPDATE EXAM ────────────────────────────────────────────────────────────
export const updateExamSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    date: z.string().datetime().optional(),
    startTime: z.string().regex(timeRegex).optional(),
    endTime: z.string().regex(timeRegex).optional(),
    classroomId: z.string().uuid().optional(),
    invigilatorId: z.string().uuid().optional(),
    venueDetails: z.any().optional(),
    maxMarks: z.number().positive().optional(),
    passingMarks: z.number().min(0).optional(),
    duration: z.number().int().positive().optional(),
    difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]).optional()
  })
});

// ─── ASSESSMENT COMPONENT ───────────────────────────────────────────────────
export const assessmentComponentSchema = z.object({
  body: z.object({
    subjectId: z.string({ required_error: "Subject ID is required" }).uuid(),
    internalWeight: z.number().min(0).max(100).default(30),
    externalWeight: z.number().min(0).max(100).default(70),
    assignmentWeight: z.number().min(0).max(100).default(0),
    quizWeight: z.number().min(0).max(100).default(0),
    labWeight: z.number().min(0).max(100).default(0),
    attendanceWeight: z.number().min(0).max(100).default(0),
    projectWeight: z.number().min(0).max(100).default(0),
    presentationWeight: z.number().min(0).max(100).default(0),
    internalMaxMarks: z.number().positive().default(30),
    externalMaxMarks: z.number().positive().default(70),
    totalMaxMarks: z.number().positive().default(100)
  })
});

// ─── SINGLE MARKS ENTRY ──────────────────────────────────────────────────────
export const enterMarksSchema = z.object({
  body: z.object({
    examId: z.string({ required_error: "Exam ID is required" }).uuid(),
    studentId: z.string({ required_error: "Student ID is required" }).uuid(),
    internalMarks: z.number().min(0).optional(),
    externalMarks: z.number().min(0).optional(),
    assignmentMarks: z.number().min(0).optional(),
    quizMarks: z.number().min(0).optional(),
    labMarks: z.number().min(0).optional(),
    projectMarks: z.number().min(0).optional(),
    presentationMarks: z.number().min(0).optional(),
    attendanceMarks: z.number().min(0).optional()
  })
});

// ─── BULK MARKS ENTRY ────────────────────────────────────────────────────────
export const bulkMarksSchema = z.object({
  body: z.object({
    examId: z.string({ required_error: "Exam ID is required" }).uuid(),
    records: z.array(
      z.object({
        studentId: z.string().uuid(),
        internalMarks: z.number().min(0).optional(),
        externalMarks: z.number().min(0).optional(),
        assignmentMarks: z.number().min(0).optional(),
        quizMarks: z.number().min(0).optional(),
        labMarks: z.number().min(0).optional(),
        projectMarks: z.number().min(0).optional(),
        presentationMarks: z.number().min(0).optional(),
        attendanceMarks: z.number().min(0).optional()
      })
    ).min(1, "At least one mark record is required")
  })
});

// ─── MODERATION ──────────────────────────────────────────────────────────────
export const moderationSchema = z.object({
  body: z.object({
    moderationDelta: z.number({ required_error: "Moderation delta is required" }),
    moderationReason: z.string({ required_error: "Moderation reason is required" }).min(10).max(500)
  })
});

// ─── APPROVAL ────────────────────────────────────────────────────────────────
export const approvalSchema = z.object({
  body: z.object({
    action: z.enum(["APPROVE", "REJECT"], { required_error: "Action must be APPROVE or REJECT" }),
    rejectionReason: z.string().min(10).max(500).optional()
  })
});

// ─── RE-EVALUATION REQUEST ───────────────────────────────────────────────────
export const reEvalRequestSchema = z.object({
  body: z.object({
    examId: z.string({ required_error: "Exam ID is required" }).uuid(),
    examMarkId: z.string().uuid().optional(),
    studentId: z.string({ required_error: "Student ID is required" }).uuid(),
    reason: z.string({ required_error: "Re-evaluation reason is required" }).min(20).max(1000)
  })
});

// ─── RE-EVALUATION PROCESS ───────────────────────────────────────────────────
export const reEvalProcessSchema = z.object({
  body: z.object({
    status: z.enum(["IN_REVIEW", "COMPLETED", "REJECTED"]),
    reviewNotes: z.string().min(5).max(500).optional(),
    revisedMarks: z.number().min(0).optional(),
    revisedGrade: z.string().optional(),
    previousMarks: z.number().min(0).optional(),
    previousGrade: z.string().optional()
  })
});

// ─── GRADING POLICY ──────────────────────────────────────────────────────────
export const gradingPolicySchema = z.object({
  body: z.object({
    gradeBoundaries: z.record(z.string(), z.number().min(0).max(100)).optional(),
    gradePoints: z.record(z.string(), z.number().min(0).max(10)).optional(),
    creditSystem: z.enum(["10_POINT", "4_POINT", "PERCENTAGE"]).optional(),
    promotionMinCGPA: z.number().min(0).max(10).optional(),
    promotionMaxBacklogs: z.number().int().min(0).optional(),
    graduationMinCredits: z.number().int().positive().optional(),
    graduationMinCGPA: z.number().min(0).max(10).optional(),
    passingGradePoint: z.number().min(0).max(10).optional(),
    customRules: z.any().optional()
  })
});

// ─── GRADE SIMULATION ─────────────────────────────────────────────────────────
export const gradeSimulateSchema = z.object({
  body: z.object({
    marks: z.number({ required_error: "Marks are required" }).min(0),
    maxMarks: z.number().positive().default(100)
  })
});

// ─── RESULT PROCESSING ───────────────────────────────────────────────────────
export const processResultSchema = z.object({
  body: z.object({
    studentId: z.string({ required_error: "Student ID is required" }).uuid(),
    semester: z.string({ required_error: "Semester is required" }),
    academicYear: z.string({ required_error: "Academic year is required" })
  })
});

export const batchProcessResultSchema = z.object({
  body: z.object({
    semester: z.string({ required_error: "Semester is required" }),
    academicYear: z.string({ required_error: "Academic year is required" }),
    branch: z.string().optional()
  })
});
