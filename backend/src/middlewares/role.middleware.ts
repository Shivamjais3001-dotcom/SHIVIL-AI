import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { CustomError } from "../utils/custom-error";

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new CustomError("Session context missing. Authorization failed.", 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new CustomError("Access forbidden. Insufficient security clearance level.", 403);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
