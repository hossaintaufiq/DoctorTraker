import { z } from "zod";
import mongoose from "mongoose";

// MongoDB ObjectId validator
export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  {
    message: "Invalid resource identifier format (24-character hexadecimal ObjectId required)",
  }
);

// Standard URL Parameter schema with :id
export const idParamSchema = z.object({
  id: objectIdSchema,
});

// Standard Pagination & Sort Query Schema
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 10)) : 10)),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid startDate format. Expected ISO-8601 date string (YYYY-MM-DD)",
    }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid endDate format. Expected ISO-8601 date string (YYYY-MM-DD)",
    }),
});

// Helper to escape regex special characters for safe literal matching
export function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Helper to create an inclusive UTC date range query
export function buildDateRangeQuery(
  startDate?: string,
  endDate?: string
): { $gte?: Date; $lte?: Date } | undefined {
  if (!startDate && !endDate) return undefined;

  const range: { $gte?: Date; $lte?: Date } = {};

  if (startDate) {
    const sDate = new Date(startDate);
    sDate.setUTCHours(0, 0, 0, 0);
    range.$gte = sDate;
  }

  if (endDate) {
    const eDate = new Date(endDate);
    eDate.setUTCHours(23, 59, 59, 999);
    range.$lte = eDate;
  }

  return range;
}
