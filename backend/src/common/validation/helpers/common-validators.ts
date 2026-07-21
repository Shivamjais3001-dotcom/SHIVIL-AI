import { z } from "zod";

export const commonValidators = {
  // Email validator with trimming and normalization
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address format")
    .toLowerCase(),

  // Strict enterprise password validator
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

  // UUID v4 identifier validator
  uuid: z
    .string({ required_error: "ID parameter is required" })
    .uuid("Invalid UUID format"),

  // Phone number validator (E.164 international format)
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid international phone number format (E.164)"),

  // URL validator
  url: z
    .string()
    .trim()
    .url("Invalid URL format"),

  // Date validator with coercion
  date: z.coerce.date({ invalid_type_error: "Invalid date format" }),

  // Reusable pagination query validators
  pagination: z.object({
    page: z.coerce.number().int().min(1, "Page number must be at least 1").default(1),
    limit: z.coerce.number().int().min(1).max(100, "Limit cannot exceed 100").default(20),
    search: z.string().trim().optional(),
    sortBy: z.string().trim().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
};
