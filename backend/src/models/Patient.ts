import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPatient extends Document {
  patientCode: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  assignedDoctor: Types.ObjectId;
  assignedDoctorName: string;
  condition: "General" | "Chronic" | "Recovering" | "Follow-up" | "Critical";
  status: "Admitted" | "Outpatient" | "Discharged";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  phone: string;
  email: string;
  notes?: string;
  lastVisit: Date;
  registrationDate: Date;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    spO2?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    patientCode: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
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
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Assigned doctor reference is required"],
    },
    assignedDoctorName: {
      type: String,
      default: "",
    },
    condition: {
      type: String,
      enum: ["General", "Chronic", "Recovering", "Follow-up", "Critical"],
      default: "General",
    },
    status: {
      type: String,
      enum: ["Admitted", "Outpatient", "Discharged"],
      default: "Outpatient",
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
    },
    vitals: {
      bloodPressure: { type: String, default: "120/80" },
      heartRate: { type: Number, default: 72 },
      temperature: { type: Number, default: 98.6 },
      spO2: { type: Number, default: 99 },
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate patient code if not supplied (#PT-1042)
PatientSchema.pre("save", function (next) {
  if (!this.patientCode) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.patientCode = `PT-${randomSuffix}`;
  }
  next();
});

// Strategic compound indexes matching query filter, doctor assignments, and dates
PatientSchema.index({ assignedDoctor: 1, createdAt: -1 });
PatientSchema.index({ condition: 1, status: 1, registrationDate: -1 });
PatientSchema.index({ status: 1, registrationDate: -1 });
PatientSchema.index({ registrationDate: -1 });
PatientSchema.index({ name: "text", patientCode: "text", phone: "text", email: "text" });

export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);
