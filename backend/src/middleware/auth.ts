import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/User.js";
import { verifyAccessToken } from "../utils/token.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized. Please log in to access this healthcare resource.",
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User session expired or user no longer exists.",
      });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token. Authorization denied.",
    });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role (${req.user?.role || "Guest"}) does not have permission to perform this action.`,
      });
      return;
    }
    next();
  };
}
