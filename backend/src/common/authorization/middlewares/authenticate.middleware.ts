import { Response, NextFunction } from "express";
import crypto from "crypto";
import { AuthenticatedRequest, RequestAuthContext } from "../types/auth-context.type";
import { verifyAccessToken } from "../../../utils/jwt";
import { ApiError } from "../../../utils/api-error";
import { UserRepository } from "../../../repositories/user.repository";
import { PermissionEvaluatorService } from "../services/permission-evaluator.service";
import prisma from "../../../config/database";

const userRepository = new UserRepository();
const permissionEvaluator = new PermissionEvaluatorService();

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const requestId = (req as any).id || (req.headers["x-request-id"] as string) || crypto.randomUUID();

    // 1. API Key Authentication (AI Services & Background Workers)
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

      const permissions = await permissionEvaluator.getUserPermissions(keyRecord.user.role);

      req.authContext = {
        user: {
          id: keyRecord.userId,
          email: keyRecord.user.email,
          role: keyRecord.user.role,
          roles: [keyRecord.user.role],
          universityId: keyRecord.user.universityId,
          status: keyRecord.user.status || "ACTIVE",
          isVerified: keyRecord.user.isVerified,
        },
        permissions,
        requestId,
        universityId: keyRecord.user.universityId,
      };

      req.user = {
        userId: keyRecord.userId,
        role: keyRecord.user.role,
        universityId: keyRecord.user.universityId,
      };

      prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() },
      }).catch(err => console.error("Error updating API key last used timestamp:", err));

      return next();
    }

    // 2. JWT Access Token Authentication (Bearer Header or HTTP Cookie)
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.shivil_access_token || req.cookies?.accessToken;
    
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

    // Fetch user permissions for AuthContext
    const permissions = await permissionEvaluator.getUserPermissions(decoded.role);

    const authContext: RequestAuthContext = {
      user: {
        id: decoded.userId,
        email: (decoded as any).email || "",
        role: decoded.role,
        roles: [decoded.role],
        universityId: decoded.universityId || null,
        status: "ACTIVE",
        isVerified: true,
      },
      permissions,
      sessionId: (decoded as any).sessionId,
      requestId,
      universityId: decoded.universityId || null,
    };

    req.authContext = authContext;
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      universityId: decoded.universityId || null,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
