import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  timestamp: string;
  category: "Clinical" | "Billing" | "Staff" | "Security" | "Patient";
  user: string;
  action: string;
  ipAddress: string;
  status: "Success" | "Warning" | "Error" | "Info";
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Fast time-series indexing
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ category: 1, createdAt: -1 });
ActivityLogSchema.index({ action: "text", user: "text", details: "text" });

export const ActivityLog = mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
