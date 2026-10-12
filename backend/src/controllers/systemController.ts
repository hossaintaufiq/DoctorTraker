import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { seedDatabase } from "../utils/seeder.js";
import { env } from "../config/env.js";
import { ActivityLog } from "../models/ActivityLog.js";

/**
 * @desc    Wipe all collections and reseed with fresh baseline data
 * @route   POST /api/system/reset-database
 * @access  Protected (Admin only, non-production with ALLOW_DB_RESET=true)
 */
export async function resetDatabase(req: AuthRequest, res: Response): Promise<void> {
  try {
    // 1. Role verification safeguard
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Forbidden. Administrative privileges required to reset database.",
      });
      return;
    }

    // 2. Reject in production environment
    if (env.NODE_ENV === "production") {
      res.status(403).json({
        success: false,
        message: "Database reset is strictly prohibited in production environment.",
      });
      return;
    }

    // 3. Reject unless ALLOW_DB_RESET is explicitly set to true
    if (!env.ALLOW_DB_RESET) {
      res.status(403).json({
        success: false,
        message: "Database reset is disabled. Set ALLOW_DB_RESET=true in environment to enable.",
      });
      return;
    }

    // 4. Require explicit confirmation body field
    const { confirm } = req.body || {};
    if (confirm !== "CONFIRM_RESET_DATABASE") {
      res.status(400).json({
        success: false,
        message:
          "Missing or invalid confirmation. Request body must include { confirm: 'CONFIRM_RESET_DATABASE' }.",
      });
      return;
    }

    console.log(
      `[System Control] Initiating full database wipe and reseed requested by admin: ${req.user.email}`
    );

    // Pass acting admin to ensure acting admin account persists
    const result = await seedDatabase({
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });

    // Write ActivityLog entry recording the reset
    await ActivityLog.create({
      category: "Security",
      user: req.user.email,
      action: "Database Reset Performed",
      ipAddress: req.ip || "127.0.0.1",
      status: "Success",
      details: "Full database wipe and reseed executed with acting admin preservation.",
    });

    res.status(200).json({
      success: true,
      message: "Database has been completely wiped and reseeded with pristine records.",
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[System Control Error] Reset failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset database: " + (error as Error).message,
    });
  }
}
