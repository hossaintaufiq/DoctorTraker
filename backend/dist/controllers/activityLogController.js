"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogs = getActivityLogs;
exports.createActivityLog = createActivityLog;
exports.clearActivityLogs = clearActivityLogs;
const ActivityLog_js_1 = require("../models/ActivityLog.js");
// @desc    Get audit activity logs with category, status, and search filters
// @route   GET /api/logs
async function getActivityLogs(req, res, next) {
    try {
        const { search, category, status, limit = 100 } = req.query;
        const query = {};
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
        const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 100));
        const logs = await ActivityLog_js_1.ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .lean();
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Create activity log record
// @route   POST /api/logs
async function createActivityLog(req, res, next) {
    try {
        const log = await ActivityLog_js_1.ActivityLog.create(req.body);
        res.status(201).json({
            success: true,
            data: log,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Clear activity logs
// @route   DELETE /api/logs
async function clearActivityLogs(req, res, next) {
    try {
        await ActivityLog_js_1.ActivityLog.deleteMany({});
        res.status(200).json({
            success: true,
            message: "Activity logs cleared successfully.",
        });
    }
    catch (error) {
        next(error);
    }
}
