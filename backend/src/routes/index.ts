import { Router } from "express";
import authRoutes from "./authRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import patientRoutes from "./patientRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import activityLogRoutes from "./activityLogRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import systemRoutes from "./systemRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/doctors", doctorRoutes);
router.use("/patients", patientRoutes);
router.use("/departments", departmentRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/logs", activityLogRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/system", systemRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Doctor Tracker Medical API Server",
    database: "MongoDB Atlas Cloud",
    version: "2.4.0",
  });
});

export default router;
