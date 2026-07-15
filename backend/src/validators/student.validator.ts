import { z } from "zod";

export const createStudentSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User ID is required" }).uuid("Invalid user ID format"),
    rollNo: z.string({ required_error: "Roll number is required" }).min(3, "Roll number must be at least 3 characters"),
    name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters"),
    branch: z.string({ required_error: "Branch is required" }),
    semester: z.string({ required_error: "Semester is required" }),
    academicYear: z.string({ required_error: "Academic year is required" }),
    parentName: z.string().optional(),
    parentContact: z.string().optional(),
    photoUrl: z.string().url("Invalid photo URL format").or(z.literal("")).optional()
  })
});

export const updateStudentSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    branch: z.string().optional(),
    semester: z.string().optional(),
    academicYear: z.string().optional(),
    status: z.string().optional(),
    parentName: z.string().optional(),
    parentContact: z.string().optional(),
    photoUrl: z.string().url("Invalid photo URL format").or(z.literal("")).optional()
  })
});
