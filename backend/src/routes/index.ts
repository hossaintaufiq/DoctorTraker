import { Router, Request, Response, NextFunction } from "express";
import authRoutes from "./authRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import patientRoutes from "./patientRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import activityLogRoutes from "./activityLogRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import systemRoutes from "./systemRoutes.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Middleware: For authenticated routes, set private, no-cache for GET requests while allowing ETags
const authenticatedCacheControl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "private, no-cache");
  }
  next();
};

// 1. Health check endpoint (Public)
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Doctor Tracker Medical API Server",
    database: "MongoDB Connected",
    version: "2.4.0",
  });
});

// 2. Auth routes (public login/refresh/logout + protected me/register)
router.use("/auth", authRoutes);

// 3. Protected Healthcare Application Routers
router.use("/doctors", protect, authenticatedCacheControl, doctorRoutes);
router.use("/patients", protect, authenticatedCacheControl, patientRoutes);
router.use("/departments", protect, authenticatedCacheControl, departmentRoutes);
router.use("/appointments", protect, authenticatedCacheControl, appointmentRoutes);
router.use("/invoices", protect, authenticatedCacheControl, invoiceRoutes);
router.use("/logs", protect, authenticatedCacheControl, activityLogRoutes);
router.use("/analytics", protect, authenticatedCacheControl, analyticsRoutes);
router.use("/system", protect, authenticatedCacheControl, systemRoutes);

export default router;
