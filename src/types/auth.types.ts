export type RoleType = "SUPER_ADMIN" | "UNIVERSITY_ADMIN" | "HOD" | "FACULTY" | "STUDENT" | "ACCOUNTANT" | "LIBRARIAN" | "EXAM_CONTROLLER" | "PLACEMENT_OFFICER" | "HOSTEL_ADMIN" | "PARENT";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: RoleType | string;
  displayRole?: string;
  universityId: string | null;
  universityName?: string | null;
  isVerified?: boolean;
  status?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  passwordHash?: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  role: RoleType | string;
  universityId?: string;
  name?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

export interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
  errors?: any;
}

export type AuthStatus = "idle" | "authenticating" | "authenticated" | "unauthenticated";
