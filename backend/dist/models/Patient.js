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
exports.Patient = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PatientSchema = new mongoose_1.Schema({
    patientCode: {
        type: String,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, "Patient name is required"],
        trim: true,
        index: true,
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: 0,
        max: 130,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    assignedDoctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctor",
        required: [true, "Assigned doctor reference is required"],
        index: true,
    },
    assignedDoctorName: {
        type: String,
        default: "",
    },
    condition: {
        type: String,
        enum: ["General", "Chronic", "Recovering", "Follow-up", "Critical"],
        default: "General",
        index: true,
    },
    status: {
        type: String,
        enum: ["Admitted", "Outpatient", "Discharged"],
        default: "Outpatient",
        index: true,
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        default: "O+",
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    notes: {
        type: String,
        default: "",
    },
    lastVisit: {
        type: Date,
        default: Date.now,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
        index: true,
    },
    vitals: {
        bloodPressure: { type: String, default: "120/80" },
        heartRate: { type: Number, default: 72 },
        temperature: { type: Number, default: 98.6 },
        spO2: { type: Number, default: 99 },
    },
}, {
    timestamps: true,
});
// Auto-generate patient code if not supplied (#PT-1042)
PatientSchema.pre("save", function (next) {
    if (!this.patientCode) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        this.patientCode = `PT-${randomSuffix}`;
    }
    next();
});
// Text indexing for query searches
PatientSchema.index({ name: "text", patientCode: "text", phone: "text", email: "text" });
exports.Patient = mongoose_1.default.model("Patient", PatientSchema);
