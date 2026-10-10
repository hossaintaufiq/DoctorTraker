import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

function generateToken(id: string): string {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "super_secret_doctor_tracker_jwt_key_2026",
    {
      expiresIn: "7d",
    }
  );
}

// @desc    Register a new administrator or medical user
// @route   POST /api/auth/register
// @access  Public
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "An account with this work email already exists.",
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "admin",
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: "Medical user account registered successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Authenticate user & get token
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
        message: "Please provide work email and password.",
      });
      return;
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials. Physician/Administrator not found.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials. Incorrect password.",
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Authenticated successfully to Doctor Tracker portal.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
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
    const user = req.user;
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
