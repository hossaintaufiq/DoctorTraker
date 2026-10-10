"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Shield,
  Users,
  Lock,
  Key,
  Server,
  Database,
  CheckCircle2,
  HardDrive,
  Cpu,
  Activity,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Download,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveSession {
  id: string;
  user: string;
  role: string;
  ip: string;
  location: string;
  device: string;
  time: string;
  status: "Active" | "Idle";
}

const ACTIVE_SESSIONS: ActiveSession[] = [
  { id: "SES-991", user: "Sullivan (Owner)", role: "Master Admin", ip: "192.168.1.10", location: "Admin Terminal 01", device: "Chrome / Windows 11", time: "Active now", status: "Active" },
  { id: "SES-992", user: "Dr. Salman Hossain", role: "Chief Doctor", ip: "192.168.1.42", location: "Chamber 304", device: "Safari / macOS", time: "8 mins ago", status: "Active" },
  { id: "SES-993", user: "Clara Oswald", role: "Head Pharmacist", ip: "192.168.1.88", location: "Pharmacy Counter A", device: "Firefox / Linux", time: "22 mins ago", status: "Idle" },
  { id: "SES-994", user: "Billing Desk 02", role: "Accountant", ip: "192.168.1.104", location: "Billing Terminal", device: "Edge / Windows 10", time: "12 mins ago", status: "Active" },
];

export default function AdminPage() {
  const { showToast, setIsLogsModalOpen, addActivityLog } = useDoctorTracker();

  const [sessions, setSessions] = useState<ActiveSession[]>(ACTIVE_SESSIONS);

  const handleTerminateSession = (id: string, user: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    addActivityLog("Security", "User Session Terminated", `Revoked active token for ${user}.`, "Warning");
    showToast("Session Terminated", `Revoked credentials for ${user}.`, "info");
  };

  return (
    <AppShell breadcrumbTitle="Admin Panel" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Master Admin & System Security Panel
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Role-based permission matrices, database sync telemetry, active sessions, and HIPAA compliance audit triggers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsLogsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open System Audit Logs</span>
          </button>
        </div>

        {/* System Health Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">API Gateway</span>
              <p className="text-lg font-bold text-[#101828]">99.99% Uptime</p>
              <span className="text-[10px] text-[#10B981] font-semibold">Latency: 24ms &bull; SSL Encrypted</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Database Node Cluster</span>
              <p className="text-lg font-bold text-[#101828]">Sync Online</p>
              <span className="text-[10px] text-[#64748B]">Last Snapshot: 12 mins ago</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Active Authorized Logins</span>
              <p className="text-lg font-bold text-[#101828]">{sessions.length} Staff Sessions</p>
              <span className="text-[10px] text-[#10B981] font-semibold">2FA Enforced</span>
            </div>
          </div>
        </div>

        {/* Active Staff Sessions Table */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#101828]">Active Administrative & Staff Sessions</h3>
            <span className="text-xs text-[#2F65F6] font-semibold">Real-time Session Watcher</span>
          </div>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9]">
                  <th className="py-3 px-6">User Account</th>
                  <th className="py-3 px-4">Role / Scope</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Location / Terminal</th>
                  <th className="py-3 px-4">Device & Client</th>
                  <th className="py-3 px-6 text-right">Revoke Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-[#101828] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span>{s.user}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{s.id}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2F65F6] border border-blue-100">
                        {s.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">{s.ip}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{s.location}</td>
                    <td className="py-3.5 px-4 text-slate-500">{s.device}</td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleTerminateSession(s.id, s.user)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-full border border-rose-200 transition-all text-xs"
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Permission Matrix Card */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-4">
          <h3 className="text-base font-bold text-[#101828]">System Role Permission Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Master Admin</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-[#2F65F6]">Full Access</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Full read/write permissions across patient charts, doctor appointments, billing adjustments, and security settings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Doctor / Specialist</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#10B981]">Clinical Read/Write</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Create prescriptions, manage assigned patient queues, update diagnoses, and message patients.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Pharmacy & Billing Staff</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-[#D97706]">Financial & Stock</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Generate invoice charges, settle payments, dispense pharmaceutical inventory, and print vouchers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
