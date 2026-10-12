"use client";

import React from "react";
import { CreditCard } from "lucide-react";

interface BillingSettingsTabProps {
  defaultTaxRate: string;
  setDefaultTaxRate: (val: string) => void;
  defaultCoPay: string;
  setDefaultCoPay: (val: string) => void;
  invoicePrefix: string;
  setInvoicePrefix: (val: string) => void;
  paymentGracePeriod: string;
  setPaymentGracePeriod: (val: string) => void;
  maxDiscountAllowed: string;
  setMaxDiscountAllowed: (val: string) => void;
  autoGenerateReceipt: boolean;
  setAutoGenerateReceipt: (val: boolean) => void;
}

export function BillingSettingsTab({
  defaultTaxRate,
  setDefaultTaxRate,
  defaultCoPay,
  setDefaultCoPay,
  invoicePrefix,
  setInvoicePrefix,
  paymentGracePeriod,
  setPaymentGracePeriod,
  maxDiscountAllowed,
  setMaxDiscountAllowed,
  autoGenerateReceipt,
  setAutoGenerateReceipt,
}: BillingSettingsTabProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 pb-4 border-b border-[#EBF0F7]">
        <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] text-[#2F65F6] flex items-center justify-center border border-[#DBEAFE]">
          <CreditCard className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#101828]">Financial, Tariff & Invoice Rules</h3>
          <p className="text-xs text-[#64748B]">Tax rates, insurance co-pay thresholds, invoice prefixes, and settlement grace periods</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Default VAT / Government Health Tax (%)</label>
          <input
            type="number"
            step="0.1"
            value={defaultTaxRate}
            onChange={(e) => setDefaultTaxRate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Default Insurance Co-Pay Deductible (%)</label>
          <input
            type="number"
            step="0.1"
            value={defaultCoPay}
            onChange={(e) => setDefaultCoPay(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Invoice Code Sequential Prefix</label>
          <input
            type="text"
            value={invoicePrefix}
            onChange={(e) => setInvoicePrefix(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] font-mono text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Payment Grace Period (Days)</label>
          <input
            type="number"
            value={paymentGracePeriod}
            onChange={(e) => setPaymentGracePeriod(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Maximum Discretionary Discount (%)</label>
          <input
            type="number"
            max="100"
            value={maxDiscountAllowed}
            onChange={(e) => setMaxDiscountAllowed(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
          <div>
            <p className="text-xs font-bold text-[#101828]">Auto-Generate Payment Receipt on Paid Invoices</p>
            <p className="text-[11px] text-[#64748B]">
              Immediately trigger POS digital payment voucher and SMS confirmation to patient
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoGenerateReceipt}
            onChange={(e) => setAutoGenerateReceipt(e.target.checked)}
            className="w-4 h-4 accent-[#2F65F6] rounded"
          />
        </label>
      </div>
    </div>
  );
}
