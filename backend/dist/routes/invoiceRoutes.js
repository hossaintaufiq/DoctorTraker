"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoiceController_js_1 = require("../controllers/invoiceController.js");
const router = (0, express_1.Router)();
router.route("/")
    .get(invoiceController_js_1.getInvoices)
    .post(invoiceController_js_1.createInvoice);
router.route("/:id/pay")
    .patch(invoiceController_js_1.markInvoicePaid);
exports.default = router;
