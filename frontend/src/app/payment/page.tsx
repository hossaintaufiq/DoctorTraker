"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  QrCode,
  Download,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TRANSACTIONS = [
  { id: "TXN-88291", patient: "Jane Cooper", amount: 350.00, method: "Insurance Pre-Auth (MetLife)", status: "Settled", date: "Today, 10:45 AM", type: "Credit" },
  { id: "TXN-88290", patient: "Robert Fox", amount: 180.00, method: "Visa POS &bull; 4492", status: "Settled", date: "Today, 09:20 AM", type: "Credit" },
  { id: "TXN-88289", patient: "Esther Howard", amount: 520.00, method: "Mastercard &bull; 8812", status: "Settled", date: "Yesterday, 04:15 PM", type: "Credit" },
  { id: "TXN-88288", patient: "Cody Fisher", amount: 95.00, method: "bKash / Mobile Pay", status: "Settled", date: "Yesterday, 02:30 PM", type: "Credit" },
  { id: "TXN-88287", patient: "Devon Lane", amount: 1250.00, method: "Bank Wire (City Bank)", status: "Pending Clearing", date: "09 Oct 2026", type: "Credit" },
  { id: "TXN-88286", patient: "Wade Warren", amount: 240.00, method: "Health Insurance (Cigna)", status: "Settled", date: "08 Oct 2026", type: "Credit" },
];

export default function PaymentPage() {
  const { showToast } = useDoctorTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkAmount, setLinkAmount] = useState("150.00");
  const [linkRecipient, setLinkRecipient] = useState("Jane Cooper");

  const isFiltered = searchQuery.trim() !== "" || selectedMethod !== "All";

  const filteredTxns = TRANSACTIONS.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.id.toLowerCase().includes(q) ||
      t.patient.toLowerCase().includes(q) ||
      t.method.toLowerCase().includes(q);

    const matchesMethod =
      selectedMethod === "All" ||
      t.method.toLowerCase().includes(selectedMethod.toLowerCase());

    return matchesSearch && matchesMethod;
  });

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://pay.doctortracker.health/checkout/pay_${Date.now()}`);
    showToast("Link Copied", "Secure checkout URL copied to clipboard.", "success");
    setShowLinkModal(false);
  };

  return (
    <AppShell breadcrumbTitle="Payment" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Payment Gateways & Receipts
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Payment gateway integrations, POS terminal reconciliations, and digital payment checkout links.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Payment Link</span>
          </button>
        </div>

        {/* Highlights KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Merchant Gateway Balance</span>
              <Wallet className="w-5 h-5 text-[#2F65F6]" />
            </div>
            <p className="text-2xl font-bold text-[#101828] mt-2">$42,890.50</p>
            <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Auto-payout enabled (Daily 00:00 UTC)
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Daily Volume</span>
              <CreditCard className="w-5 h-5 text-[#10B981]" />
            </div>
            <p className="text-2xl font-bold text-[#2F65F6] mt-2">$5,340.00</p>
            <span className="text-[10px] text-[#64748B] mt-1 block">82 transactions processed today</span>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Gateway Success Rate</span>
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            </div>
            <p className="text-2xl font-bold text-[#10B981] mt-2">99.8%</p>
            <span className="text-[10px] text-[#10B981] font-semibold mt-1 block">PCI-DSS Level 1 Encrypted</span>
          </div>
        </div>

        {/* Transactions Table with Search & Filter */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="text-base font-bold text-[#101828]">Electronic Payment Receipts</h3>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search TXN # or patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="All">All Methods</option>
                <option value="Visa">Visa / Card</option>
                <option value="Insurance">Insurance</option>
                <option value="bKash">Mobile Pay</option>
                <option value="Bank">Bank Wire</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedMethod("All");
                }}
                disabled={!isFiltered}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shrink-0",
                  isFiltered
                    ? "bg-white text-[#2F65F6] border-[#2F65F6]/30 hover:bg-[#2F65F6]/5 cursor-pointer shadow-2xs"
                    : "bg-[#F8FAFC] text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                )}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9]">
                  <th className="py-3 px-6">Transaction ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#2F65F6]">{t.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#101828]">{t.patient}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium" dangerouslySetInnerHTML={{ __html: t.method }} />
                    <td className="py-3.5 px-4 text-slate-500">{t.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      +${t.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${t.status === "Settled" ? "bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]" : "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"}`}>
                        &bull; {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate Payment Link Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#2F65F6]" />
                  <h3 className="text-base font-bold text-slate-900">Create Patient Payment Link</h3>
                </div>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={linkRecipient}
                    onChange={(e) => setLinkRecipient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-[#2F65F6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={linkAmount}
                    onChange={(e) => setLinkAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-[#2F65F6]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Payment Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
