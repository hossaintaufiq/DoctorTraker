import { Request, Response, NextFunction } from "express";
import { Invoice } from "../models/Invoice.js";
import { escapeRegex } from "../validations/common.js";

// @desc    Get invoices with search, status, payment method, and pagination
// @route   GET /api/invoices
export async function getInvoices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, status, paymentMethod, page = 1, limit = 50 } = req.query;

    const query: Record<string, any> = {};

    if (search && typeof search === "string" && search.trim() !== "") {
      const escaped = escapeRegex(search.trim());
      const searchRegex = new RegExp(escaped, "i");
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

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [invoices, total] = await Promise.all([
      Invoice.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Invoice.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: invoices.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Create invoice
// @route   POST /api/invoices
export async function createInvoice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({
      success: true,
      message: "Invoice generated successfully.",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Mark invoice as paid
// @route   PATCH /api/invoices/:id/pay
export async function markInvoicePaid(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: "Paid" },
      { new: true }
    );

    if (!invoice) {
      res.status(404).json({ success: false, message: "Invoice not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Invoice marked as Paid successfully.",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}
