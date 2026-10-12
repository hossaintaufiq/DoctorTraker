import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  addPatientUnderDoctor,
  removePatientFromDoctor,
} from "../controllers/doctorController.js";
import { authorizeRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validations/common.js";
import {
  doctorQuerySchema,
  createDoctorSchema,
  updateDoctorSchema,
  addDoctorPatientSchema,
  doctorPatientParamsSchema,
} from "../validations/doctorValidation.js";

const router = Router();

router
  .route("/")
  .get(validate({ query: doctorQuerySchema }), getDoctors)
  .post(
    authorizeRoles("admin"),
    validate({ body: createDoctorSchema }),
    createDoctor
  );

router
  .route("/:id")
  .get(validate({ params: idParamSchema }), getDoctorById)
  .put(
    authorizeRoles("admin"),
    validate({ params: idParamSchema, body: updateDoctorSchema }),
    updateDoctor
  )
  .patch(
    authorizeRoles("admin"),
    validate({ params: idParamSchema, body: updateDoctorSchema }),
    updateDoctor
  )
  .delete(
    authorizeRoles("admin"),
    validate({ params: idParamSchema }),
    deleteDoctor
  );

router
  .route("/:id/patients")
  .post(
    authorizeRoles("admin", "doctor"),
    validate({ params: idParamSchema, body: addDoctorPatientSchema }),
    addPatientUnderDoctor
  );

router
  .route("/:id/patients/:patientId")
  .delete(
    authorizeRoles("admin", "doctor"),
    validate({ params: doctorPatientParamsSchema }),
    removePatientFromDoctor
  );

export default router;
