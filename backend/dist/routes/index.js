"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_js_1 = __importDefault(require("./authRoutes.js"));
const doctorRoutes_js_1 = __importDefault(require("./doctorRoutes.js"));
const patientRoutes_js_1 = __importDefault(require("./patientRoutes.js"));
const departmentRoutes_js_1 = __importDefault(require("./departmentRoutes.js"));
const appointmentRoutes_js_1 = __importDefault(require("./appointmentRoutes.js"));
const invoiceRoutes_js_1 = __importDefault(require("./invoiceRoutes.js"));
const activityLogRoutes_js_1 = __importDefault(require("./activityLogRoutes.js"));
const analyticsRoutes_js_1 = __importDefault(require("./analyticsRoutes.js"));
const systemRoutes_js_1 = __importDefault(require("./systemRoutes.js"));
const router = (0, express_1.Router)();
router.use("/auth", authRoutes_js_1.default);
router.use("/doctors", doctorRoutes_js_1.default);
router.use("/patients", patientRoutes_js_1.default);
router.use("/departments", departmentRoutes_js_1.default);
router.use("/appointments", appointmentRoutes_js_1.default);
router.use("/invoices", invoiceRoutes_js_1.default);
router.use("/logs", activityLogRoutes_js_1.default);
router.use("/analytics", analyticsRoutes_js_1.default);
router.use("/system", systemRoutes_js_1.default);
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
exports.default = router;
