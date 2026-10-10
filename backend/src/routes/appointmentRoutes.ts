import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js";

const router = Router();

router.route("/")
  .get(getAppointments)
  .post(createAppointment);

router.route("/:id/status")
  .patch(updateAppointmentStatus);

router.route("/:id")
  .delete(cancelAppointment);

export default router;
