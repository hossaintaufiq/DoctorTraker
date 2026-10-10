"use client";

import React, { useState } from "react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  X,
  Search,
  Filter,
  Download,
  Trash2,
  ShieldCheck,
  Activity,
  FileText,
  UserCheck,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ActivityLogsModal() {
  const {
    isLogsModalOpen,
    setIsLogsModalOpen,
    activityLogs,
    clearActivityLogs,
    showToast,
  } = useDoctorTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  if (!isLogsModalOpen) return null;

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.ipAddress.includes(searchQuery);

    const matchesCategory =
      selectedCategory === "All" || log.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || log.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const exportLogsCSV = () => {
    const headers = ["ID", "Timestamp", "Category", "User", "Action", "Status", "IP Address", "Details"];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.category,
      log.user,
      `"${log.action.replace(/"/g, '""')}"`,
      log.status,
      log.ipAddress,
      `"${(log.details || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Audit Logs Exported", `Downloaded ${filteredLogs.length} audit records.`, "success");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Clinical":
        return <Activity className="w-4 h-4 text-[#2F65F6]" />;
      case "Billing":
        return <CreditCard className="w-4 h-4 text-[#10B981]" />;
      case "Staff":
        return <UserCheck className="w-4 h-4 text-[#8B5CF6]" />;
      case "Security":
        return <ShieldCheck className="w-4 h-4 text-[#EF4444]" />;
      default:
        return <FileText className="w-4 h-4 text-[#64748B]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]">
            <CheckCircle2 className="w-3 h-3" /> Success
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <AlertCircle className="w-3 h-3" /> Warning
          </span>
        );
      case "Error":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA]">
            <AlertCircle className="w-3 h-3" /> Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#2F65F6] border border-[#DBEAFE]">
            <Info className="w-3 h-3" /> Info
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-3xl w-full max-w-5xl h-[88vh] max-h-[760px] rounded-3xl border border-white/90 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2F65F6]/10 text-[#2F65F6] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101828] flex items-center gap-2">
                System Security & Activity Audit Log
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#EFF6FF] text-[#2F65F6] rounded-full border border-[#DBEAFE]">
                  {filteredLogs.length} Records
                </span>
              </h2>
              <p className="text-xs text-[#64748B]">
                Immutable compliance tracking for clinical records, patient access, billing actions, and admin logins.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportLogsCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#2F65F6] bg-[#2F65F6]/10 hover:bg-[#2F65F6]/20 rounded-full transition-all"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={clearActivityLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-all"
              title="Clear Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              onClick={() => setIsLogsModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search action, user, or IP address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2F65F6]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200">
              {["All", "Clinical", "Billing", "Staff", "Security"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1 text-[11px] font-semibold rounded-full transition-all",
                    selectedCategory === cat
                      ? "bg-[#2F65F6] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Error">Error</option>
              <option value="Info">Info</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 tracking-wider">
                  <th className="py-3 px-4">Event & Action</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#101828]">{log.action}</div>
                      {log.details && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{log.details}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        {getCategoryIcon(log.category)}
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{log.user}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 text-right">{getStatusBadge(log.status)}</td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No activity logs match your search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
