import { Request, Response, NextFunction } from "express";
import { ActivityLog } from "../models/ActivityLog.js";

// @desc    Get audit activity logs with category, status, and search filters
// @route   GET /api/logs
export async function getActivityLogs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, category, status, limit = 100 } = req.query;

    const query: Record<string, any> = {};

    if (search && typeof search === "string" && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { action: searchRegex },
        { user: searchRegex },
        { details: searchRegex },
        { ipAddress: searchRegex },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    const limitNum = Math.min(200, Math.max(1, parseInt(limit as string) || 100));

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Create activity log record
// @route   POST /api/logs
export async function createActivityLog(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const log = await ActivityLog.create(req.body);
    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Clear activity logs
// @route   DELETE /api/logs
export async function clearActivityLogs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await ActivityLog.deleteMany({});
    res.status(200).json({
      success: true,
      message: "Activity logs cleared successfully.",
    });
  } catch (error) {
    next(error);
  }
}
