import jwt from "jsonwebtoken";
import { CustomError } from "./custom-error";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_key_fallback";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_key_fallback";

interface TokenPayload {
  userId: string;
  role: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  } catch (error) {
    throw new CustomError("Access token expired or invalid claims. Access denied.", 401);
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    throw new CustomError("Refresh token validation failed. Please sign in again.", 401);
  }
}
