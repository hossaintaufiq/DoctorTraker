"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Shield, Users, Lock, Key, Server, Database, CheckCircle2 } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export default function AdminPage() {
  const { showToast } = useDoctorTracker();

  return (
    <AppShell breadcrumbTitle="Admin Panel" parentLabel="Other Menu" parentPath="/dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Master Admin & Security Panel
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Role-based permission matrices, database telemetry, and security access audit logs.
            </p>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">API Gateway</span>
              <p className="text-lg font-bold text-[#101828]">99.99% Uptime</p>
              <span className="text-[10px] text-[#10B981] font-semibold">Latency: 24ms</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Database Node</span>
              <p className="text-lg font-bold text-[#101828]">Sync Online</p>
              <span className="text-[10px] text-[#64748B]">Last Backup: 2 hrs ago</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Active Sessions</span>
              <p className="text-lg font-bold text-[#101828]">12 Admin Roles</p>
              <span className="text-[10px] text-[#10B981] font-semibold">2FA Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
