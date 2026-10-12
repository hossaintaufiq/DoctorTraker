import { Router } from "express";
import { z } from "zod";
import { getDashboardAnalytics } from "../controllers/analyticsController.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const dashboardAnalyticsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  hospital: z.string().optional(),
  specialty: z.string().optional(),
  period: z.enum(["7d", "30d", "90d", "ytd", "YTD", "all", "All"]).optional(),
});

router.get(
  "/dashboard",
  validate({ query: dashboardAnalyticsQuerySchema }),
  getDashboardAnalytics
);

export default router;
