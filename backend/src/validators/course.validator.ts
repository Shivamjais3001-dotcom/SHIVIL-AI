import { z } from "zod";

export const createCourseSchema = z.object({
  body: z.object({
    code: z.string({ required_error: "Course code is required" }).min(2, "Code must be at least 2 characters"),
    name: z.string({ required_error: "Course name is required" }).min(3, "Name must be at least 3 characters"),
    credits: z.number().int().min(1).max(10).optional(),
    semester: z.string({ required_error: "Semester is required" })
  })
});

export const updateCourseSchema = z.object({
  body: z.object({
    code: z.string().min(2).optional(),
    name: z.string().min(3).optional(),
    credits: z.number().int().min(1).max(10).optional(),
    semester: z.string().optional()
  })
});
