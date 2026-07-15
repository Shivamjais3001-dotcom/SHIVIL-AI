import prisma from "../config/database";
import { Role } from "../types/role";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email, deletedAt: null }
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id, deletedAt: null }
    });
  }

  async create(data: { email: string; passwordHash: string; role: Role }) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role
      }
    });
  }

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
      include: { user: true }
    });
  }

  async deleteSession(refreshToken: string) {
    return prisma.session.delete({
      where: { refreshToken }
    });
  }

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
