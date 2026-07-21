import { Request } from "express";

export interface UserContext {
  id: string;
  email: string;
  role: string;
  roles: string[];
  universityId: string | null;
  status: string;
  isVerified: boolean;
}

export interface ResourceOwnershipContext {
  resourceUserId?: string;
  resourceUniversityId?: string;
  isOwner?: boolean;
}

export interface RequestAuthContext {
  user: UserContext;
  permissions: Set<string>;
  sessionId?: string;
  requestId?: string;
  universityId?: string | null;
  ownership?: ResourceOwnershipContext;
}

export interface AuthenticatedRequest extends Request {
  authContext?: RequestAuthContext;
  user?: {
    userId: string;
    role: string;
    universityId?: string | null;
  };
}
