import { Response, NextFunction, Request } from "express";
import crypto from "crypto";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/api-error";
import { UserRepository } from "../repositories/user.repository";
import prisma from "../config/database";

const userRepository = new UserRepository();

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
    universityId?: string | null;
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Support API Key authentication (for future AI and third-party workflow compatibility)
    const apiKey = req.headers["x-api-key"];
    if (apiKey && typeof apiKey === "string") {
      const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");
      const keyRecord = await userRepository.findApiKey(hashedKey);
      if (!keyRecord) {
        throw ApiError.unauthorized("Invalid API key credentials.");
      }

      if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
        throw ApiError.unauthorized("API key has expired.");
      }

      req.user = {
        userId: keyRecord.userId,
        role: keyRecord.user.role,
        universityId: keyRecord.user.universityId
      };

      // Asynchronously log last used timestamp
      prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() }
      }).catch(err => console.error("Error updating API key timestamp:", err));

      return next();
    }

    // 2. Support standard JWT Access Token (Authorization Header or Cookies)
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      throw ApiError.unauthorized("Access credentials missing from headers or cookies.");
    }

    const decoded = verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      universityId: decoded.universityId || null
    };
    return next();
  } catch (error) {
    return next(error);
  }
}

// Backward compatibility alias
export const authMiddleware = authenticate;
