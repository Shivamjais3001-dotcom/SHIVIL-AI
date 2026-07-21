import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-context.type";
import { PermissionEvaluatorService } from "../services/permission-evaluator.service";
import { ApiError } from "../../../utils/api-error";
import prisma from "../../../config/database";

const permissionEvaluator = new PermissionEvaluatorService();

export function requirePermission(requiredPermissions: string | string[]) {
  const permissionsList = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userPermissions = req.authContext?.permissions;
      const userId = req.authContext?.user?.id || req.user?.userId;

      if (!userPermissions || !userId) {
        throw ApiError.unauthorized("Authentication required. Permission context missing.");
      }

      // Verify that user satisfies every required permission in the list
      const hasAllPermissions = permissionsList.every((permission) =>
        permissionEvaluator.hasPermission(userPermissions, permission)
      );

      if (!hasAllPermissions) {
        // Record security audit event
        prisma.auditLog.create({
          data: {
            action: "AUTHORIZATION_PERMISSION_DENIED",
            userId,
            ipAddress: req.ip || undefined,
            details: {
              requiredPermissions: permissionsList,
              path: req.originalUrl,
              method: req.method,
            }
          }
        }).catch(err => console.error("Error writing authorization audit log:", err));

        throw ApiError.forbidden(
          `Access forbidden. Missing required security permission(s): ${permissionsList.join(", ")}`
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
