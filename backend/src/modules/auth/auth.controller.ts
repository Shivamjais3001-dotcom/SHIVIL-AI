import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { sendSuccessResponse } from "../../utils/response";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/api-error";

import { CookieService } from "./services/cookie.service";

const authService = new AuthService();
const cookieService = new CookieService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = req.ip || (req.headers["x-forwarded-for"] as string) || undefined;
      const userAgent = req.headers["user-agent"] || undefined;
      const requestId = (req as any).id || (req.headers["x-request-id"] as string) || undefined;

      const result = await authService.signup(req.body, {
        ipAddress,
        userAgent,
        requestId,
      });

      return sendSuccessResponse(res, result.user, result.message, 201);
    } catch (error) {
      next(error);
    }
  }

  async registerUniversity(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, domain, adminEmail, adminPassword } = req.body;
      const result = await authService.registerUniversity({
        name,
        domain,
        adminEmail,
        adminPassword
      });

      return sendSuccessResponse(
        res,
        result,
        "University tenant and administrator account initialized successfully.",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async registerAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role, universityId } = req.body;
      const result = await authService.registerAdmin({
        email,
        passwordHash: password,
        role,
        universityId
      });

      return sendSuccessResponse(
        res,
        result,
        "User account created successfully within the university tenant.",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = req.ip || (req.headers["x-forwarded-for"] as string) || undefined;
      const userAgent = req.headers["user-agent"] || undefined;
      const requestId = (req as any).id || (req.headers["x-request-id"] as string) || undefined;

      const result = await authService.login(req.body, {
        ipAddress,
        userAgent,
        requestId,
      });

      // Set Access & Refresh cookies
      cookieService.setAuthCookies(res, result.accessToken, result.refreshToken);

      return sendSuccessResponse(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        "User session authenticated successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.shivil_refresh_token || req.cookies?.refreshToken || req.body.refreshToken;
      const ipAddress = req.ip || (req.headers["x-forwarded-for"] as string) || undefined;
      const userAgent = req.headers["user-agent"] || undefined;
      const requestId = (req as any).id || (req.headers["x-request-id"] as string) || undefined;

      const result = await authService.refresh(refreshToken, {
        ipAddress,
        userAgent,
        requestId,
      });

      // Set rotated cookies
      cookieService.setAuthCookies(res, result.accessToken, result.refreshToken);

      return sendSuccessResponse(
        res,
        {
          accessToken: result.accessToken,
        },
        "Access token rotated successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.shivil_refresh_token || req.cookies?.refreshToken || req.body.refreshToken;
      const ipAddress = req.ip || (req.headers["x-forwarded-for"] as string) || undefined;
      const requestId = (req as any).id || (req.headers["x-request-id"] as string) || undefined;

      if (refreshToken) {
        await authService.logout(refreshToken, { ipAddress, requestId });
      }

      cookieService.clearAuthCookies(res);

      return sendSuccessResponse(res, null, "User logged out and session revoked successfully.");
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);

      // Generic response for email privacy
      return sendSuccessResponse(
        res,
        null,
        "If the email address exists in our system, a password reset link has been dispatched."
      );
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);

      return sendSuccessResponse(res, null, "Password has been successfully updated.");
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = (req.body.token || req.query.token) as string;
      const ipAddress = req.ip || (req.headers["x-forwarded-for"] as string) || undefined;
      const requestId = (req as any).id || (req.headers["x-request-id"] as string) || undefined;

      const result = await authService.verifyEmail(token, { ipAddress, requestId });
      return sendSuccessResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = req.ip || (req.headers["x-forwarded-for"] as string) || undefined;
      const requestId = (req as any).id || (req.headers["x-request-id"] as string) || undefined;

      const result = await authService.resendVerification(req.body, { ipAddress, requestId });
      return sendSuccessResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Session context missing.",
          data: null,
          meta: null,
          errors: { message: "Unauthorized access" }
        });
      }

      await authService.changePassword(userId, {
        oldPasswordHash: oldPassword,
        newPasswordHash: newPassword
      });

      return sendSuccessResponse(res, null, "Password has been updated. Please sign in again.");
    } catch (error) {
      next(error);
    }
  }

  async getActiveSessions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw ApiError.unauthorized();

      const result = await authService.getSessions(userId);
      return sendSuccessResponse(res, result, "Active login sessions retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async revokeSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { sessionId } = req.params;
      if (!userId) throw ApiError.unauthorized();

      await authService.revokeSession(userId, sessionId);
      return sendSuccessResponse(res, null, "Target device session has been successfully revoked.");
    } catch (error) {
      next(error);
    }
  }

  async revokeAllDevices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw ApiError.unauthorized();

      await authService.revokeAllSessions(userId);
      return sendSuccessResponse(res, null, "All active sessions have been successfully terminated.");
    } catch (error) {
      next(error);
    }
  }

  async getApiKeys(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw ApiError.unauthorized();

      const result = await authService.getApiKeys(userId);
      return sendSuccessResponse(res, result, "API keys retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async createApiKey(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { name } = req.body;
      if (!userId) throw ApiError.unauthorized();
      if (!name) throw ApiError.badRequest("API key name is required");

      const result = await authService.createApiKey(userId, name);
      return sendSuccessResponse(res, result, "API key generated successfully. Save it securely as it will not be displayed again.", 201);
    } catch (error) {
      next(error);
    }
  }

  async revokeApiKey(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { keyId } = req.params;
      if (!userId) throw ApiError.unauthorized();

      await authService.revokeApiKey(userId, keyId);
      return sendSuccessResponse(res, null, "API key has been successfully revoked.");
    } catch (error) {
      next(error);
    }
  }
}
