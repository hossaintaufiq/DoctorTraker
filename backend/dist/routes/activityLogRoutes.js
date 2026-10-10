"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activityLogController_js_1 = require("../controllers/activityLogController.js");
const router = (0, express_1.Router)();
router.route("/")
    .get(activityLogController_js_1.getActivityLogs)
    .post(activityLogController_js_1.createActivityLog)
    .delete(activityLogController_js_1.clearActivityLogs);
exports.default = router;
