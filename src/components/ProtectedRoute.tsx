import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const authUserStr = localStorage.getItem("auth_user");
  const authUser = authUserStr ? JSON.parse(authUserStr) : null;
  const activeRole = authUser?.role || localStorage.getItem("userRole") || null;
  const isAuthenticated = !!authUser || !!activeRole;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && activeRole && !allowedRoles.includes(activeRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
