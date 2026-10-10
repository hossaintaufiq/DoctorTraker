import { Router } from "express";
import authRoutes from "./authRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import patientRoutes from "./patientRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/doctors", doctorRoutes);
router.use("/patients", patientRoutes);
router.use("/analytics", analyticsRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Doctor Tracker Medical API Server",
    version: "1.0.0",
  });
});

export default router;
