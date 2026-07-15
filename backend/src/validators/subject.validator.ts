import { z } from "zod";

export const createSubjectSchema = z.object({
  body: z.object({
    code: z.string({ required_error: "Subject code is required" }).min(2, "Code must be at least 2 characters"),
    name: z.string({ required_error: "Subject name is required" }).min(2, "Name must be at least 2 characters"),
    courseId: z.string({ required_error: "Course ID is required" }).uuid("Invalid course ID"),
    facultyId: z.string().uuid("Invalid faculty ID").optional()
  })
});

export const updateSubjectSchema = z.object({
  body: z.object({
    code: z.string().min(2).optional(),
    name: z.string().min(2).optional(),
    courseId: z.string().uuid("Invalid course ID").optional(),
    facultyId: z.string().uuid("Invalid faculty ID").optional()
  })
});
