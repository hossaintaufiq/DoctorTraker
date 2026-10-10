"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ActivityLogSchema = new mongoose_1.Schema({
    timestamp: {
        type: String,
        default: () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    category: {
        type: String,
        enum: ["Clinical", "Billing", "Staff", "Security", "Patient"],
        required: true,
        index: true,
    },
    user: {
        type: String,
        required: true,
        index: true,
    },
    action: {
        type: String,
        required: true,
        index: true,
    },
    ipAddress: {
        type: String,
        default: "192.168.1.1",
    },
    status: {
        type: String,
        enum: ["Success", "Warning", "Error", "Info"],
        default: "Success",
        index: true,
    },
    details: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
// Fast time-series indexing
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ category: 1, createdAt: -1 });
ActivityLogSchema.index({ action: "text", user: "text", details: "text" });
exports.ActivityLog = mongoose_1.default.model("ActivityLog", ActivityLogSchema);
