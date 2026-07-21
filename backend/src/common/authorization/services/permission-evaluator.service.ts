import prisma from "../../../config/database";

export class PermissionEvaluatorService {
  private static permissionCache: Map<string, Set<string>> = new Map();
  private static cacheTtlMs: number = 60 * 1000; // 1 minute TTL in-memory
  private static lastCacheReset: number = Date.now();

  /**
   * Evaluates and fetches all permissions associated with a user's role code.
   */
  public async getUserPermissions(roleCode: string): Promise<Set<string>> {
    // Evict cache if TTL expired
    if (Date.now() - PermissionEvaluatorService.lastCacheReset > PermissionEvaluatorService.cacheTtlMs) {
      PermissionEvaluatorService.permissionCache.clear();
      PermissionEvaluatorService.lastCacheReset = Date.now();
    }

    if (PermissionEvaluatorService.permissionCache.has(roleCode)) {
      return PermissionEvaluatorService.permissionCache.get(roleCode)!;
    }

    // SUPER_ADMIN has global wildcard access
    if (roleCode === "SUPER_ADMIN") {
      const wildcardSet = new Set(["*"]);
      PermissionEvaluatorService.permissionCache.set(roleCode, wildcardSet);
      return wildcardSet;
    }

    try {
      const roleEntity = await prisma.roleEntity.findUnique({
        where: { code: roleCode },
        include: {
          permissions: {
            include: { permission: true }
          }
        }
      });

      const permissionSet = new Set<string>();

      if (roleEntity?.permissions) {
        for (const rp of roleEntity.permissions) {
          if (rp.permission?.name) {
            permissionSet.add(rp.permission.name);
          }
        }
      }

      PermissionEvaluatorService.permissionCache.set(roleCode, permissionSet);
      return permissionSet;
    } catch {
      return new Set();
    }
  }

  /**
   * Checks if a permission set satisfies a required permission.
   */
  public hasPermission(userPermissions: Set<string>, requiredPermission: string): boolean {
    if (userPermissions.has("*")) return true; // Global wildcard grant
    if (userPermissions.has(requiredPermission)) return true;

    // Namespace wildcard matching e.g. "users.*" satisfies "users.read"
    const parts = requiredPermission.split(".");
    if (parts.length > 1) {
      const namespace = parts[0];
      if (userPermissions.has(`${namespace}.*`)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Invalidates the permission cache for dynamic role-permission updates.
   */
  public static clearCache(): void {
    PermissionEvaluatorService.permissionCache.clear();
    PermissionEvaluatorService.lastCacheReset = Date.now();
  }
}
