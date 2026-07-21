import crypto from "crypto";
import { AUTH_CONSTANTS } from "../constants/auth.constants";

export interface GeneratedTokenPair {
  rawToken: string;
  hashedToken: string;
}

export class TokenService {
  /**
   * Generates a cryptographically secure random token and its SHA-256 hash.
   */
  public generateRandomToken(byteLength: number = AUTH_CONSTANTS.TOKEN_LENGTHS.RANDOM_BYTES): GeneratedTokenPair {
    const rawToken = crypto.randomBytes(byteLength).toString("hex");
    const hashedToken = this.hashToken(rawToken);
    return { rawToken, hashedToken };
  }

  /**
   * Hashes a raw token string using SHA-256.
   */
  public hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Constant-time comparison between raw token and stored hash.
   */
  public compareTokens(rawToken: string, storedHash: string): boolean {
    const computedHash = this.hashToken(rawToken);
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, "utf-8"),
      Buffer.from(storedHash, "utf-8")
    );
  }

  /**
   * Calculates a future expiration date based on hours offset.
   */
  public calculateExpiry(hours: number): Date {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
  }

  /**
   * Checks if a target date has expired.
   */
  public isExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}
