import { Router } from "express";
import {
  getInvoices,
  createInvoice,
  markInvoicePaid,
} from "../controllers/invoiceController.js";

const router = Router();

router.route("/")
  .get(getInvoices)
  .post(createInvoice);

router.route("/:id/pay")
  .patch(markInvoicePaid);

export default router;
