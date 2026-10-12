import { z } from "zod";
import { paginationQuerySchema, objectIdSchema } from "./common.js";

const doctorSortFields = [
  "createdAt",
  "name",
  "specialty",
  "patientCount",
  "experienceYears",
  "status",
] as const;

export const doctorQuerySchema = paginationQuerySchema.extend({
  specialty: z.string().optional(),
  status: z.enum(["All", "Active", "In Surgery", "On Leave", "Off Duty"]).optional(),
  hospital: z.string().optional(),
  sortBy: z.enum(doctorSortFields).optional().default("createdAt"),
});

const baseDoctorSchema = z.object({
  name: z.string().min(2, "Doctor name must be at least 2 characters").trim(),
  specialty: z.string().min(2, "Specialty is required").trim().optional(),
  specialization: z.string().min(2).trim().optional(),
  email: z.string().email("Invalid email address format").trim().toLowerCase(),
  phone: z.string().min(5, "Phone number is required").trim(),
  roomNumber: z.string().trim().optional().default("Room 101"),
  hospital: z.string().optional().default("Doctor Tracker Medical Center"),
  maxPatients: z.number().int().positive().optional().default(300),
  experienceYears: z.number().int().nonnegative().optional().default(5),
  status: z.enum(["Active", "In Surgery", "On Leave", "Off Duty"]).optional().default("Active"),
  biography: z.string().optional(),
  avatar: z.string().optional(),
});

export const createDoctorSchema = baseDoctorSchema.refine(
  (data) => Boolean(data.specialty || data.specialization),
  {
    message: "Specialty is required",
    path: ["specialty"],
  }
);

export const updateDoctorSchema = baseDoctorSchema.partial();

export const addDoctorPatientSchema = z.object({
  name: z.string().min(2, "Patient name must be at least 2 characters").trim(),
  age: z.number().int().min(0, "Age must be >= 0").max(130, "Age must be <= 130"),
  gender: z.enum(["Male", "Female", "Other"]),
  condition: z.enum(["General", "Chronic", "Recovering", "Follow-up", "Critical"]).optional().default("General"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional().default("O+"),
  status: z.enum(["Admitted", "Outpatient", "Discharged"]).optional().default("Outpatient"),
  phone: z.string().min(5, "Phone number is required").trim(),
  email: z.string().email("Invalid email address").optional(),
  notes: z.string().optional(),
});

export const doctorPatientParamsSchema = z.object({
  id: objectIdSchema,
  patientId: objectIdSchema,
});
