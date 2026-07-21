import { PrismaClient, Prisma, Role as PrismaRole, LoginStatus } from "@prisma/client";
import prismaDefault from "../config/database";
import { Role } from "../types/role";

export class UserRepository {
  private getDb(tx?: PrismaClient | Prisma.TransactionClient): any {
    return tx || prismaDefault;
  }

  // --- USER METHODS ---
  async findByEmail(email: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.user.findUnique({
      where: { email, deletedAt: null },
      include: { university: true }
    });
  }

  async findById(id: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.user.findUnique({
      where: { id, deletedAt: null },
      include: { university: true }
    });
  }

  async create(
    data: { email: string; passwordHash: string; role: Role | PrismaRole; universityId?: string },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role as PrismaRole,
        universityId: data.universityId
      }
    });
  }

  async update(
    id: string,
    data: { passwordHash?: string; isVerified?: boolean; status?: any },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.user.update({
      where: { id },
      data
    });
  }

  async assignRole(
    data: { userId: string; roleCode: string },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    const roleEntity = await db.roleEntity.findUnique({
      where: { code: data.roleCode }
    });

    if (roleEntity) {
      await db.userRole.upsert({
        where: {
          userId_roleId: { userId: data.userId, roleId: roleEntity.id }
        },
        update: {},
        create: {
          userId: data.userId,
          roleId: roleEntity.id
        }
      });
    }
  }

  // --- UNIVERSITY (TENANT) METHODS ---
  async findUniversityById(id: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.university.findUnique({
      where: { id, deletedAt: null }
    });
  }

  async findUniversityByName(name: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.university.findUnique({
      where: { name, deletedAt: null }
    });
  }

  async findUniversityByDomain(domain: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.university.findUnique({
      where: { domain, deletedAt: null }
    });
  }

  async createUniversity(
    data: { name: string; domain: string },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.university.create({
      data
    });
  }

  // --- SESSION & REFRESH TOKEN METHODS ---
  async createSession(
    data: {
      refreshToken: string;
      userId: string;
      expiresAt: Date;
      ipAddress?: string;
      userAgent?: string;
    },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.session.create({
      data: {
        refreshToken: data.refreshToken,
        userId: data.userId,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }
    });
  }

  async findSessionByToken(refreshToken: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.session.findUnique({
      where: { refreshToken },
      include: { user: { include: { university: true } } }
    });
  }

  async deleteSession(refreshToken: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.session.delete({
      where: { refreshToken }
    });
  }

  async deleteSessionsByUserId(userId: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.session.deleteMany({
      where: { userId }
    });
  }

  async findSessionById(id: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.session.findUnique({
      where: { id }
    });
  }

  async deleteSessionById(id: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.session.delete({
      where: { id }
    });
  }

  async findSessionsByUserId(userId: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  // --- API KEY METHODS ---
  async findApiKeyById(id: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.apiKey.findUnique({
      where: { id }
    });
  }

  async deleteApiKey(id: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.apiKey.delete({
      where: { id }
    });
  }

  async findApiKeysByUserId(userId: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  // --- VERIFICATIONS & RESETS METHODS ---
  async createPasswordReset(
    data: { userId: string; token: string; expiresAt: Date },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.passwordReset.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt
      }
    });
  }

  async findPasswordResetByToken(token: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.passwordReset.findUnique({
      where: { token }
    });
  }

  async markPasswordResetUsed(token: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.passwordReset.update({
      where: { token },
      data: { usedAt: new Date(), status: "USED" }
    });
  }

  async invalidateActivePasswordResets(userId: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.passwordReset.updateMany({
      where: { userId, status: "ACTIVE" },
      data: { status: "REVOKED" }
    });
  }

  async createEmailVerification(
    data: { userId: string; token: string; expiresAt: Date },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.emailVerification.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt
      }
    });
  }

  async findEmailVerificationByToken(token: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.emailVerification.findUnique({
      where: { token }
    });
  }

  async markEmailVerificationUsed(token: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.emailVerification.update({
      where: { token },
      data: { usedAt: new Date(), status: "USED" }
    });
  }

  async invalidateActiveEmailVerifications(userId: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.emailVerification.updateMany({
      where: { userId, status: "ACTIVE" },
      data: { status: "REVOKED" }
    });
  }

  // --- BRUTE FORCE PROTECTION & LOGIN ATTEMPTS ---
  async recordLoginAttempt(
    data: {
      userId?: string;
      email: string;
      ipAddress?: string;
      userAgent?: string;
      status: LoginStatus;
      failureReason?: string;
    },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.loginAttempt.create({
      data: {
        userId: data.userId || null,
        email: data.email,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        status: data.status,
        failureReason: data.failureReason
      }
    });
  }

  async countRecentFailedLoginAttempts(email: string, windowMinutes: number = 15, tx?: PrismaClient | Prisma.TransactionClient): Promise<number> {
    const db = this.getDb(tx);
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    return db.loginAttempt.count({
      where: {
        email,
        status: { not: LoginStatus.SUCCESS },
        createdAt: { gte: windowStart }
      }
    });
  }

  async findApiKey(key: string, tx?: PrismaClient | Prisma.TransactionClient) {
    const db = this.getDb(tx);
    return db.apiKey.findUnique({
      where: { key },
      include: { user: { include: { university: true } } }
    });
  }

  async createApiKey(
    data: { name: string; key: string; userId: string; expiresAt?: Date },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.apiKey.create({
      data
    });
  }

  // --- AUDIT LOGS ---
  async createAuditLog(
    data: { action: string; userId?: string; ipAddress?: string; details?: any },
    tx?: PrismaClient | Prisma.TransactionClient
  ) {
    const db = this.getDb(tx);
    return db.auditLog.create({
      data: {
        action: data.action,
        userId: data.userId || null,
        ipAddress: data.ipAddress,
        details: data.details
      }
    });
  }
}
