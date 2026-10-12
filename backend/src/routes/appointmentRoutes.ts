import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.route("/")
  .get(getAppointments)
  .post(authorizeRoles("admin", "doctor", "staff"), createAppointment);

router.route("/:id/status")
  .patch(authorizeRoles("admin", "doctor", "staff"), updateAppointmentStatus);

router.route("/:id")
  .delete(authorizeRoles("admin"), cancelAppointment);

export default router;
