import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserRepository } from "../../repositories/user.repository";
import { signAccessToken, signRefreshToken, verifyRefreshToken, TokenPayload } from "../../utils/jwt";
import { ApiError } from "../../utils/api-error";
import { Role } from "../../types/role";

// Cryptographic token helper to prevent plaintext exposure in Database
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  // --- UNIVERSITY & ADMIN REGISTRATION (TENANCY SEPARATION) ---
  async registerUniversity(data: { name: string; domain: string; adminEmail: string; adminPassword?: string }) {
    const existingName = await this.userRepository.findUniversityByName(data.name);
    if (existingName) {
      throw ApiError.conflict("A university with this name is already registered.");
    }

    const existingDomain = await this.userRepository.findUniversityByDomain(data.domain);
    if (existingDomain) {
      throw ApiError.conflict("A university with this domain is already registered.");
    }

    const existingUser = await this.userRepository.findByEmail(data.adminEmail);
    if (existingUser) {
      throw ApiError.conflict("An account with this email address already exists.");
    }

    const university = await this.userRepository.createUniversity({
      name: data.name,
      domain: data.domain
    });

    const passwordHash = await bcrypt.hash(data.adminPassword || "DefaultAdmin123!", 12);
    const adminUser = await this.userRepository.create({
      email: data.adminEmail,
      passwordHash,
      role: "UNIVERSITY_ADMIN",
      universityId: university.id
    });

    // Create & hash verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.userRepository.createEmailVerification({
      userId: adminUser.id,
      token: hashedToken,
      expiresAt
    });

    console.log(`[MAILER] Verification link for ${data.adminEmail}: http://localhost:5000/api/v1/auth/verify-email?token=${rawToken}`);

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
    const university = await this.userRepository.findUniversityById(data.universityId);
    if (!university) {
      throw ApiError.notFound("Target university tenant not found.");
    }

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict("A user with this email address already exists.");
    }

    const passwordHash = await bcrypt.hash(data.passwordHash, 12);
    const user = await this.userRepository.create({
      email: data.email,
      passwordHash,
      role: data.role,
      universityId: data.universityId
    });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.userRepository.createEmailVerification({
      userId: user.id,
      token: hashedToken,
      expiresAt
    });

    console.log(`[MAILER] Verification link for ${data.email}: http://localhost:5000/api/v1/auth/verify-email?token=${rawToken}`);

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
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw ApiError.unauthorized("Incorrect email or password credentials.");
    }

    const passwordMatch = await bcrypt.compare(data.passwordHash, user.passwordHash);
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
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      console.log(`[SECURITY] Forgot password requested for non-existent email: ${email}`);
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.userRepository.createPasswordReset({
      userId: user.id,
      token: hashedToken,
      expiresAt
    });

    console.log(`[MAILER] Password reset link for ${email}: http://localhost:5000/api/v1/auth/reset-password?token=${rawToken}`);

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

    const passwordHash = await bcrypt.hash(newPasswordHash, 12);
    await this.userRepository.update(resetRecord.userId, { passwordHash });
    await this.userRepository.markPasswordResetUsed(hashedToken);

    await this.userRepository.deleteSessionsByUserId(resetRecord.userId);

    await this.userRepository.createAuditLog({
      action: "USER_PASSWORD_RESET_SUCCESS",
      userId: resetRecord.userId
    });
  }

  // --- EMAIL VERIFICATION ---
  async verifyEmail(token: string) {
    const hashedToken = hashToken(token);
    const verificationRecord = await this.userRepository.findEmailVerificationByToken(hashedToken);
    if (!verificationRecord) {
      throw ApiError.unauthorized("Invalid email verification token.");
    }

    if (verificationRecord.usedAt) {
      throw ApiError.badRequest("This verification token has already been used.");
    }

    if (new Date() > verificationRecord.expiresAt) {
      throw ApiError.badRequest("This verification token has expired.");
    }

    await this.userRepository.update(verificationRecord.userId, { isVerified: true });
    await this.userRepository.markEmailVerificationUsed(hashedToken);

    await this.userRepository.createAuditLog({
      action: "USER_EMAIL_VERIFIED_SUCCESS",
      userId: verificationRecord.userId
    });
  }

  // --- CHANGE PASSWORD ---
  async changePassword(userId: string, data: { oldPasswordHash: string; newPasswordHash: string }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User account not found.");
    }

    const passwordMatch = await bcrypt.compare(data.oldPasswordHash, user.passwordHash);
    if (!passwordMatch) {
      throw ApiError.unauthorized("Invalid original password credentials.");
    }

    const passwordHash = await bcrypt.hash(data.newPasswordHash, 12);
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
    return sessions.map(s => ({
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
    return keys.map((k) => ({
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
      apiKey: rawKey, // Expose raw key only ONCE at creation
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
