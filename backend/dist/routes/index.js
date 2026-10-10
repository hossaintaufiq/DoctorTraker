"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_js_1 = __importDefault(require("./authRoutes.js"));
const doctorRoutes_js_1 = __importDefault(require("./doctorRoutes.js"));
const patientRoutes_js_1 = __importDefault(require("./patientRoutes.js"));
const analyticsRoutes_js_1 = __importDefault(require("./analyticsRoutes.js"));
const router = (0, express_1.Router)();
router.use("/auth", authRoutes_js_1.default);
router.use("/doctors", doctorRoutes_js_1.default);
router.use("/patients", patientRoutes_js_1.default);
router.use("/analytics", analyticsRoutes_js_1.default);
// Health check endpoint
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "Doctor Tracker Medical API Server",
        version: "1.0.0",
    });
});
exports.default = router;
