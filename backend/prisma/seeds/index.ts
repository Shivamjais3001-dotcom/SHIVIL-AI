import { PrismaClient } from "@prisma/client";
import { seedRoles, SeedResult } from "./roles.seed";
import { seedPermissions } from "./permissions.seed";
import { seedRolePermissions } from "./rolePermissions.seed";
import { seedSuperAdmin } from "./superAdmin.seed";

export * from "./roles.seed";
export * from "./permissions.seed";
export * from "./rolePermissions.seed";
export * from "./superAdmin.seed";

export async function runAllSeeds(prisma: PrismaClient): Promise<SeedResult[]> {
  const results: SeedResult[] = [];

  console.log("🌱 [SEEDER] Starting database seeding execution pipeline...\n");

  results.push(await seedRoles(prisma));
  results.push(await seedPermissions(prisma));
  results.push(await seedRolePermissions(prisma));
  results.push(await seedSuperAdmin(prisma));

  return results;
}
