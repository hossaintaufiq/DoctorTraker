"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoices = getInvoices;
exports.createInvoice = createInvoice;
exports.markInvoicePaid = markInvoicePaid;
const Invoice_js_1 = require("../models/Invoice.js");
// @desc    Get invoices with search, status, payment method, and pagination
// @route   GET /api/invoices
async function getInvoices(req, res, next) {
    try {
        const { search, status, paymentMethod, page = 1, limit = 50 } = req.query;
        const query = {};
        if (search && typeof search === "string" && search.trim() !== "") {
            const searchRegex = new RegExp(search.trim(), "i");
            query.$or = [
                { invoiceCode: searchRegex },
                { patientName: searchRegex },
                { patientCode: searchRegex },
                { doctorName: searchRegex },
            ];
        }
        if (status && status !== "All") {
            query.status = status;
        }
        if (paymentMethod && paymentMethod !== "All") {
            query.paymentMethod = paymentMethod;
        }
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
        const skip = (pageNum - 1) * limitNum;
        const [invoices, total] = await Promise.all([
            Invoice_js_1.Invoice.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            Invoice_js_1.Invoice.countDocuments(query),
        ]);
        res.status(200).json({
            success: true,
            count: invoices.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: invoices,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Create invoice
// @route   POST /api/invoices
async function createInvoice(req, res, next) {
    try {
        const invoice = await Invoice_js_1.Invoice.create(req.body);
        res.status(201).json({
            success: true,
            message: "Invoice generated successfully.",
            data: invoice,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Mark invoice as paid
// @route   PATCH /api/invoices/:id/pay
async function markInvoicePaid(req, res, next) {
    try {
        const invoice = await Invoice_js_1.Invoice.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true });
        if (!invoice) {
            res.status(404).json({ success: false, message: "Invoice not found." });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Invoice marked as Paid successfully.",
            data: invoice,
        });
    }
    catch (error) {
        next(error);
    }
}
