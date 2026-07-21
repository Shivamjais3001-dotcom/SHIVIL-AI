import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  registerUniversitySchema,
  registerAdminSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} from "./auth.validator";

const router = Router();
const authController = new AuthController();

// Stricter rate limiting on sensitive authentication operations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  limit: 10, // Limit each IP to 10 authentication requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests from this IP terminal. Please try again after 15 minutes.",
    data: null,
    meta: null,
    errors: { code: "TOO_MANY_REQUESTS", retryAfter: "15m" }
  }
});

// Open Tenancy Setup (allows initial university & admin registration)
router.post("/register-university", validate(registerUniversitySchema), authController.registerUniversity);

// Admin onboarding within a tenant (requires SUPER_ADMIN credentials)
router.post(
  "/register-admin",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(registerAdminSchema),
  authController.registerAdmin
);

// Standard Login & Refresh Flows with rate limits
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Verification & Recovery Flows with rate limits
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);
router.get("/verify-email", authController.verifyEmail); // Supports link clicks from mailers

// Authenticated Account management
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

// Session & Active Device Auditing / Revocation
router.get("/sessions", authenticate, authController.getActiveSessions);
router.delete("/sessions/:sessionId", authenticate, authController.revokeSession);
router.delete("/sessions", authenticate, authController.revokeAllDevices);

// API Keys (Future AI & Worker Integration) management
router.get("/api-keys", authenticate, authController.getApiKeys);
router.post("/api-keys", authenticate, authController.createApiKey);
router.delete("/api-keys/:keyId", authenticate, authController.revokeApiKey);

export default router;
