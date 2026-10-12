import { Router } from "express";
import {
  getInvoices,
  createInvoice,
  markInvoicePaid,
} from "../controllers/invoiceController.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.route("/")
  .get(getInvoices)
  .post(authorizeRoles("admin", "staff"), createInvoice);

router.route("/:id/pay")
  .patch(authorizeRoles("admin", "staff"), markInvoicePaid);

export default router;
