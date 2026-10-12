import { z } from "zod";
import { paginationQuerySchema, objectIdSchema } from "./common.js";

const patientSortFields = [
  "createdAt",
  "registrationDate",
  "name",
  "age",
  "lastVisit",
  "condition",
  "status",
] as const;

export const patientQuerySchema = paginationQuerySchema.extend({
  condition: z.enum(["All", "General", "Chronic", "Recovering", "Follow-up", "Critical"]).optional(),
  status: z.enum(["All", "Admitted", "Outpatient", "Discharged"]).optional(),
  bloodGroup: z.enum(["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  doctorId: z.string().optional(),
  sortBy: z.enum(patientSortFields).optional().default("createdAt"),
});

export const createPatientSchema = z.object({
  name: z.string().min(2, "Patient name must be at least 2 characters").trim(),
  age: z.number().int().min(0, "Age must be >= 0").max(130, "Age must be <= 130"),
  gender: z.enum(["Male", "Female", "Other"]),
  assignedDoctorId: objectIdSchema,
  condition: z.enum(["General", "Chronic", "Recovering", "Follow-up", "Critical"]).optional().default("General"),
  status: z.enum(["Admitted", "Outpatient", "Discharged"]).optional().default("Outpatient"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional().default("O+"),
  phone: z.string().min(5, "Phone number is required").trim(),
  email: z.string().email("Invalid email address").optional(),
  notes: z.string().optional(),
});

export const updatePatientSchema = z.object({
  name: z.string().min(2).trim().optional(),
  age: z.number().int().min(0).max(130).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  assignedDoctorId: objectIdSchema.optional(),
  condition: z.enum(["General", "Chronic", "Recovering", "Follow-up", "Critical"]).optional(),
  status: z.enum(["Admitted", "Outpatient", "Discharged"]).optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  phone: z.string().min(5).trim().optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
});
