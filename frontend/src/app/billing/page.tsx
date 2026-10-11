"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { InvoiceItem } from "@/lib/types";
import { InvoiceDetailModal } from "@/components/modals/InvoiceDetailModal";
import {
  CreditCard,
  DollarSign,
  ShieldCheck,
  Download,
  Plus,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  Eye,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const {
    invoices,
    markInvoicePaid,
    setIsGenerateInvoiceModalOpen,
    showToast,
  } = useDoctorTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedMethod, setSelectedMethod] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Pending" | "Overdue" | "Processing">("All");
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<InvoiceItem | null>(null);

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedStatus !== "All" ||
    selectedMethod !== "All" ||
    activeTab !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedMethod("All");
    setActiveTab("All");
  };

  const filteredInvoices = invoices.filter((inv) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      inv.invoiceCode.toLowerCase().includes(query) ||
      inv.patientName.toLowerCase().includes(query) ||
      inv.patientCode.toLowerCase().includes(query) ||
      inv.doctorName.toLowerCase().includes(query) ||
      inv.paymentMethod.toLowerCase().includes(query);

    const matchesStatus =
      selectedStatus === "All" || inv.status === selectedStatus;

    const matchesTab =
      activeTab === "All" || inv.status === activeTab;

    const matchesMethod =
      selectedMethod === "All" || inv.paymentMethod === selectedMethod;

    return matchesSearch && matchesStatus && matchesTab && matchesMethod;
  });

  // Financial KPI calculations
  const totalBilled = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalCollected = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, i) => acc + i.total, 0);
  const totalPending = invoices
    .filter((i) => i.status === "Pending" || i.status === "Processing")
    .reduce((acc, i) => acc + i.total, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((acc, i) => acc + i.total, 0);

  const exportInvoicesCSV = () => {
    const headers = ["Invoice Code", "Patient Name", "Patient ID", "Doctor", "Issue Date", "Due Date", "Subtotal", "Tax", "Discount", "Total", "Method", "Status"];
    const rows = filteredInvoices.map((i) => [
      i.invoiceCode,
      `"${i.patientName}"`,
      i.patientCode,
      `"${i.doctorName}"`,
      i.issueDate,
      i.dueDate,
      i.subtotal,
      i.tax,
      i.discount,
      i.total,
      i.paymentMethod,
      i.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital_invoices_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Ledger Exported", `Downloaded CSV for ${filteredInvoices.length} invoices.`, "success");
  };

  const getStatusBadge = (status: InvoiceItem["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]">
            <Check className="w-3 h-3" /> Paid
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA]">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#2F65F6] border border-[#DBEAFE]">
            &bull; Claim Processing
          </span>
        );
    }
  };

  return (
    <AppShell breadcrumbTitle="Billing & Insurance" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Billing, Invoices & Claims
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Patient invoice ledger, medical insurance claims, co-pays, and hospital receivables.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={exportInvoicesCSV}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGenerateInvoiceModalOpen(true)}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-semibold uppercase truncate block">Total Billed</span>
              <p className="text-lg sm:text-2xl font-bold text-[#101828] mt-0.5 truncate">
                ${totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-[#10B981] font-semibold truncate block">+18.2% vs prev month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-semibold uppercase truncate block">Collected Revenue</span>
              <p className="text-lg sm:text-2xl font-bold text-[#10B981] mt-0.5 truncate">
                ${totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-[#10B981] font-semibold truncate block">100% Reconciled</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-semibold uppercase truncate block">Pending Claims</span>
              <p className="text-lg sm:text-2xl font-bold text-[#D97706] mt-0.5 truncate">
                ${totalPending.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-[#64748B] truncate block">Active policies</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-semibold uppercase truncate block">Overdue Balance</span>
              <p className="text-lg sm:text-2xl font-bold text-[#EF4444] mt-0.5 truncate">
                ${totalOverdue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-[#EF4444] font-semibold truncate block">Notices sent</span>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-4 card-shadow space-y-3">
          {/* Status Tabs - Responsive flex-wrap avoiding sliding bars */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
            {(["All", "Paid", "Pending", "Overdue", "Processing"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer",
                  activeTab === tab
                    ? "bg-[#2F65F6] text-white shadow-xs"
                    : "bg-[#F8FAFC] text-slate-600 border border-slate-200 hover:bg-slate-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Method Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-xs md:max-w-sm">
              <input
                type="text"
                placeholder="Search invoice #, patient, or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-full pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              {/* Payment Method Filter */}
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="flex-1 sm:flex-none bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="All">All Payment Modes</option>
                <option value="Insurance">Insurance</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Pay">Mobile Pay</option>
              </select>

              {/* Permanent Non-Shifting Reset Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                disabled={!isFiltered}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shrink-0 cursor-pointer",
                  isFiltered
                    ? "bg-white text-[#2F65F6] border-[#2F65F6]/30 hover:bg-[#2F65F6]/5 shadow-2xs"
                    : "bg-[#F8FAFC] text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                )}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View: Invoice Cards (Visible on mobile screens) */}
        <div className="block md:hidden space-y-3">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-[#EBF0F7] p-4 card-shadow space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceForDetail(inv)}
                    className="font-mono font-bold text-sm text-[#2F65F6] hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{inv.invoiceCode}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Issued: {inv.issueDate} &bull; Due: {inv.dueDate}
                  </span>
                </div>
                <div>{getStatusBadge(inv.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Patient</span>
                  <div className="font-semibold text-slate-900 truncate">{inv.patientName}</div>
                  <div className="text-[10px] text-slate-400">{inv.patientCode}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Doctor</span>
                  <div className="font-semibold text-slate-900 truncate">{inv.doctorName}</div>
                  <div className="text-[10px] text-slate-500">{inv.items.length} items</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                    {inv.paymentMethod}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total</span>
                  <span className="font-bold text-slate-900 font-mono text-base">
                    ${inv.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForDetail(inv)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {inv.status !== "Paid" && (
                  <button
                    type="button"
                    onClick={() => markInvoicePaid(inv.id)}
                    className="flex-1 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Paid</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredInvoices.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#EBF0F7] p-8 text-center text-slate-400 card-shadow text-xs">
              No invoices match the selected filter criteria.
            </div>
          )}
        </div>

        {/* Desktop View: Invoice Ledger Table (Hidden on mobile) */}
        <div className="hidden md:block bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-6 card-shadow">
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9]">
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Attending Doctor</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount ($)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceForDetail(inv)}
                        className="font-mono font-bold text-[#2F65F6] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{inv.invoiceCode}</span>
                      </button>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Issued: {inv.issueDate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#101828]">{inv.patientName}</div>
                      <div className="text-[11px] text-slate-400">{inv.patientCode}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#101828]">{inv.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{inv.items.length} itemized items</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {inv.dueDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {inv.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-sm">
                      ${inv.total.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(inv.status)}</td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceForDetail(inv)}
                          className="p-1.5 text-slate-500 hover:text-[#2F65F6] hover:bg-blue-50 rounded-full transition-all cursor-pointer"
                          title="View & Print Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {inv.status !== "Paid" && (
                          <button
                            type="button"
                            onClick={() => markInvoicePaid(inv.id)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-full border border-emerald-200 transition-all flex items-center gap-1 text-[11px] cursor-pointer"
                            title="Mark as Paid"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Paid</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No invoices match the selected filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Detail & Print Modal */}
        <InvoiceDetailModal
          invoice={selectedInvoiceForDetail}
          onClose={() => setSelectedInvoiceForDetail(null)}
        />
      </div>
    </AppShell>
  );
}
