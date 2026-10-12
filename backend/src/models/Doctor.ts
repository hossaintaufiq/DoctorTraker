import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  roomNumber: string;
  hospital: string;
  patientCount: number;
  maxPatients: number;
  experienceYears: number;
  status: "Active" | "In Surgery" | "On Leave" | "Off Duty";
  biography: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, "Specialty is required"],
      trim: true,
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
    },
    biography: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for populated patients list
DoctorSchema.virtual("patients", {
  ref: "Patient",
  localField: "_id",
  foreignField: "assignedDoctor",
});

// Strategic compound indexes matching query filter, search, and sort patterns
DoctorSchema.index({ status: 1, specialty: 1, createdAt: -1 });
DoctorSchema.index({ hospital: 1, status: 1 });
DoctorSchema.index({ createdAt: -1 });
DoctorSchema.index({ name: "text", specialty: "text", email: "text", hospital: "text" });

export const Doctor = mongoose.model<IDoctor>("Doctor", DoctorSchema);
