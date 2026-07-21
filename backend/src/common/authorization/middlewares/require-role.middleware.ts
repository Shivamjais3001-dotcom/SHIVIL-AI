import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-context.type";
import { ApiError } from "../../../utils/api-error";
import { Role } from "../../../types/role";
import prisma from "../../../config/database";

export function requireRole(...allowedRoles: (Role | Role[])[]) {
  const rolesList: Role[] = allowedRoles.flat() as Role[];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.authContext?.user?.role || req.user?.role;
      const userId = req.authContext?.user?.id || req.user?.userId;

      if (!userRole || !userId) {
        throw ApiError.unauthorized("Authentication required. Session context missing.");
      }

      // Check if user's role matches allowed roles or is SUPER_ADMIN
      const isAllowed = rolesList.includes(userRole as Role) || userRole === "SUPER_ADMIN";

      if (!isAllowed) {
        prisma.auditLog.create({
          data: {
            action: "AUTHORIZATION_ROLE_DENIED",
            userId,
            ipAddress: req.ip || undefined,
            details: {
              userRole,
              requiredRoles: rolesList,
              path: req.originalUrl,
              method: req.method,
            }
          }
        }).catch(err => console.error("Error writing authorization audit log:", err));

        throw ApiError.forbidden(`Access forbidden. Requires one of the following roles: ${rolesList.join(", ")}`);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

// Re-export alias for backward compatibility
export const authorize = requireRole;
