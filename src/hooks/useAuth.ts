import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { authService } from "../services/auth.service";

export function useAuth() {
  const {
    user,
    status,
    isLoading,
    error,
    login: storeLogin,
    signup: storeSignup,
    logout: storeLogout,
    refreshSession,
    initializeAuth,
  } = useAuthStore();

  useEffect(() => {
    // Run initialization bootstrap once on hook mount
    initializeAuth();

    // Listen to global logout broadcast events from API client interceptor
    const handleLogoutBroadcast = () => {
      storeLogout();
    };

    window.addEventListener("auth-logout", handleLogoutBroadcast);
    return () => window.removeEventListener("auth-logout", handleLogoutBroadcast);
  }, [initializeAuth, storeLogout]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    return storeLogin({ email, password });
  };

  const signup = async (email: string, password: string, role: string, universityId?: string, name?: string): Promise<boolean> => {
    return storeSignup({ email, password, role, universityId, name });
  };

  const logout = async (): Promise<void> => {
    await storeLogout();
    window.location.href = "/login";
  };

  const refresh = async (): Promise<boolean> => {
    return refreshSession();
  };

  const forgotPassword = async (email: string): Promise<{ message: string }> => {
    return authService.forgotPassword({ email });
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
    return authService.resetPassword({ token, newPassword });
  };

  return {
    user,
    status,
    isLoading,
    isAuthenticated: status === "authenticated" || !!user,
    error,
    login,
    signup,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
  };
}

export default useAuth;
