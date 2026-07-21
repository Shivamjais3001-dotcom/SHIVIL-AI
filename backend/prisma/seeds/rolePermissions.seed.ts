import { PrismaClient, Role } from "@prisma/client";
import { SeedResult } from "./roles.seed";

export const ROLE_PERMISSION_MAPPINGS: Record<string, string[] | "ALL"> = {
  [Role.SUPER_ADMIN]: "ALL",
  [Role.UNIVERSITY_ADMIN]: [
    "users:create", "users:read", "users:update", "users:delete", "users:role:assign",
    "students:create", "students:read", "students:update", "students:delete",
    "faculty:create", "faculty:read", "faculty:update", "faculty:delete",
    "courses:create", "courses:read", "courses:update", "courses:delete",
    "attendance:mark", "attendance:read", "attendance:update",
    "exams:create", "exams:marks:submit", "exams:marks:approve",
    "analytics:view", "ai:query", "ai:insights:generate",
    "settings:read", "settings:update",
    "notifications:send", "notifications:read"
  ],
  [Role.FACULTY]: [
    "courses:read", "courses:update",
    "students:read",
    "attendance:mark", "attendance:read",
    "exams:create", "exams:marks:submit",
    "ai:query", "notifications:read"
  ],
  [Role.STUDENT]: [
    "courses:read",
    "attendance:read",
    "ai:query",
    "notifications:read"
  ]
};

export async function seedRolePermissions(prisma: PrismaClient): Promise<SeedResult> {
  const result: SeedResult = { category: "Role-Permissions Mappings", created: 0, skipped: 0, failed: 0 };

  const allRoles = await prisma.roleEntity.findMany();
  const allPermissions = await prisma.permission.findMany();

  const roleMap = new Map(allRoles.map(r => [r.code, r.id]));
  const permMap = new Map(allPermissions.map(p => [p.code, p.id]));

  for (const [roleCode, permCodes] of Object.entries(ROLE_PERMISSION_MAPPINGS)) {
    const roleId = roleMap.get(roleCode);
    if (!roleId) continue;

    const targetPermIds: string[] = permCodes === "ALL"
      ? allPermissions.map(p => p.id)
      : permCodes.map(code => permMap.get(code)).filter((id): id is string => Boolean(id));

    for (const permissionId of targetPermIds) {
      try {
        const existing = await prisma.rolePermission.findUnique({
          where: {
            roleId_permissionId: { roleId, permissionId }
          }
        });

        if (existing) {
          result.skipped++;
        } else {
          await prisma.rolePermission.create({
            data: { roleId, permissionId }
          });
          result.created++;
        }
      } catch (error) {
        console.error(`[SEED ERROR] Failed mapping role ${roleCode} to permission ${permissionId}:`, error);
        result.failed++;
      }
    }
  }

  return result;
}
