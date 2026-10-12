import { Router } from "express";
import {
  getInvoices,
  createInvoice,
  markInvoicePaid,
} from "../controllers/invoiceController.js";
import { authorizeRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validations/common.js";
import {
  invoiceQuerySchema,
  createInvoiceSchema,
} from "../validations/invoiceValidation.js";

const router = Router();

router
  .route("/")
  .get(validate({ query: invoiceQuerySchema }), getInvoices)
  .post(
    authorizeRoles("admin", "staff"),
    validate({ body: createInvoiceSchema }),
    createInvoice
  );

router
  .route("/:id/pay")
  .patch(
    authorizeRoles("admin", "staff"),
    validate({ params: idParamSchema }),
    markInvoicePaid
  );

export default router;
