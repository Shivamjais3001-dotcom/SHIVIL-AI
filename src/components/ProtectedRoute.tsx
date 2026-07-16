import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const activeRole = localStorage.getItem("userRole");
  const isAuthenticated = !!localStorage.getItem("auth_user") || activeRole === "Admin" || activeRole === "Faculty" || activeRole === "Student";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && activeRole && !allowedRoles.includes(activeRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
