import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  verifyRefreshToken,
} from "../utils/token.js";

// @desc    Register a new healthcare user (Admin-only)
// @route   POST /api/auth/register
// @access  Protected (Admin only)
export async function register(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
      return;
    }

    // Role can only be assigned by admin, otherwise defaults to staff
    const assignedRole =
      req.user?.role === "admin" && ["admin", "doctor", "staff"].includes(role)
        ? role
        : "staff";

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: assignedRole,
    });

    res.status(201).json({
      success: true,
      message: "Healthcare user account registered successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password +refreshTokenHash"
    );

    // Uniform timing / error message to prevent account enumeration
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid work email or password.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid work email or password.",
      });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Persist hashed refresh token for rotation
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: "Authenticated successfully to Doctor Tracker portal.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Refresh access token via httpOnly cookie or body token with token rotation
// @route   POST /api/auth/refresh
// @access  Public (via secure cookie or payload)
export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "No refresh token provided.",
      });
      return;
    }

    let decoded: { id: string; type: string };
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      clearRefreshTokenCookie(res);
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
      return;
    }

    const user = await User.findById(decoded.id).select("+refreshTokenHash");
    if (!user || !user.refreshTokenHash) {
      clearRefreshTokenCookie(res);
      res.status(401).json({
        success: false,
        message: "Session expired or user not found.",
      });
      return;
    }

    const incomingHash = hashToken(refreshToken);
    if (incomingHash !== user.refreshTokenHash) {
      // Possible token reuse / breach: invalidate session
      user.refreshTokenHash = undefined;
      await user.save();
      clearRefreshTokenCookie(res);
      res.status(401).json({
        success: false,
        message: "Invalid refresh token. Session invalidated.",
      });
      return;
    }

    // Token rotation: Issue new access and refresh token pair
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Log out user & invalidate refresh cookie
// @route   POST /api/auth/logout
// @access  Public
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id).select("+refreshTokenHash");
        if (user) {
          user.refreshTokenHash = undefined;
          await user.save();
        }
      } catch {
        // Ignore token decode errors on logout
      }
    }

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
}
