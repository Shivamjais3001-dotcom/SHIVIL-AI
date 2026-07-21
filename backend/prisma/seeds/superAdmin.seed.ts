import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SeedResult } from "./roles.seed";

export async function seedSuperAdmin(prisma: PrismaClient): Promise<SeedResult> {
  const result: SeedResult = { category: "Default Super Admin", created: 0, skipped: 0, failed: 0 };

  const email = process.env.SUPER_ADMIN_EMAIL || "superadmin@shivil.ai";
  const rawPassword = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@SHIVIL2026!";

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      result.skipped++;
    } else {
      const passwordHash = await bcrypt.hash(rawPassword, 12);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: Role.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          isVerified: true
        }
      });

      // Find system SUPER_ADMIN role entity
      const superAdminRoleEntity = await prisma.roleEntity.findUnique({
        where: { code: Role.SUPER_ADMIN }
      });

      if (superAdminRoleEntity) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId: { userId: user.id, roleId: superAdminRoleEntity.id }
          },
          update: {},
          create: {
            userId: user.id,
            roleId: superAdminRoleEntity.id
          }
        });
      }

      result.created++;
    }
  } catch (error) {
    console.error(`[SEED ERROR] Failed to seed Super Admin account (${email}):`, error);
    result.failed++;
  }

  return result;
}
