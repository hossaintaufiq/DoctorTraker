import { z } from "zod";
import { paginationQuerySchema } from "./common.js";

export const appointmentQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["All", "Confirmed", "In-Consultation", "Completed", "Cancelled", "Pending"]).optional(),
  doctorId: z.string().optional(),
  date: z.string().optional(),
  sortBy: z.enum(["createdAt", "date", "status"]).optional().default("date"),
});

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, "patientId is required"),
  patientName: z.string().min(2, "patientName is required"),
  patientPhone: z.string().optional().default(""),
  doctorId: z.string().min(1, "doctorId is required"),
  doctorName: z.string().min(2, "doctorName is required"),
  doctorSpecialty: z.string().optional().default("General Medicine"),
  roomNumber: z.string().optional().default("Room 304"),
  date: z.string().min(8, "Appointment date is required (YYYY-MM-DD)"),
  timeSlot: z.string().min(1, "timeSlot is required"),
  type: z.enum(["General Checkup", "Follow-up", "Consultation", "Emergency", "Surgery Review"]).optional().default("Consultation"),
  status: z.enum(["Confirmed", "In-Consultation", "Completed", "Cancelled", "Pending"]).optional().default("Confirmed"),
  notes: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["Confirmed", "In-Consultation", "Completed", "Cancelled", "Pending"]),
});
