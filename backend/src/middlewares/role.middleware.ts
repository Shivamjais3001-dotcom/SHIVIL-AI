import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { ApiError } from "../utils/api-error";
import { Role } from "../types/role";
import { ROLE_PERMISSIONS, Permission } from "../constants/permissions";

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized("Session context missing. Authorization failed.");
      }

      if (!allowedRoles.includes(req.user.role as Role)) {
        throw ApiError.forbidden("Access forbidden. Insufficient security clearance level.");
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

// Backward compatibility alias
export const authorizeRoles = authorize;

export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized("Session context missing. Authorization failed.");
      }

      const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
      if (!userPermissions.includes(permission)) {
        throw ApiError.forbidden(`Access forbidden. Missing required security permission: ${permission}`);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireUniversityMatch() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized("Session context missing. Authorization failed.");
      }

      // SUPER_ADMIN has global privileges and can access any tenant resources
      if (req.user.role === "SUPER_ADMIN") {
        return next();
      }

      const targetUniversityId =
        req.params.universityId ||
        req.query.universityId ||
        req.body?.universityId ||
        req.headers["x-university-id"];

      if (!targetUniversityId) {
        // Automatically inject user's tenant ID into query or body if omitted
        if (req.user.universityId) {
          if (req.method === "GET") {
            req.query.universityId = req.user.universityId;
          } else if (req.body && typeof req.body === "object") {
            req.body.universityId = req.user.universityId;
          }
        }
        return next();
      }

      if (req.user.universityId && req.user.universityId !== targetUniversityId) {
        throw ApiError.forbidden("Access forbidden. Operations are isolated within your own university tenant.");
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
