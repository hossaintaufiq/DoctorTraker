"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const systemController_js_1 = require("../controllers/systemController.js");
const router = (0, express_1.Router)();
router.post("/reset-database", systemController_js_1.resetDatabase);
exports.default = router;
