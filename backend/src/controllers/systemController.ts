import { Request, Response } from "express";
import { seedDatabase } from "../utils/seeder.js";

/**
 * @desc    Wipe all collections and reseed with fresh baseline data
 * @route   POST /api/system/reset-database
 * @access  Public (for administrative reset operations)
 */
export async function resetDatabase(req: Request, res: Response) {
  try {
    console.log("[System Control] Initiating full database wipe and reseed requested by client...");
    const result = await seedDatabase();

    return res.status(200).json({
      success: true,
      message: "Database has been completely wiped and reseeded with pristine fresh records.",
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[System Control Error] Reset failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset database: " + (error as Error).message,
    });
  }
}
