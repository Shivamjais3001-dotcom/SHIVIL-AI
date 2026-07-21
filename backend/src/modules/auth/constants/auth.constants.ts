export const AUTH_CONSTANTS = {
  JWT: {
    ACCESS_TOKEN_EXPIRY: "15m" as const,
    REFRESH_TOKEN_EXPIRY: "7d" as const,
    ACCESS_TOKEN_MAX_AGE_MS: 15 * 60 * 1000, // 15 minutes
    REFRESH_TOKEN_MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
    ALGORITHM: "HS256" as const,
  },

  COOKIES: {
    ACCESS_TOKEN_NAME: "shivil_access_token",
    REFRESH_TOKEN_NAME: "shivil_refresh_token",
    SAME_SITE: (process.env.NODE_ENV === "production" ? "strict" : "lax") as "strict" | "lax" | "none",
    SECURE: process.env.NODE_ENV === "production",
    HTTP_ONLY: true,
  },

  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    BCRYPT_SALT_ROUNDS: 12,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHAR: true,
  },

  TOKEN_EXPIRIES: {
    EMAIL_VERIFICATION_HOURS: 24,
    PASSWORD_RESET_HOURS: 1,
    MAGIC_LINK_MINUTES: 15,
  },

  TOKEN_LENGTHS: {
    RANDOM_BYTES: 32, // Generates 64-character hex string
  },
};
