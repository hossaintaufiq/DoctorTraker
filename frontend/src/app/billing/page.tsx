"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CreditCard, DollarSign, ShieldCheck, Download, Plus } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

const INVOICES = [
  { id: "INV-9921", patient: "Jane Cooper", amount: "$350.00", date: "25 Dec 2026", status: "Paid", method: "Insurance" },
  { id: "INV-9920", patient: "Olivia Bennett", amount: "$120.00", date: "10 Oct 2026", status: "Paid", method: "Credit Card" },
  { id: "INV-9919", patient: "Ethan Parker", amount: "$480.00", date: "08 Oct 2026", status: "Pending", method: "Insurance" },
  { id: "INV-9918", patient: "Sophia Martinez", amount: "$95.00", date: "06 Oct 2026", status: "Paid", method: "Cash" },
  { id: "INV-9917", patient: "Noah Williams", amount: "$620.00", date: "05 Oct 2026", status: "Paid", method: "Insurance" },
];

export default function BillingPage() {
  const { showToast } = useDoctorTracker();

  return (
    <AppShell breadcrumbTitle="Billing & Insurance" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Billing, Insurance & Claims
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Patient invoice ledger, medical insurance claims, and hospital receivables.
            </p>
          </div>

          <button
            type="button"
            onClick={() => showToast("Invoice Generated", "New invoice draft created.", "success")}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Total Revenue (MTD)</span>
            <p className="text-2xl font-bold text-[#101828] mt-1">$54,24.05</p>
            <span className="text-[10px] text-[#10B981] font-semibold">+18.2% vs previous</span>
          </div>
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Pending Claims</span>
            <p className="text-2xl font-bold text-[#2F65F6] mt-1">$12,450.00</p>
            <span className="text-[10px] text-[#64748B]">14 insurance policies active</span>
          </div>
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Settled Today</span>
            <p className="text-2xl font-bold text-[#101828] mt-1">$3,890.00</p>
            <span className="text-[10px] text-[#10B981] font-semibold">100% Reconciled</span>
          </div>
        </div>

        {/* Invoice Ledger Table */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow">
          <h3 className="text-base font-bold text-[#101828] mb-4">Recent Invoices</h3>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9]">
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#2F65F6]">{inv.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#101828]">{inv.patient}</td>
                    <td className="py-3.5 px-4 font-bold text-[#101828]">{inv.amount}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{inv.method}</td>
                    <td className="py-3.5 px-4 text-[#94A3B8]">{inv.date}</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${inv.status === "Paid" ? "bg-[#ECFDF5] text-[#10B981]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                        &bull; {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
