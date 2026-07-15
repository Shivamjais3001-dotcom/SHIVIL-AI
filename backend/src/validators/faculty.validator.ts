import { z } from "zod";

export const createFacultySchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User ID is required" }).uuid("Invalid user ID format"),
    name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters"),
    department: z.string({ required_error: "Department code is required" }),
    specialty: z.string().optional()
  })
});

export const updateFacultySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    department: z.string().optional(),
    specialty: z.string().optional()
  })
});
