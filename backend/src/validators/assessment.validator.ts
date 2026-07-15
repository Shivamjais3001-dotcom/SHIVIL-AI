import { z } from "zod";

export const createExamSchema = z.object({
  body: z.object({
    subjectId: z.string({ required_error: "Subject ID is required" }).uuid(),
    examType: z.enum(["MID_SEM", "END_SEM", "QUIZ", "ASSIGNMENT", "LAB", "PRACTICAL", "RETEST", "SUPPLEMENTARY"]),
    date: z.string({ required_error: "Date is required" }).datetime(),
    startTime: z.string({ required_error: "Start time is required" }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format"),
    endTime: z.string({ required_error: "End time is required" }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format"),
    classroomId: z.string().uuid().optional(),
    invigilatorId: z.string().uuid().optional(),
    maxMarks: z.number().positive().default(100),
    weightagePercent: z.number().min(0).max(100).default(100)
  })
});

export const recordMarksSchema = z.object({
  body: z.object({
    examId: z.string({ required_error: "Exam ID is required" }).uuid(),
    records: z.array(z.object({
      studentId: z.string({ required_error: "Student ID is required" }).uuid(),
      internalMarks: z.number().min(0),
      externalMarks: z.number().min(0),
      moderatedMarks: z.number().optional()
    }))
  })
});

export const gradingPolicySchema = z.object({
  body: z.object({
    rules: z.record(z.string(), z.number()), // e.g. { "A+": 90, "A": 80 }
    promotionMinCGPA: z.number().min(0).max(10).default(4.0),
    graduationMinCredits: z.number().int().positive().default(120)
  })
});
