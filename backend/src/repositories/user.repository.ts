import prisma from "../config/database";
import { Role } from "../types/role";

export class UserRepository {
  // --- USER METHODS ---
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: { university: true }
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { university: true }
    });
  }

  async create(data: { email: string; passwordHash: string; role: Role; universityId?: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        universityId: data.universityId
      }
    });
  }

  async update(id: string, data: { passwordHash?: string; isVerified?: boolean }) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  // --- UNIVERSITY (TENANT) METHODS ---
  async findUniversityById(id: string) {
    return prisma.university.findUnique({
      where: { id, deletedAt: null }
    });
  }

  async findUniversityByName(name: string) {
    return prisma.university.findUnique({
      where: { name, deletedAt: null }
    });
  }

  async findUniversityByDomain(domain: string) {
    return prisma.university.findUnique({
      where: { domain, deletedAt: null }
    });
  }

  async createUniversity(data: { name: string; domain: string }) {
    return prisma.university.create({
      data
    });
  }

  // --- SESSION (JWT REFRESH TOKENS) METHODS ---
  async createSession(data: {
    refreshToken: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.session.create({
      data: {
        refreshToken: data.refreshToken,
        userId: data.userId,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }
    });
  }

  async findSessionByToken(refreshToken: string) {
    return prisma.session.findUnique({
      where: { refreshToken },
      include: { user: { include: { university: true } } }
    });
  }

  async deleteSession(refreshToken: string) {
    return prisma.session.delete({
      where: { refreshToken }
    });
  }

  async deleteSessionsByUserId(userId: string) {
    return prisma.session.deleteMany({
      where: { userId }
    });
  }

  async findSessionById(id: string) {
    return prisma.session.findUnique({
      where: { id }
    });
  }

  async deleteSessionById(id: string) {
    return prisma.session.delete({
      where: { id }
    });
  }

  async findSessionsByUserId(userId: string) {
    return prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  async findApiKeyById(id: string) {
    return prisma.apiKey.findUnique({
      where: { id }
    });
  }

  async deleteApiKey(id: string) {
    return prisma.apiKey.delete({
      where: { id }
    });
  }

  async findApiKeysByUserId(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  // --- VERIFICATIONS & RESETS METHODS ---
  async createPasswordReset(data: { userId: string; token: string; expiresAt: Date }) {
    return prisma.passwordReset.create({
      data
    });
  }

  async findPasswordResetByToken(token: string) {
    return prisma.passwordReset.findUnique({
      where: { token }
    });
  }

  async markPasswordResetUsed(token: string) {
    return prisma.passwordReset.update({
      where: { token },
      data: { usedAt: new Date() }
    });
  }

  async createEmailVerification(data: { userId: string; token: string; expiresAt: Date }) {
    return prisma.emailVerification.create({
      data
    });
  }

  async findEmailVerificationByToken(token: string) {
    return prisma.emailVerification.findUnique({
      where: { token }
    });
  }

  async markEmailVerificationUsed(token: string) {
    return prisma.emailVerification.update({
      where: { token },
      data: { usedAt: new Date() }
    });
  }

  // --- API KEY (FUTURE LLM / INTEGRATION) METHODS ---
  async findApiKey(key: string) {
    return prisma.apiKey.findUnique({
      where: { key },
      include: { user: { include: { university: true } } }
    });
  }

  async createApiKey(data: { name: string; key: string; userId: string; expiresAt?: Date }) {
    return prisma.apiKey.create({
      data
    });
  }

  // --- AUDIT LOGS ---
  async createAuditLog(data: { action: string; userId: string; ipAddress?: string; details?: any }) {
    return prisma.auditLog.create({
      data: {
        action: data.action,
        userId: data.userId,
        ipAddress: data.ipAddress,
        details: data.details
      }
    });
  }
}
