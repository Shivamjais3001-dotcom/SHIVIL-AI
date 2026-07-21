import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-context.type";
import { ApiError } from "../../../utils/api-error";

export interface OwnershipOptions {
  paramKey?: string;
  allowAdminOverride?: boolean;
}

/**
   * Enterprise Resource Ownership Authorization Middleware (ABAC Foundation)
   * Ensures users can only access their own resources (e.g. /students/:id) unless they hold elevated admin credentials.
   */
export function requireOwnership(options: OwnershipOptions = { paramKey: "id", allowAdminOverride: true }) {
  const paramKey = options.paramKey || "id";
  const allowAdminOverride = options.allowAdminOverride !== false;

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.authContext?.user;
      if (!user) {
        throw ApiError.unauthorized("Authentication required. Session context missing.");
      }

      // Admin Override Hook
      if (allowAdminOverride && (user.role === "SUPER_ADMIN" || user.role === "UNIVERSITY_ADMIN")) {
        if (req.authContext) {
          req.authContext.ownership = { isOwner: true };
        }
        return next();
      }

      const resourceUserId = req.params[paramKey] || req.body[paramKey] || req.query[paramKey];

      if (!resourceUserId) {
        return next();
      }

      const isOwner = user.id === resourceUserId;

      if (!isOwner) {
        throw ApiError.forbidden("Access forbidden. You do not possess ownership rights to access or modify this resource.");
      }

      if (req.authContext) {
        req.authContext.ownership = { resourceUserId, isOwner: true };
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
