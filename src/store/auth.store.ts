import { create } from "zustand";
import type { User, LoginCredentials, AuthStatus, SignupCredentials } from "../types/auth.types";
import { authService } from "../services/auth.service";
import { setAccessToken as syncClientToken, getAccessToken } from "../api/client";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;

  // State Mutators & Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

/**
 * Helper to normalize backend role codes into user-friendly UI role strings
 */
function normalizeDisplayRole(role?: string): string {
  if (!role) return "User";
  if (role === "SUPER_ADMIN" || role === "UNIVERSITY_ADMIN") return "Admin";
  if (role === "FACULTY" || role === "HOD") return "Faculty";
  if (role === "STUDENT") return "Student";
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

/**
 * Helper to derive user display name dynamically from email or backend profile
 */
function deriveDisplayName(user: Partial<User>): string {
  if (user.name && user.name.trim().length > 0) {
    return user.name;
  }
  if (user.email) {
    const username = user.email.split("@")[0];
    return username
      .split(/[\._\-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  return "Academic User";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const cached = localStorage.getItem("auth_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  })(),
  accessToken: getAccessToken(),
  status: localStorage.getItem("auth_user") ? "authenticated" : "idle",
  isLoading: true,
  error: null,

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("userRole", user.displayRole || normalizeDisplayRole(user.role));
      localStorage.setItem("adminName", deriveDisplayName(user));
    } else {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("adminName");
    }
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
    syncClientToken(token);
  },

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ isLoading: true, status: "authenticating", error: null });
    try {
      const data = await authService.login(credentials);
      
      const displayRole = normalizeDisplayRole(data.user.role);
      const displayName = deriveDisplayName(data.user);

      const normalizedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: displayName,
        role: data.user.role,
        displayRole,
        universityId: data.user.universityId,
        universityName: data.user.universityName,
        isVerified: data.user.isVerified,
        status: data.user.status,
      };

      get().setAccessToken(data.accessToken);
      get().setUser(normalizedUser);
      set({ status: "authenticated", isLoading: false });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Invalid credentials.";
      set({
        error: errorMsg,
        status: "unauthenticated",
        isLoading: false,
      });
      return false;
    }
  },

  signup: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await authService.signup(credentials);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Registration failed.";
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch {
      // Fallback local cleanup
    } finally {
      get().setAccessToken(null);
      get().setUser(null);
      set({ status: "unauthenticated", isLoading: false, error: null });
    }
  },

  refreshSession: async () => {
    try {
      const { accessToken } = await authService.refreshToken();
      get().setAccessToken(accessToken);
      set({ status: "authenticated" });
      return true;
    } catch {
      get().setAccessToken(null);
      get().setUser(null);
      set({ status: "unauthenticated" });
      return false;
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    const existingToken = getAccessToken();
    const cachedUser = get().user;

    if (!existingToken && !cachedUser) {
      set({ status: "unauthenticated", isLoading: false });
      return;
    }

    if (existingToken) {
      set({ status: "authenticated", isLoading: false });
      return;
    }

    // If cached user exists without memory token, attempt silent refresh rotation
    const refreshed = await get().refreshSession();
    if (!refreshed && cachedUser) {
      // Reset stale session
      get().setUser(null);
      get().setAccessToken(null);
    }
    set({ isLoading: false });
  },
}));
