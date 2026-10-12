import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { authorizeRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validations/common.js";
import {
  patientQuerySchema,
  createPatientSchema,
  updatePatientSchema,
} from "../validations/patientValidation.js";

const router = Router();

router
  .route("/")
  .get(validate({ query: patientQuerySchema }), getPatients)
  .post(
    authorizeRoles("admin", "doctor"),
    validate({ body: createPatientSchema }),
    createPatient
  );

router
  .route("/:id")
  .get(validate({ params: idParamSchema }), getPatientById)
  .put(
    authorizeRoles("admin", "doctor"),
    validate({ params: idParamSchema, body: updatePatientSchema }),
    updatePatient
  )
  .patch(
    authorizeRoles("admin", "doctor"),
    validate({ params: idParamSchema, body: updatePatientSchema }),
    updatePatient
  )
  .delete(
    authorizeRoles("admin"),
    validate({ params: idParamSchema }),
    deletePatient
  );

export default router;
