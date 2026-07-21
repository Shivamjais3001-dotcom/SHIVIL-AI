import jwt, { SignOptions } from "jsonwebtoken";
import { AUTH_CONSTANTS } from "../constants/auth.constants";
import { env } from "../../../config/env.config";
import { AppError } from "../../../common/errors/AppError";

export interface JwtAccessTokenPayload {
  userId: string;
  role: string;
  universityId?: string | null;
  sessionId?: string;
}

export interface JwtRefreshTokenPayload {
  userId: string;
  sessionId?: string;
  tokenFamilyId?: string;
}

export class JwtService {
  /**
   * Generates a signed Access Token (short-lived).
   */
  public generateAccessToken(payload: JwtAccessTokenPayload): string {
    const options: SignOptions = {
      expiresIn: AUTH_CONSTANTS.JWT.ACCESS_TOKEN_EXPIRY as any,
      algorithm: AUTH_CONSTANTS.JWT.ALGORITHM,
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
  }

  /**
   * Generates a signed Refresh Token (long-lived).
   */
  public generateRefreshToken(payload: JwtRefreshTokenPayload): string {
    const options: SignOptions = {
      expiresIn: AUTH_CONSTANTS.JWT.REFRESH_TOKEN_EXPIRY as any,
      algorithm: AUTH_CONSTANTS.JWT.ALGORITHM,
    };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
  }

  /**
   * Verifies an Access Token claims and signature.
   */
  public verifyAccessToken(token: string): JwtAccessTokenPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtAccessTokenPayload;
    } catch {
      throw new AppError("Access token expired or invalid claims. Access denied.", 401);
    }
  }

  /**
   * Verifies a Refresh Token claims and signature.
   */
  public verifyRefreshToken(token: string): JwtRefreshTokenPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtRefreshTokenPayload;
    } catch {
      throw new AppError("Refresh token validation failed. Please sign in again.", 401);
    }
  }

  /**
   * Decodes a token without verifying signature (useful for inspection).
   */
  public decode<T = any>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }
}
