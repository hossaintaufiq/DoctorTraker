import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  code: string;
  headName: string;
  specialistsCount: number;
  activeCasesCount: number;
  totalBeds: number;
  occupiedBeds: number;
  occupancyPercentage: number;
  floor: string;
  emergencyReady: boolean;
  topServices: string[];
  equipmentSummary: string;
  rating: number;
  colorTheme?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
DepartmentSchema.index({ name: "text", code: "text", headName: "text", equipmentSummary: "text" });

export const Department = mongoose.model<IDepartment>("Department", DepartmentSchema);
