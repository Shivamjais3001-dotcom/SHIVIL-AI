import { z } from "zod";

// In case the prisma client isn't generated yet during lint/build, we can fallback to standard arrays
const roleEnum = z.enum(["SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD", "FACULTY", "STUDENT", "PARENT"]);

export const registerSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address format"),
    password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
    role: roleEnum.default("STUDENT")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address format"),
    password: z.string({ required_error: "Password is required" })
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: "Reset token is required" }),
    newPassword: z.string({ required_error: "New password is required" }).min(6, "Password must be at least 6 characters")
  })
});
