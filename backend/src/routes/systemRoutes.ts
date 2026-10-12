import { Router } from "express";
import { resetDatabase } from "../controllers/systemController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = Router();

// Administrative Database Reset Endpoint (Admin Only)
router.post("/reset-database", protect, authorizeRoles("admin"), resetDatabase);

export default router;
