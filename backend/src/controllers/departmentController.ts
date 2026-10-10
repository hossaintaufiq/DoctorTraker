import { Request, Response, NextFunction } from "express";
import { Department } from "../models/Department.js";

// @desc    Get all departments with search, floor, and load filters
// @route   GET /api/departments
export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, floor, emergencyOnly, load } = req.query;

    const query: Record<string, any> = {};

    if (search && typeof search === "string" && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { code: searchRegex },
        { headName: searchRegex },
        { topServices: searchRegex },
      ];
    }

    if (floor && floor !== "All") {
      query.floor = new RegExp(floor as string, "i");
    }

    if (emergencyOnly === "true") {
      query.emergencyReady = true;
    }

    if (load === "High") {
      query.occupancyPercentage = { $gte: 80 };
    } else if (load === "Moderate") {
      query.occupancyPercentage = { $gte: 60, $lt: 80 };
    } else if (load === "Low") {
      query.occupancyPercentage = { $lt: 60 };
    }

    const departments = await Department.find(query).sort({ name: 1 }).lean();

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single department by code or ID
// @route   GET /api/departments/:id
export async function getDepartmentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const department = await Department.findById(req.params.id).lean();
    if (!department) {
      res.status(404).json({ success: false, message: "Department not found." });
      return;
    }
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
}

// @desc    Create department
// @route   POST /api/departments
export async function createDepartment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
}
