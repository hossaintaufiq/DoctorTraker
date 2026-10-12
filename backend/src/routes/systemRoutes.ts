import { Router } from "express";
import { z } from "zod";
import { resetDatabase } from "../controllers/systemController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const resetDatabaseSchema = z.object({
  confirm: z.literal("CONFIRM_RESET_DATABASE"),
});

// Administrative Database Reset Endpoint (Admin Only, Strict Confirmation)
router.post(
  "/reset-database",
  protect,
  authorizeRoles("admin"),
  validate({ body: resetDatabaseSchema }),
  resetDatabase
);

export default router;
