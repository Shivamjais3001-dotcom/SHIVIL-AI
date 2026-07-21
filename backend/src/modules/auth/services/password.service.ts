import bcrypt from "bcryptjs";
import { AUTH_CONSTANTS } from "../constants/auth.constants";

export interface PasswordPolicyValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PasswordService {
  /**
   * Hashes a raw password using Bcrypt with configured salt rounds.
   */
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, AUTH_CONSTANTS.PASSWORD_POLICY.BCRYPT_SALT_ROUNDS);
  }

  /**
   * Verifies a raw password against a stored bcrypt hash.
   */
  public async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Validates a password against security policy rules.
   */
  public validatePolicy(password: string): PasswordPolicyValidationResult {
    const errors: string[] = [];
    const policy = AUTH_CONSTANTS.PASSWORD_POLICY;

    if (password.length < policy.MIN_LENGTH) {
      errors.push(`Password must be at least ${policy.MIN_LENGTH} characters long.`);
    }

    if (password.length > policy.MAX_LENGTH) {
      errors.push(`Password cannot exceed ${policy.MAX_LENGTH} characters.`);
    }

    if (policy.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }

    if (policy.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }

    if (policy.REQUIRE_NUMBERS && !/[0-9]/.test(password)) {
      errors.push("Password must contain at least one numeric digit.");
    }

    if (policy.REQUIRE_SPECIAL_CHAR && !/[^a-zA-Z0-9]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Architecture hook for future password hash re-hashing or algorithm upgrades.
   */
  public needsRehash(hash: string): boolean {
    const rounds = bcrypt.getRounds(hash);
    return rounds < AUTH_CONSTANTS.PASSWORD_POLICY.BCRYPT_SALT_ROUNDS;
  }
}
