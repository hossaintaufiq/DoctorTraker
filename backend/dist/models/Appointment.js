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
exports.Appointment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AppointmentSchema = new mongoose_1.Schema({
    appointmentCode: {
        type: String,
        unique: true,
        index: true,
    },
    patientId: {
        type: String,
        required: true,
        index: true,
    },
    patientName: {
        type: String,
        required: [true, "Patient name is required"],
        trim: true,
        index: true,
    },
    patientPhone: {
        type: String,
        default: "",
    },
    doctorId: {
        type: String,
        required: true,
        index: true,
    },
    doctorName: {
        type: String,
        required: [true, "Doctor name is required"],
        trim: true,
    },
    doctorSpecialty: {
        type: String,
        default: "General Medicine",
        index: true,
    },
    roomNumber: {
        type: String,
        default: "Room 304",
    },
    date: {
        type: String,
        required: [true, "Appointment date is required"],
        index: true,
    },
    timeSlot: {
        type: String,
        required: [true, "Time slot is required"],
    },
    type: {
        type: String,
        enum: ["General Checkup", "Follow-up", "Consultation", "Emergency", "Surgery Review"],
        default: "Consultation",
        index: true,
    },
    status: {
        type: String,
        enum: ["Confirmed", "In-Consultation", "Completed", "Cancelled", "Pending"],
        default: "Confirmed",
        index: true,
    },
    notes: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
// Auto-generate appointment code (#APT-9921)
AppointmentSchema.pre("save", function (next) {
    if (!this.appointmentCode) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        this.appointmentCode = `APT-${randomSuffix}`;
    }
    next();
});
// Compound indexes for fast filtered scheduling queries
AppointmentSchema.index({ date: 1, status: 1 });
AppointmentSchema.index({ doctorId: 1, date: 1 });
AppointmentSchema.index({ patientName: "text", appointmentCode: "text", doctorName: "text" });
exports.Appointment = mongoose_1.default.model("Appointment", AppointmentSchema);
