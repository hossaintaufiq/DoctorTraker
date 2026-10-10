"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = require("../models/User.js");
async function protect(req, res, next) {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Not authorized. Please log in to access this healthcare resource.",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "super_secret_doctor_tracker_jwt_key_2026");
        const user = await User_js_1.User.findById(decoded.id).select("-password");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "User session expired or user no longer exists.",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid authentication token. Authorization denied.",
        });
    }
}
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Role (${req.user?.role || "Guest"}) is unauthorized to perform this administrative action.`,
            });
            return;
        }
        next();
    };
}
