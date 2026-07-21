import { z } from "zod";

export const roleEnum = z.enum([
  "SUPER_ADMIN",
  "UNIVERSITY_ADMIN",
  "HOD",
  "FACULTY",
  "STUDENT",
  "ACCOUNTANT",
  "LIBRARIAN",
  "EXAM_CONTROLLER",
  "PLACEMENT_OFFICER",
  "HOSTEL_ADMIN",
  "PARENT"
]);

// Production-grade password complexity schema
export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const registerUniversitySchema = z.object({
  body: z.object({
    name: z.string({ required_error: "University name is required" }).min(3, "Name must be at least 3 characters"),
    domain: z.string({ required_error: "Domain is required" }).min(3, "Domain must be at least 3 characters"),
    adminEmail: z.string({ required_error: "Admin email is required" }).email("Invalid admin email format"),
    adminPassword: passwordSchema
  })
});

export const registerAdminSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: passwordSchema,
    universityId: z.string({ required_error: "University ID is required" }).uuid("Invalid university ID"),
    role: roleEnum.default("UNIVERSITY_ADMIN")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required" })
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format")
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: "Reset token is required" }),
    newPassword: passwordSchema
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: passwordSchema
  })
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string({ required_error: "Verification token is required" })
  })
});
