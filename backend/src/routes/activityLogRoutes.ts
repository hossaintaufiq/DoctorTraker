import { Router } from "express";
import {
  getActivityLogs,
  createActivityLog,
  clearActivityLogs,
} from "../controllers/activityLogController.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.route("/")
  .get(getActivityLogs)
  .post(authorizeRoles("admin", "doctor", "staff"), createActivityLog)
  .delete(authorizeRoles("admin"), clearActivityLogs);

export default router;
