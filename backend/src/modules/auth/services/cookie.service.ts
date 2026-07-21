import { Response, CookieOptions } from "express";
import { AUTH_CONSTANTS } from "../constants/auth.constants";

export class CookieService {
  /**
   * Constructs security CookieOptions based on environment configuration.
   */
  public getCookieOptions(maxAgeMs: number): CookieOptions {
    return {
      httpOnly: AUTH_CONSTANTS.COOKIES.HTTP_ONLY,
      secure: AUTH_CONSTANTS.COOKIES.SECURE,
      sameSite: AUTH_CONSTANTS.COOKIES.SAME_SITE,
      maxAge: maxAgeMs,
      path: "/",
    };
  }

  /**
   * Sets Access Token and Refresh Token HTTP-Only cookies on Express response.
   */
  public setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const accessCookieOptions = this.getCookieOptions(AUTH_CONSTANTS.JWT.ACCESS_TOKEN_MAX_AGE_MS);
    const refreshCookieOptions = this.getCookieOptions(AUTH_CONSTANTS.JWT.REFRESH_TOKEN_MAX_AGE_MS);

    res.cookie(AUTH_CONSTANTS.COOKIES.ACCESS_TOKEN_NAME, accessToken, accessCookieOptions);
    res.cookie(AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN_NAME, refreshToken, refreshCookieOptions);
  }

  /**
   * Clears authentication cookies from Express response upon logout.
   */
  public clearAuthCookies(res: Response): void {
    const clearOptions: CookieOptions = {
      httpOnly: AUTH_CONSTANTS.COOKIES.HTTP_ONLY,
      secure: AUTH_CONSTANTS.COOKIES.SECURE,
      sameSite: AUTH_CONSTANTS.COOKIES.SAME_SITE,
      path: "/",
    };

    res.clearCookie(AUTH_CONSTANTS.COOKIES.ACCESS_TOKEN_NAME, clearOptions);
    res.clearCookie(AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN_NAME, clearOptions);
  }
}
