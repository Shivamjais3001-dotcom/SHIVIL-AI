import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { CustomError } from "../utils/custom-error";
import { Role } from "../types/role";

const userRepository = new UserRepository();

export class AuthService {
  async register(email: string, password: string, role: Role) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError("A user with this email address already exists.", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({
      email,
      passwordHash,
      role
    });

    await userRepository.createAuditLog({
      action: "USER_REGISTER",
      userId: user.id,
      details: { role }
    });

    return {
      userId: user.id,
      email: user.email,
      role: user.role
    };
  }

  async login(data: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new CustomError("Incorrect email or password credentials.", 401);
    }

    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatch) {
      throw new CustomError("Incorrect email or password credentials.", 401);
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Save refresh session in PostgreSQL database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    await userRepository.createSession({
      refreshToken,
      userId: user.id,
      expiresAt,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent
    });

    await userRepository.createAuditLog({
      action: "USER_LOGIN",
      userId: user.id,
      ipAddress: data.ipAddress
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken: string, ipAddress?: string) {
    const session = await userRepository.findSessionByToken(refreshToken);
    if (!session) {
      throw new CustomError("Active session not found. Please log in again.", 401);
    }

    if (new Date() > session.expiresAt) {
      await userRepository.deleteSession(refreshToken);
      throw new CustomError("Session has expired. Please log in again.", 401);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const payload = { userId: decoded.userId, role: decoded.role };
    const accessToken = signAccessToken(payload);

    return { accessToken };
  }

  async logout(refreshToken: string) {
    try {
      const session = await userRepository.findSessionByToken(refreshToken);
      if (session) {
        await userRepository.deleteSession(refreshToken);
        await userRepository.createAuditLog({
          action: "USER_LOGOUT",
          userId: session.userId
        });
      }
    } catch (err) {
      throw new CustomError("Error logging out session.", 500);
    }
  }
}
