"use client";

import React from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  FileText,
  Calendar,
  User,
  CreditCard,
} from "lucide-react";
import { InvoiceItem } from "@/lib/types";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

interface InvoiceDetailModalProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
}

export function InvoiceDetailModal({ invoice, onClose }: InvoiceDetailModalProps) {
  const { markInvoicePaid, showToast } = useDoctorTracker();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleMarkPaid = () => {
    markInvoicePaid(invoice.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Action Bar (Hidden on Print) */}
        <div className="h-16 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0 print:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-mono font-bold text-xs sm:text-sm text-[#2F65F6] truncate">
              {invoice.invoiceCode}
            </span>
            <span
              className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                invoice.status === "Paid"
                  ? "bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]"
                  : invoice.status === "Pending"
                  ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                  : "bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA]"
              }`}
            >
              &bull; {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {invoice.status !== "Paid" && (
              <button
                type="button"
                onClick={handleMarkPaid}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10B981] hover:bg-[#059669] rounded-full shadow-2xs transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mark Paid</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-full transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all ml-1 cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-4 sm:p-8 sm:p-10 overflow-y-auto space-y-6 print:p-0">
          {/* Hospital Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2F65F6] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                DT
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Doctor Tracker Medical Center
                </h1>
                <p className="text-xs text-slate-500">
                  Care Guide BD Clinical Operations &bull; Tax ID: BD-88392-MED
                </p>
                <p className="text-[11px] text-slate-400">
                  Plot 14, Block B, Medical Zone, Dhaka 1212 &bull; +880 2 988-1234
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-400 uppercase font-semibold">
                Official Clinical Invoice
              </div>
              <div className="text-lg font-mono font-bold text-slate-900">
                {invoice.invoiceCode}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Issue Date: <span className="font-semibold text-slate-700">{invoice.issueDate}</span>
              </div>
              <div className="text-xs text-slate-500">
                Due Date: <span className="font-semibold text-slate-700">{invoice.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Billed To / Attending Physician */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Patient Information (Billed To)
              </span>
              <div className="text-sm font-bold text-slate-900">{invoice.patientName}</div>
              <div className="text-xs text-slate-500">Patient ID: {invoice.patientCode}</div>
              <div className="text-xs text-slate-500">Payment Terms: {invoice.paymentMethod}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Attending Physician & Staff
              </span>
              <div className="text-sm font-bold text-slate-900">{invoice.doctorName}</div>
              <div className="text-xs text-slate-500">Department of Clinical Medicine</div>
              <div className="text-xs text-slate-500">Authorization: Verified via Hospital ERP</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-3 px-4">Description of Service</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {invoice.items.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.description}</td>
                    <td className="py-3 px-4 text-slate-500">{item.department}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-slate-500 max-w-sm space-y-1">
              <p className="font-semibold text-slate-700">Payment Instructions & Notes:</p>
              <p>
                Settlement via insurance requires pre-authorization voucher. For questions, contact
                our billing desk at billing@doctortracker.health.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount / Subsidy:</span>
                  <span className="font-mono font-semibold">-${invoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tax / Regulatory Fee:</span>
                <span className="font-mono font-semibold">${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Grand Total:</span>
                <span className="font-mono text-[#2F65F6] text-base">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Thank you for trusting Doctor Tracker Medical Center. This is a computer generated invoice and requires no physical signature.
          </div>
        </div>
      </div>
    </div>
  );
}
