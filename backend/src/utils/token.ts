import crypto from "crypto";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { IUser } from "../models/User.js";

export interface TokenPayload {
  id: string;
  role: string;
  email: string;
}

export function generateAccessToken(user: IUser): string {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    }
  );
}

export function generateRefreshToken(user: IUser): string {
  return jwt.sign(
    {
      id: user._id.toString(),
      type: "refresh",
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    }
  );
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): { id: string; type: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; type: string };
}

export function setRefreshTokenCookie(res: Response, token: string): void {
  // MaxAge in milliseconds (7 days)
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge,
    path: "/api/auth",
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/api/auth",
  });
}
