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
exports.Department = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DepartmentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Department name is required"],
        unique: true,
        trim: true,
        index: true,
    },
    code: {
        type: String,
        required: [true, "Department code is required"],
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    headName: {
        type: String,
        required: [true, "Head physician name is required"],
        trim: true,
    },
    specialistsCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    activeCasesCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalBeds: {
        type: Number,
        default: 30,
        min: 1,
    },
    occupiedBeds: {
        type: Number,
        default: 0,
        min: 0,
    },
    occupancyPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    floor: {
        type: String,
        required: [true, "Floor is required"],
        trim: true,
        index: true,
    },
    emergencyReady: {
        type: Boolean,
        default: false,
        index: true,
    },
    topServices: {
        type: [String],
        default: [],
    },
    equipmentSummary: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        default: 4.8,
        min: 1,
        max: 5,
    },
    colorTheme: {
        type: String,
        default: "blue",
    },
}, {
    timestamps: true,
});
// Compound text index for search
DepartmentSchema.index({ name: "text", code: "text", headName: "text", equipmentSummary: "text" });
exports.Department = mongoose_1.default.model("Department", DepartmentSchema);
