import { z } from "zod";

export const createProgramSchema = z.object({
  body: z.object({
    code: z.string({ required_error: "Program code is required" }).min(2),
    name: z.string({ required_error: "Program name is required" }),
    durationYears: z.number().int().min(1).default(4),
    departmentId: z.string().optional()
  })
});

export const createClassroomSchema = z.object({
  body: z.object({
    building: z.string({ required_error: "Building name is required" }),
    roomNo: z.string({ required_error: "Room number is required" }),
    capacity: z.number({ required_error: "Seating capacity is required" }).int().positive(),
    type: z.string().optional(),
    resources: z.array(z.string()).optional()
  })
});

export const createOfferingSchema = z.object({
  body: z.object({
    subjectId: z.string({ required_error: "Subject ID is required" }).uuid(),
    facultyId: z.string().uuid().optional(),
    classroomId: z.string().uuid().optional(),
    section: z.string({ required_error: "Section code is required" }),
    semester: z.string({ required_error: "Semester is required" }),
    academicYear: z.string({ required_error: "Academic year is required" }),
    maxCapacity: z.number().int().positive().default(60)
  })
});

export const enrollStudentSchema = z.object({
  body: z.object({
    studentId: z.string({ required_error: "Student ID is required" }).uuid(),
    offeringId: z.string({ required_error: "Course offering ID is required" }).uuid()
  })
});

export const createCalendarEventSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    type: z.enum(["SemesterStart", "SemesterEnd", "Registration", "Exam", "Holiday"]),
    startDate: z.string({ required_error: "Start date is required" }).datetime(),
    endDate: z.string({ required_error: "End date is required" }).datetime(),
    description: z.string().optional()
  })
});
