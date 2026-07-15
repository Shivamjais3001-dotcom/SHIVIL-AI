import { Response, NextFunction, Request } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { CustomError } from "../utils/custom-error";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Access credentials missing from headers.", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new CustomError("Malformed authorization token.", 401);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(error);
  }
}
