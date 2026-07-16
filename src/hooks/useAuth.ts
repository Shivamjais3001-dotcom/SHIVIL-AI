import { useState, useEffect } from "react";
import { apiClient, setAccessToken, getAccessToken } from "../api/client";

interface UserPayload {
  id: string;
  email: string;
  role: string;
  universityId: string;
  universityName: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserPayload | null>(() => {
    const cached = localStorage.getItem("auth_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and check current session
  useEffect(() => {
    const verifySession = async () => {
      const activeToken = getAccessToken();
      if (!activeToken) {
        setIsLoading(false);
        return;
      }
      try {
        // Fetch session status or run a token check
        const response = await apiClient.get("/dashboard/metrics"); // Test endpoint
        if (!response.data?.success) {
          throw new Error("Invalid session");
        }
      } catch (err) {
        // Clear auth state on fail
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("auth_user");
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();

    // Listen to global logout broadcast events from interceptor
    const handleLogoutBroadcast = () => {
      setUser(null);
      localStorage.removeItem("auth_user");
    };
    window.addEventListener("auth-logout", handleLogoutBroadcast);
    return () => window.removeEventListener("auth-logout", handleLogoutBroadcast);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      if (response.data?.success) {
        const payload = response.data.data;
        setAccessToken(payload.accessToken);
        
        // Map backend roles (e.g. UNIVERSITY_ADMIN -> Admin)
        let normalizedRole = "Admin";
        if (payload.user.role === "FACULTY") normalizedRole = "Faculty";
        if (payload.user.role === "STUDENT") normalizedRole = "Student";

        const userObj: UserPayload = {
          id: payload.user.id,
          email: payload.user.email,
          role: normalizedRole,
          universityId: payload.user.universityId,
          universityName: payload.user.universityName
        };

        setUser(userObj);
        localStorage.setItem("auth_user", JSON.stringify(userObj));
        localStorage.setItem("userRole", normalizedRole);
        localStorage.setItem("adminName", normalizedRole === "Admin" ? "Shivam Jaiswal" : normalizedRole === "Faculty" ? "Dr. Sarah Jenkins" : "Arjun Sharma");
        
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login request failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/logout", {});
    } catch (err) {
      console.warn("Logout request failed (using local cleanup fallback).");
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("adminName");
      setIsLoading(false);
      window.location.href = "/login";
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}
