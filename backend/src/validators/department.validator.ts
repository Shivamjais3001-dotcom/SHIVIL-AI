import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Department name is required" }).min(3, "Name must be at least 3 characters"),
    code: z.string({ required_error: "Department code is required" }).min(2, "Code must be at least 2 characters")
  })
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    code: z.string().min(2).optional()
  })
});
