import { apiClient } from "../api/client";
import type {
  LoginCredentials,
  SignupCredentials,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponseData,
  User,
  ApiResponseEnvelope,
} from "../types/auth.types";

export class AuthService {
  /**
   * Dispatches login request to production authentication endpoint.
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponseEnvelope<AuthResponseData>>("/v1/auth/login", {
      email: credentials.email,
      password: credentials.password || credentials.passwordHash,
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message || "Invalid email or password credentials.");
    }

    return response.data.data;
  }

  /**
   * Terminate active user session.
   */
  public async logout(): Promise<void> {
    try {
      await apiClient.post("/v1/auth/logout", {});
    } catch {
      // Graceful fallback for network interruptions
    }
  }

  /**
   * Executes silent refresh token rotation.
   */
  public async refreshToken(): Promise<{ accessToken: string }> {
    const response = await apiClient.post<ApiResponseEnvelope<{ accessToken: string }>>("/v1/auth/refresh", {});
    if (!response.data?.success || !response.data?.data?.accessToken) {
      throw new Error("Refresh token rotation failed.");
    }
    return response.data.data;
  }

  /**
   * Verifies current session context.
   */
  public async verifySession(): Promise<User> {
    const response = await apiClient.get<ApiResponseEnvelope<{ user: User }>>("/v1/auth/sessions");
    if (!response.data?.success || !response.data?.data?.user) {
      throw new Error("Session verification failed.");
    }
    return response.data.data.user;
  }

  /**
   * Dispatches user registration payload.
   */
  public async signup(credentials: SignupCredentials): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponseEnvelope<AuthResponseData>>("/v1/auth/signup", credentials);
    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message || "Registration failed.");
    }
    return response.data.data;
  }

  /**
   * Dispatches password recovery link request.
   */
  public async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponseEnvelope<null>>("/v1/auth/forgot-password", payload);
    return { message: response.data?.message || "Password reset link requested." };
  }

  /**
   * Submits password reset with one-time token.
   */
  public async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponseEnvelope<null>>("/v1/auth/reset-password", payload);
    return { message: response.data?.message || "Password updated successfully." };
  }

  /**
   * Verifies email address via token link.
   */
  public async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponseEnvelope<null>>(`/v1/auth/verify-email?token=${encodeURIComponent(token)}`, { token });
    return { message: response.data?.message || "Email address verified successfully." };
  }
}

export const authService = new AuthService();
