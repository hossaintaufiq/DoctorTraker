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
exports.Doctor = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DoctorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Doctor name is required"],
        trim: true,
        index: true,
    },
    specialty: {
        type: String,
        required: [true, "Specialty is required"],
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    roomNumber: {
        type: String,
        required: [true, "Room number is required"],
        trim: true,
    },
    hospital: {
        type: String,
        default: "Doctor Tracker Medical Center",
        trim: true,
    },
    patientCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    maxPatients: {
        type: Number,
        default: 300,
    },
    experienceYears: {
        type: Number,
        default: 5,
    },
    status: {
        type: String,
        enum: ["Active", "In Surgery", "On Leave", "Off Duty"],
        default: "Active",
        index: true,
    },
    biography: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual for populated patients list
DoctorSchema.virtual("patients", {
    ref: "Patient",
    localField: "_id",
    foreignField: "assignedDoctor",
});
// Compound text index for fast search
DoctorSchema.index({ name: "text", specialty: "text", email: "text", hospital: "text" });
exports.Doctor = mongoose_1.default.model("Doctor", DoctorSchema);
