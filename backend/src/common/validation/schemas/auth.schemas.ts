import { z } from "zod";
import { commonValidators } from "../helpers/common-validators";
import { Role } from "@prisma/client";

// ─── SIGNUP SCHEMA ─────────────────────────────────────────────────────
export const SignupSchema = z.object({
  body: z.object({
    email: commonValidators.email,
    password: commonValidators.password,
    role: z.nativeEnum(Role).default(Role.STUDENT),
    universityId: commonValidators.uuid.optional(),
  }),
});

export type SignupInput = z.infer<typeof SignupSchema>["body"];

// ─── LOGIN SCHEMA ──────────────────────────────────────────────────────
export const LoginSchema = z.object({
  body: z.object({
    email: commonValidators.email,
    password: z.string({ required_error: "Password is required" }).min(1, "Password cannot be empty"),
  }),
});

export type LoginInput = z.infer<typeof LoginSchema>["body"];

// ─── REFRESH TOKEN SCHEMA ──────────────────────────────────────────────
export const RefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }).min(1, "Refresh token cannot be empty"),
  }),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>["body"];

// ─── FORGOT PASSWORD SCHEMA ────────────────────────────────────────────
export const ForgotPasswordSchema = z.object({
  body: z.object({
    email: commonValidators.email,
  }),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>["body"];

// ─── RESET PASSWORD SCHEMA ─────────────────────────────────────────────
export const ResetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: "Password reset token is required" }).min(1, "Token is required"),
    newPassword: commonValidators.password,
  }),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>["body"];

// ─── EMAIL VERIFICATION SCHEMA ─────────────────────────────────────────
export const EmailVerificationSchema = z.object({
  query: z.object({
    token: z.string({ required_error: "Verification token is required" }).min(1, "Token is required"),
  }),
});

export type EmailVerificationInput = z.infer<typeof EmailVerificationSchema>["query"];

// ─── RESEND VERIFICATION SCHEMA ────────────────────────────────────────
export const ResendVerificationSchema = z.object({
  body: z.object({
    email: commonValidators.email,
  }),
});

export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>["body"];

// ─── LOGOUT SCHEMA ─────────────────────────────────────────────────────
export const LogoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
});

export type LogoutInput = z.infer<typeof LogoutSchema>["body"];
