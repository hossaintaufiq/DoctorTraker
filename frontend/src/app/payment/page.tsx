"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export default function PaymentPage() {
  const { showToast } = useDoctorTracker();

  return (
    <AppShell breadcrumbTitle="Payment" parentLabel="Other Menu" parentPath="/dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Payment Gateways & Receipts
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Payment gateway integrations, point-of-sale transactions, and digital payment receipts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => showToast("Payment Link", "Digital payment link generated.", "info")}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Payment Link</span>
          </button>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Gateway Balance</span>
            <p className="text-2xl font-bold text-[#101828] mt-1">$42,890.50</p>
            <span className="text-[10px] text-[#10B981] font-semibold">Instant payout ready</span>
          </div>
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Daily Volume</span>
            <p className="text-2xl font-bold text-[#2F65F6] mt-1">$5,340.00</p>
            <span className="text-[10px] text-[#64748B]">82 transactions processed</span>
          </div>
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Success Rate</span>
            <p className="text-2xl font-bold text-[#10B981] mt-1">99.8%</p>
            <span className="text-[10px] text-[#10B981] font-semibold">SSL Secured</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
