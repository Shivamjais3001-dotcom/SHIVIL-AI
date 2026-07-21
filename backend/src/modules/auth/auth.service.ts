import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserRepository } from "../../repositories/user.repository";
import { PasswordService } from "./services/password.service";
import { TokenService } from "./services/token.service";
import { EmailService } from "./services/email.service";
import { JwtService } from "./services/jwt.service";
import { SignupInput, ResendVerificationInput, LoginInput } from "../../common/validation/schemas/auth.schemas";
import { TransactionHelper } from "../../database/utils/transaction.util";
import { AppError } from "../../common/errors/AppError";
import { ApiError } from "../../utils/api-error";
import { signAccessToken, signRefreshToken, verifyRefreshToken, TokenPayload } from "../../utils/jwt";
import { Role as PrismaRole } from "@prisma/client";
import { Role } from "../../types/role";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface SignupContext {
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

export interface SignupResponseDto {
  user: {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    status: string;
    universityId: string | null;
    createdAt: Date;
  };
  message: string;
}

export interface LoginResponseDto {
  user: {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    status: string;
    universityId: string | null;
    universityName: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly passwordService: PasswordService = new PasswordService(),
    private readonly tokenService: TokenService = new TokenService(),
    private readonly emailService: EmailService = new EmailService(),
    private readonly jwtService: JwtService = new JwtService()
  ) {}

  /**
   * Enterprise Production Signup Service
   */
  async signup(data: SignupInput, context?: SignupContext): Promise<SignupResponseDto> {
    const normalizedEmail = data.email.trim().toLowerCase();

    // 1. Check for Duplicate Email (Prevent Duplicate Registrations)
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError("An account with this email address already exists.", 409);
    }

    // 2. Validate Password Security Policy
    const policyResult = this.passwordService.validatePolicy(data.password);
    if (!policyResult.isValid) {
      throw new AppError(`Password validation failed: ${policyResult.errors.join(" ")}`, 400);
    }

    // 3. Hash Password securely via PasswordService
    const passwordHash = await this.passwordService.hash(data.password);

    // 4. Generate Email Verification Token Pair (Raw + Hashed)
    const { rawToken, hashedToken } = this.tokenService.generateRandomToken();
    const verificationExpiry = this.tokenService.calculateExpiry(24);

    // 5. Execute Atomic Database Writes inside Prisma Transaction
    const createdUser = await TransactionHelper.runInTransaction(async (tx) => {
      const user = await this.userRepository.create(
        {
          email: normalizedEmail,
          passwordHash,
          role: data.role as PrismaRole,
          universityId: data.universityId,
        },
        tx
      );

      await this.userRepository.assignRole(
        {
          userId: user.id,
          roleCode: data.role,
        },
        tx
      );

      await this.userRepository.createEmailVerification(
        {
          userId: user.id,
          token: hashedToken,
          expiresAt: verificationExpiry,
        },
        tx
      );

      await this.userRepository.createAuditLog(
        {
          action: "USER_REGISTERED",
          userId: user.id,
          ipAddress: context?.ipAddress,
          details: {
            requestId: context?.requestId,
            role: data.role,
            universityId: data.universityId || null,
          },
        },
        tx
      );

      return user;
    });

    // 6. Queue Verification Email via EmailService Abstraction (Outside DB Transaction)
    await this.emailService.sendVerificationEmail(createdUser.email, rawToken);

    // 7. Return Sanitized Response DTO
    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        isVerified: createdUser.isVerified,
        status: createdUser.status,
        universityId: createdUser.universityId,
        createdAt: createdUser.createdAt,
      },
      message: "Registration successful. Please check your email to verify your account.",
    };
  }

  /**
   * Enterprise Production Login Service (Password Verification, Session Management, Audit Logging)
   */
  async login(data: LoginInput, context?: SignupContext): Promise<LoginResponseDto> {
    const normalizedEmail = data.email.trim().toLowerCase();

    // 1. Lookup User (Prevent Account Enumeration via Uniform Error Message)
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      await this.userRepository.createAuditLog({
        action: "LOGIN_FAILED_UNKNOWN_EMAIL",
        ipAddress: context?.ipAddress,
        details: { email: normalizedEmail, requestId: context?.requestId },
      });
      throw new AppError("Invalid email or password credentials.", 401);
    }

    // 2. Verify Password via PasswordService
    const isPasswordValid = await this.passwordService.verify(data.password, user.passwordHash);
    if (!isPasswordValid) {
      await this.userRepository.createAuditLog({
        action: "LOGIN_FAILED_INVALID_PASSWORD",
        userId: user.id,
        ipAddress: context?.ipAddress,
        details: { requestId: context?.requestId },
      });
      throw new AppError("Invalid email or password credentials.", 401);
    }

    // 3. Reject Inactive/Suspended Accounts
    if (user.status === "SUSPENDED" || user.status === "INACTIVE") {
      await this.userRepository.createAuditLog({
        action: "LOGIN_REJECTED_ACCOUNT_SUSPENDED",
        userId: user.id,
        ipAddress: context?.ipAddress,
        details: { status: user.status, requestId: context?.requestId },
      });
      throw new AppError("Your account has been suspended or deactivated. Please contact support.", 403);
    }

    // 4. Reject Unverified Emails
    if (!user.isVerified) {
      await this.userRepository.createAuditLog({
        action: "LOGIN_REJECTED_UNVERIFIED_EMAIL",
        userId: user.id,
        ipAddress: context?.ipAddress,
        details: { requestId: context?.requestId },
      });
      throw new AppError("Please verify your email address before signing in.", 403);
    }

    // 5. Generate Refresh Token Pair & 30-Day Expiry Date
    const { rawToken: rawRefreshToken, hashedToken: hashedRefreshToken } = this.tokenService.generateRandomToken();
    const refreshExpiry = this.tokenService.calculateExpiry(30 * 24); // 30 days expiry

    // 6. Create Session Record & Audit Log inside Transaction
    await TransactionHelper.runInTransaction(async (tx) => {
      await this.userRepository.createSession(
        {
          refreshToken: hashedRefreshToken,
          userId: user.id,
          expiresAt: refreshExpiry,
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
        tx
      );

      await this.userRepository.createAuditLog(
        {
          action: "USER_LOGIN_SUCCESS",
          userId: user.id,
          ipAddress: context?.ipAddress,
          details: { userAgent: context?.userAgent, requestId: context?.requestId },
        },
        tx
      );
    });

    // 7. Generate Signed 15-Minute Access Token
    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      universityId: user.universityId,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
        universityId: user.universityId,
        universityName: user.university?.name || null,
      },
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  /**
   * Enterprise Refresh Token Rotation Service (Defends Against Replay Attacks)
   */
  async refresh(rawRefreshToken: string, context?: SignupContext): Promise<{ accessToken: string; refreshToken: string }> {
    if (!rawRefreshToken) {
      throw new AppError("Refresh token is required.", 400);
    }

    const hashedRefreshToken = this.tokenService.hashToken(rawRefreshToken);
    
    // Look up session in DB (support both hashed and legacy unhashed lookup defensively)
    let session = await this.userRepository.findSessionByToken(hashedRefreshToken);
    if (!session) {
      session = await this.userRepository.findSessionByToken(rawRefreshToken);
    }

    // Reuse Detection & Replay Attack Protection: If token is valid JWT but session absent, revoke ALL user sessions
    if (!session) {
      try {
        const decoded = this.jwtService.verifyRefreshToken(rawRefreshToken);
        if (decoded?.userId) {
          await this.userRepository.deleteSessionsByUserId(decoded.userId);
          await this.userRepository.createAuditLog({
            action: "SECURITY_ALERT_REFRESH_TOKEN_REUSE",
            userId: decoded.userId,
            ipAddress: context?.ipAddress,
            details: { reason: "COMPROMISED_TOKEN_REUSE_ATTEMPT", requestId: context?.requestId },
          });
        }
      } catch {
        // Fallback for invalid signature
      }
      throw new AppError("Security alert: Invalid or compromised session token. Access revoked across all devices.", 401);
    }

    // Check expiration
    if (this.tokenService.isExpired(session.expiresAt)) {
      await this.userRepository.deleteSession(session.refreshToken);
      throw new AppError("Session expired. Please sign in again.", 401);
    }

    // Rotate Refresh Token: Delete Old Session & Create New Session
    const { rawToken: newRawRefreshToken, hashedToken: newHashedRefreshToken } = this.tokenService.generateRandomToken();
    const newRefreshExpiry = this.tokenService.calculateExpiry(30 * 24); // 30 days

    await TransactionHelper.runInTransaction(async (tx) => {
      await this.userRepository.deleteSession(session.refreshToken, tx);
      await this.userRepository.createSession(
        {
          refreshToken: newHashedRefreshToken,
          userId: session.userId,
          expiresAt: newRefreshExpiry,
          ipAddress: context?.ipAddress || session.ipAddress || undefined,
          userAgent: context?.userAgent || session.userAgent || undefined,
        },
        tx
      );
    });

    // Generate New Access Token
    const newAccessToken = this.jwtService.generateAccessToken({
      userId: session.user.id,
      role: session.user.role,
      universityId: session.user.universityId,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
    };
  }

  /**
   * Session Termination (Logout)
   */
  async logout(rawRefreshToken: string, context?: SignupContext): Promise<void> {
    if (!rawRefreshToken) return;

    const hashedRefreshToken = this.tokenService.hashToken(rawRefreshToken);
    let session = await this.userRepository.findSessionByToken(hashedRefreshToken);
    if (!session) {
      session = await this.userRepository.findSessionByToken(rawRefreshToken);
    }

    if (session) {
      await this.userRepository.deleteSession(session.refreshToken);
      await this.userRepository.createAuditLog({
        action: "USER_LOGOUT",
        userId: session.userId,
        ipAddress: context?.ipAddress,
        details: { requestId: context?.requestId },
      });
    }
  }

  /**
   * Production Email Verification Service
   */
  async verifyEmail(token: string, context?: SignupContext): Promise<{ message: string }> {
    if (!token || typeof token !== "string") {
      throw new AppError("Verification token parameter is missing or invalid.", 400);
    }

    const hashedToken = this.tokenService.hashToken(token);
    const verificationRecord = await this.userRepository.findEmailVerificationByToken(hashedToken);

    if (!verificationRecord) {
      await this.userRepository.createAuditLog({
        action: "USER_EMAIL_VERIFICATION_FAILED",
        ipAddress: context?.ipAddress,
        details: { reason: "TOKEN_NOT_FOUND", requestId: context?.requestId },
      });
      throw new AppError("Invalid or expired verification token.", 400);
    }

    if (verificationRecord.usedAt || (verificationRecord as any).status === "REVOKED") {
      await this.userRepository.createAuditLog({
        action: "USER_EMAIL_VERIFICATION_FAILED",
        userId: verificationRecord.userId,
        ipAddress: context?.ipAddress,
        details: { reason: "TOKEN_ALREADY_USED_OR_REVOKED", requestId: context?.requestId },
      });
      throw new AppError("This verification token has already been used or revoked.", 400);
    }

    if (this.tokenService.isExpired(verificationRecord.expiresAt)) {
      await this.userRepository.createAuditLog({
        action: "USER_EMAIL_VERIFICATION_FAILED",
        userId: verificationRecord.userId,
        ipAddress: context?.ipAddress,
        details: { reason: "TOKEN_EXPIRED", requestId: context?.requestId },
      });
      throw new AppError("Verification token has expired. Please request a new verification email.", 400);
    }

    const user = await this.userRepository.findById(verificationRecord.userId);
    if (!user) {
      throw new AppError("Associated user account not found.", 404);
    }

    if (user.isVerified) {
      await this.userRepository.markEmailVerificationUsed(hashedToken);
      return { message: "Email address is already verified." };
    }

    await TransactionHelper.runInTransaction(async (tx) => {
      await this.userRepository.update(user.id, { isVerified: true, status: "ACTIVE" }, tx);
      await this.userRepository.markEmailVerificationUsed(hashedToken, tx);
      await this.userRepository.createAuditLog(
        {
          action: "USER_EMAIL_VERIFIED_SUCCESS",
          userId: user.id,
          ipAddress: context?.ipAddress,
          details: { requestId: context?.requestId },
        },
        tx
      );
    });

    return { message: "Email address verified successfully. You may now sign in." };
  }

  /**
   * Production Resend Verification Email Service (Prevents Email Enumeration)
   */
  async resendVerification(data: ResendVerificationInput, context?: SignupContext): Promise<{ message: string }> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const genericResponseMessage = "If an unverified account exists for this email, a new verification link has been sent.";

    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user || user.isVerified) {
      if (user?.isVerified) {
        await this.userRepository.createAuditLog({
          action: "USER_VERIFICATION_RESEND_SKIPPED",
          userId: user.id,
          ipAddress: context?.ipAddress,
          details: { reason: "ALREADY_VERIFIED", requestId: context?.requestId },
        });
      }
      return { message: genericResponseMessage };
    }

    await this.userRepository.invalidateActiveEmailVerifications(user.id);

    const { rawToken, hashedToken } = this.tokenService.generateRandomToken();
    const verificationExpiry = this.tokenService.calculateExpiry(24);

    await TransactionHelper.runInTransaction(async (tx) => {
      await this.userRepository.createEmailVerification(
        {
          userId: user.id,
          token: hashedToken,
          expiresAt: verificationExpiry,
        },
        tx
      );

      await this.userRepository.createAuditLog(
        {
          action: "USER_VERIFICATION_RESENT",
          userId: user.id,
          ipAddress: context?.ipAddress,
          details: { requestId: context?.requestId },
        },
        tx
      );
    });

    await this.emailService.sendVerificationEmail(user.email, rawToken);

    return { message: genericResponseMessage };
  }

  // --- UNIVERSITY & ADMIN REGISTRATION ---
  async registerUniversity(data: { name: string; domain: string; adminEmail: string; adminPassword?: string }) {
    const normalizedEmail = data.adminEmail.trim().toLowerCase();
    const existingName = await this.userRepository.findUniversityByName(data.name);
    if (existingName) {
      throw ApiError.conflict("A university with this name is already registered.");
    }

    const existingDomain = await this.userRepository.findUniversityByDomain(data.domain);
    if (existingDomain) {
      throw ApiError.conflict("A university with this domain is already registered.");
    }

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw ApiError.conflict("An account with this email address already exists.");
    }

    const university = await this.userRepository.createUniversity({
      name: data.name,
      domain: data.domain
    });

    const passwordHash = await this.passwordService.hash(data.adminPassword || "DefaultAdmin123!");
    const adminUser = await this.userRepository.create({
      email: normalizedEmail,
      passwordHash,
      role: "UNIVERSITY_ADMIN" as PrismaRole,
      universityId: university.id
    });

    const { rawToken, hashedToken } = this.tokenService.generateRandomToken();
    const expiresAt = this.tokenService.calculateExpiry(24);

    await this.userRepository.createEmailVerification({
      userId: adminUser.id,
      token: hashedToken,
      expiresAt
    });

    await this.emailService.sendVerificationEmail(adminUser.email, rawToken);

    await this.userRepository.createAuditLog({
      action: "UNIVERSITY_REGISTERED",
      userId: adminUser.id,
      details: { universityId: university.id, universityName: university.name }
    });

    return {
      university,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        isVerified: adminUser.isVerified
      }
    };
  }

  async registerAdmin(data: { email: string; passwordHash: string; role: Role; universityId: string }) {
    const normalizedEmail = data.email.trim().toLowerCase();
    const university = await this.userRepository.findUniversityById(data.universityId);
    if (!university) {
      throw ApiError.notFound("Target university tenant not found.");
    }

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw ApiError.conflict("A user with this email address already exists.");
    }

    const passwordHash = await this.passwordService.hash(data.passwordHash);
    const user = await this.userRepository.create({
      email: normalizedEmail,
      passwordHash,
      role: data.role as PrismaRole,
      universityId: data.universityId
    });

    const { rawToken, hashedToken } = this.tokenService.generateRandomToken();
    const expiresAt = this.tokenService.calculateExpiry(24);

    await this.userRepository.createEmailVerification({
      userId: user.id,
      token: hashedToken,
      expiresAt
    });

    await this.emailService.sendVerificationEmail(user.email, rawToken);

    await this.userRepository.createAuditLog({
      action: "USER_REGISTERED",
      userId: user.id,
      details: { role: user.role, universityId: user.universityId }
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
      isVerified: user.isVerified
    };
  }

  // --- FORGOT & RESET PASSWORD ---
  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      console.log(`[SECURITY] Forgot password requested for non-existent email: ${email}`);
      return;
    }

    const { rawToken, hashedToken } = this.tokenService.generateRandomToken();
    const expiresAt = this.tokenService.calculateExpiry(1);

    await this.userRepository.createPasswordReset({
      userId: user.id,
      token: hashedToken,
      expiresAt
    });

    await this.emailService.sendPasswordResetEmail(user.email, rawToken);

    await this.userRepository.createAuditLog({
      action: "USER_FORGOT_PASSWORD_REQUEST",
      userId: user.id
    });
  }

  async resetPassword(token: string, newPasswordHash: string) {
    const hashedToken = hashToken(token);
    const resetRecord = await this.userRepository.findPasswordResetByToken(hashedToken);
    if (!resetRecord) {
      throw ApiError.unauthorized("Invalid password reset token.");
    }

    if (resetRecord.usedAt) {
      throw ApiError.badRequest("This password reset token has already been used.");
    }

    if (new Date() > resetRecord.expiresAt) {
      throw ApiError.badRequest("This password reset token has expired.");
    }

    const passwordHash = await this.passwordService.hash(newPasswordHash);
    await this.userRepository.update(resetRecord.userId, { passwordHash });
    await this.userRepository.markPasswordResetUsed(hashedToken);

    await this.userRepository.deleteSessionsByUserId(resetRecord.userId);

    await this.userRepository.createAuditLog({
      action: "USER_PASSWORD_RESET_SUCCESS",
      userId: resetRecord.userId
    });
  }

  // --- CHANGE PASSWORD ---
  async changePassword(userId: string, data: { oldPasswordHash: string; newPasswordHash: string }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User account not found.");
    }

    const passwordMatch = await this.passwordService.verify(data.oldPasswordHash, user.passwordHash);
    if (!passwordMatch) {
      throw ApiError.unauthorized("Invalid original password credentials.");
    }

    const passwordHash = await this.passwordService.hash(data.newPasswordHash);
    await this.userRepository.update(userId, { passwordHash });

    await this.userRepository.deleteSessionsByUserId(userId);

    await this.userRepository.createAuditLog({
      action: "USER_PASSWORD_CHANGE_SUCCESS",
      userId
    });
  }

  // --- SESSION AUDITING & REVOCATION ---
  async getSessions(userId: string) {
    const sessions = await this.userRepository.findSessionsByUserId(userId);
    return sessions.map((s: any) => ({
      id: s.id,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      expiresAt: s.expiresAt,
      createdAt: s.createdAt
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.userRepository.findSessionById(sessionId);
    if (!session) {
      throw ApiError.notFound("Session not found.");
    }
    if (session.userId !== userId) {
      throw ApiError.forbidden("Access forbidden. Cannot revoke another user's session.");
    }
    await this.userRepository.deleteSessionById(sessionId);
  }

  async revokeAllSessions(userId: string) {
    await this.userRepository.deleteSessionsByUserId(userId);
  }

  // --- API KEY SERVICE ---
  async getApiKeys(userId: string) {
    const keys = await this.userRepository.findApiKeysByUserId(userId);
    return keys.map((k: any) => ({
      id: k.id,
      name: k.name,
      createdAt: k.createdAt,
      expiresAt: k.expiresAt,
      lastUsedAt: k.lastUsedAt
    }));
  }

  async createApiKey(userId: string, name: string) {
    const rawKey = `shivil_ak_${crypto.randomBytes(24).toString("hex")}`;
    const hashedKey = hashToken(rawKey);

    const apiKey = await this.userRepository.createApiKey({
      name,
      key: hashedKey,
      userId
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      apiKey: rawKey,
      createdAt: apiKey.createdAt
    };
  }

  async revokeApiKey(userId: string, keyId: string) {
    const apiKey = await this.userRepository.findApiKeyById(keyId);
    if (!apiKey) {
      throw ApiError.notFound("API Key not found.");
    }
    if (apiKey.userId !== userId) {
      throw ApiError.forbidden("Access forbidden. Cannot revoke another user's API Key.");
    }
    await this.userRepository.deleteApiKey(keyId);
  }
}
