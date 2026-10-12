import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { authorizeRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validations/common.js";
import {
  appointmentQuerySchema,
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../validations/appointmentValidation.js";

const router = Router();

router
  .route("/")
  .get(validate({ query: appointmentQuerySchema }), getAppointments)
  .post(
    authorizeRoles("admin", "doctor", "staff"),
    validate({ body: createAppointmentSchema }),
    createAppointment
  );

router
  .route("/:id/status")
  .patch(
    authorizeRoles("admin", "doctor", "staff"),
    validate({ params: idParamSchema, body: updateAppointmentStatusSchema }),
    updateAppointmentStatus
  );

router
  .route("/:id")
  .delete(
    authorizeRoles("admin"),
    validate({ params: idParamSchema }),
    cancelAppointment
  );

export default router;
