import { z } from "zod";
import { paginationQuerySchema } from "./common.js";

export const invoiceQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["All", "Paid", "Pending", "Overdue", "Draft"]).optional(),
  department: z.string().optional(),
  sortBy: z.enum(["createdAt", "issueDate", "total", "status"]).optional().default("issueDate"),
});

export const createInvoiceSchema = z.object({
  patientId: z.string().min(1, "patientId is required"),
  patientName: z.string().min(2, "patientName is required"),
  patientCode: z.string().optional().default(""),
  doctorId: z.string().min(1, "doctorId is required"),
  doctorName: z.string().min(2, "doctorName is required"),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["Paid", "Pending", "Overdue", "Draft"]).optional().default("Pending"),
  paymentMethod: z.enum(["Insurance", "Credit Card", "Cash", "Bank Transfer"]).optional().default("Credit Card"),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative().optional().default(0),
  discount: z.number().nonnegative().optional().default(0),
  total: z.number().nonnegative(),
  items: z.array(
    z.object({
      description: z.string().min(1),
      department: z.string().optional(),
      quantity: z.number().int().positive().default(1),
      unitPrice: z.number().nonnegative(),
      totalPrice: z.number().nonnegative(),
    })
  ).min(1, "Invoice must contain at least one line item"),
});
