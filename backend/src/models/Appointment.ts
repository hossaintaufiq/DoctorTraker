import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  appointmentCode: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  roomNumber: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  type: "General Checkup" | "Follow-up" | "Consultation" | "Emergency" | "Surgery Review";
  status: "Confirmed" | "In-Consultation" | "Completed" | "Cancelled" | "Pending";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentCode: {
      type: String,
      unique: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    patientPhone: {
      type: String,
      default: "",
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    doctorSpecialty: {
      type: String,
      default: "General Medicine",
    },
    roomNumber: {
      type: String,
      default: "Room 304",
    },
    date: {
      type: String,
      required: [true, "Appointment date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
    },
    type: {
      type: String,
      enum: ["General Checkup", "Follow-up", "Consultation", "Emergency", "Surgery Review"],
      default: "Consultation",
    },
    status: {
      type: String,
      enum: ["Confirmed", "In-Consultation", "Completed", "Cancelled", "Pending"],
      default: "Confirmed",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate appointment code (#APT-9921)
AppointmentSchema.pre("save", function (next) {
  if (!this.appointmentCode) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.appointmentCode = `APT-${randomSuffix}`;
  }
  next();
});

// Compound indexes for fast filtered scheduling queries
AppointmentSchema.index({ doctorId: 1, date: -1 });
AppointmentSchema.index({ status: 1, date: -1 });
AppointmentSchema.index({ date: -1 });
AppointmentSchema.index({ patientName: "text", appointmentCode: "text", doctorName: "text" });

export const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);
