"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_js_1 = require("../controllers/analyticsController.js");
const router = (0, express_1.Router)();
router.get("/dashboard", analyticsController_js_1.getDashboardAnalytics);
exports.default = router;
