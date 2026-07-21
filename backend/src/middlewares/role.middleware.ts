import { requireRole } from "../common/authorization/middlewares/require-role.middleware";
import { requirePermission } from "../common/authorization/middlewares/require-permission.middleware";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../common/authorization/types/auth-context.type";
import { ApiError } from "../utils/api-error";

export { requireRole as authorize, requireRole as authorizeRoles, requirePermission };

export function requireUniversityMatch() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.authContext?.user || req.user;
      if (!user) {
        throw ApiError.unauthorized("Session context missing. Authorization failed.");
      }

      if (user.role === "SUPER_ADMIN") {
        return next();
      }

      const targetUniversityId =
        req.params.universityId ||
        req.query.universityId ||
        req.body?.universityId ||
        req.headers["x-university-id"];

      if (!targetUniversityId) {
        if (user.universityId) {
          if (req.method === "GET") {
            req.query.universityId = user.universityId;
          } else if (req.body && typeof req.body === "object") {
            req.body.universityId = user.universityId;
          }
        }
        return next();
      }

      if (user.universityId && user.universityId !== targetUniversityId) {
        throw ApiError.forbidden("Access forbidden. Operations are isolated within your own university tenant.");
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
