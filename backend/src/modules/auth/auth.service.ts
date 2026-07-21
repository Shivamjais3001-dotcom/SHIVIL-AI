import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserRepository } from "../../repositories/user.repository";
import { PasswordService } from "./services/password.service";
import { TokenService } from "./services/token.service";
import { EmailService } from "./services/email.service";
import { JwtService } from "./services/jwt.service";
import { SignupInput, ResendVerificationInput } from "../../common/validation/schemas/auth.schemas";
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

    // Atomic Verification Update in Transaction
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

    // Anti-Enumeration: If user doesn't exist or is already verified, return generic success message
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

    // Invalidate prior active verification tokens
    await this.userRepository.invalidateActiveEmailVerifications(user.id);

    // Generate new token pair
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

    // Queue email dispatch outside transaction
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

  // --- LOGIN ---
  async login(data: { email: string; passwordHash: string; ipAddress?: string; userAgent?: string }) {
    const normalizedEmail = data.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw ApiError.unauthorized("Incorrect email or password credentials.");
    }

    const passwordMatch = await this.passwordService.verify(data.passwordHash, user.passwordHash);
    if (!passwordMatch) {
      throw ApiError.unauthorized("Incorrect email or password credentials.");
    }

    const payload: TokenPayload = {
      userId: user.id,
      role: user.role,
      universityId: user.universityId
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.userRepository.createSession({
      refreshToken,
      userId: user.id,
      expiresAt,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent
    });

    await this.userRepository.createAuditLog({
      action: "USER_LOGIN",
      userId: user.id,
      ipAddress: data.ipAddress,
      details: { userAgent: data.userAgent }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        universityName: user.university?.name || null,
        isVerified: user.isVerified
      },
      accessToken,
      refreshToken
    };
  }

  // --- TOKEN ROTATION ---
  async refresh(refreshToken: string, ipAddress?: string, userAgent?: string) {
    let decoded: TokenPayload;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token. Please sign in again.");
    }

    const session = await this.userRepository.findSessionByToken(refreshToken);

    if (!session) {
      await this.userRepository.deleteSessionsByUserId(decoded.userId);
      throw ApiError.unauthorized("Compromised session token detected. Access revoked across all devices.");
    }

    if (new Date() > session.expiresAt) {
      await this.userRepository.deleteSession(refreshToken);
      throw ApiError.unauthorized("Session expired. Please log in again.");
    }

    await this.userRepository.deleteSession(refreshToken);

    const payload: TokenPayload = {
      userId: session.user.id,
      role: session.user.role,
      universityId: session.user.universityId
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.userRepository.createSession({
      refreshToken: newRefreshToken,
      userId: session.user.id,
      expiresAt,
      ipAddress: ipAddress || session.ipAddress || undefined,
      userAgent: userAgent || session.userAgent || undefined
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  // --- LOGOUT ---
  async logout(refreshToken: string) {
    try {
      const session = await this.userRepository.findSessionByToken(refreshToken);
      if (session) {
        await this.userRepository.deleteSession(refreshToken);
        await this.userRepository.createAuditLog({
          action: "USER_LOGOUT",
          userId: session.userId
        });
      }
    } catch {
      throw ApiError.internal("Error logging out session.");
    }
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
