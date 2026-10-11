"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Users,
  BedDouble,
  UserCheck,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
  Outpatient: "#10B981", // Emerald
  Admitted: "#2F65F6",   // Blue
  Discharged: "#94A3B8", // Slate
};

const CONDITION_COLORS = {
  Critical: "#EF4444",   // Red
  Chronic: "#F59E0B",    // Amber
  Recovering: "#10B981", // Emerald
  "Follow-up": "#8B5CF6",// Purple
  General: "#3B82F6",    // Sky
};

export function PatientStatusBreakdownCard() {
  const { patients } = useDoctorTracker();
  const [activeTab, setActiveTab] = useState<"status" | "condition">("status");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalPatients = patients.length;

  // Status metrics
  const statusData = useMemo(() => {
    const outpatient = patients.filter((p) => p.status === "Outpatient").length;
    const admitted = patients.filter((p) => p.status === "Admitted").length;
    const discharged = patients.filter((p) => p.status === "Discharged").length;

    const data = [
      { name: "Outpatient", count: outpatient, color: STATUS_COLORS.Outpatient },
      { name: "Admitted", count: admitted, color: STATUS_COLORS.Admitted },
      { name: "Discharged", count: discharged, color: STATUS_COLORS.Discharged },
    ];

    return data.map((item) => ({
      ...item,
      percentage: totalPatients > 0 ? Math.round((item.count / totalPatients) * 100) : 0,
    }));
  }, [patients, totalPatients]);

  // Condition metrics
  const conditionData = useMemo(() => {
    const critical = patients.filter((p) => p.condition === "Critical").length;
    const chronic = patients.filter((p) => p.condition === "Chronic").length;
    const recovering = patients.filter((p) => p.condition === "Recovering").length;
    const followUp = patients.filter((p) => p.condition === "Follow-up").length;
    const general = patients.filter((p) => p.condition === "General").length;

    const data = [
      { name: "Critical", count: critical, color: CONDITION_COLORS.Critical },
      { name: "Chronic", count: chronic, color: CONDITION_COLORS.Chronic },
      { name: "Recovering", count: recovering, color: CONDITION_COLORS.Recovering },
      { name: "Follow-up", count: followUp, color: CONDITION_COLORS["Follow-up"] },
      { name: "General", count: general, color: CONDITION_COLORS.General },
    ];

    return data
      .filter((item) => item.count > 0 || totalPatients === 0)
      .map((item) => ({
        ...item,
        percentage: totalPatients > 0 ? Math.round((item.count / totalPatients) * 100) : 0,
      }));
  }, [patients, totalPatients]);

  const activeChartData = activeTab === "status" ? statusData : conditionData;
  const criticalCount = patients.filter((p) => p.condition === "Critical").length;
  const admittedCount = patients.filter((p) => p.status === "Admitted").length;

  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full transition-all">
      {/* Header with Title and Mode Switcher */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#101828] tracking-tight">
                  Patient Status Breakdown
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Realtime clinical status and admission mix
              </p>
            </div>
          </div>

          {/* Toggle pill: Care Status vs Condition */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("status")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer",
                activeTab === "status"
                  ? "bg-white text-[#101828] shadow-2xs font-bold"
                  : "text-[#64748B] hover:text-[#101828]"
              )}
            >
              Care Status
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("condition")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer",
                activeTab === "condition"
                  ? "bg-white text-[#101828] shadow-2xs font-bold"
                  : "text-[#64748B] hover:text-[#101828]"
              )}
            >
              Clinical Acuity
            </button>
          </div>
        </div>

        {/* Acuity / Admission Quick Badges */}
        <div className="grid grid-cols-2 gap-2.5 pt-4">
          <div className="p-3 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2F65F6]/10 text-[#2F65F6] flex items-center justify-center shrink-0 font-bold">
              <BedDouble className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase text-[#64748B] truncate">
                Admitted
              </p>
              <p className="text-sm font-bold text-[#101828]">
                {admittedCount}{" "}
                <span className="text-[10px] font-normal text-[#64748B]">
                  ({totalPatients > 0 ? Math.round((admittedCount / totalPatients) * 100) : 0}%)
                </span>
              </p>
            </div>
          </div>

          <div className={cn(
            "p-3 rounded-2xl border flex items-center gap-2.5",
            criticalCount > 0
              ? "bg-[#FEF2F2] border-[#FEE2E2]"
              : "bg-[#F8FAFC] border-[#E2E8F0]"
          )}>
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold",
              criticalCount > 0
                ? "bg-red-100 text-red-600"
                : "bg-slate-100 text-slate-500"
            )}>
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase text-[#64748B] truncate">
                Critical Care
              </p>
              <p className={cn("text-sm font-bold", criticalCount > 0 ? "text-red-700" : "text-[#101828]")}>
                {criticalCount}{" "}
                <span className="text-[10px] font-normal text-[#64748B]">
                  ({totalPatients > 0 ? Math.round((criticalCount / totalPatients) * 100) : 0}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Center Donut Visualizer & Stats */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Donut Chart Container */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-[#E2E8F0] text-xs">
                            <span className="font-bold text-[#101828] block">
                              {data.name}
                            </span>
                            <span className="text-[#64748B]">
                              {data.count} patients ({data.percentage}%)
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={activeChartData}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={44}
                    outerRadius={64}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {activeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* Inner Center KPI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-[#101828] tracking-tight">
                {totalPatients}
              </span>
              <span className="text-[10px] font-semibold uppercase text-[#64748B] tracking-wider">
                Patients
              </span>
            </div>
          </div>

          {/* Detailed Metric List */}
          <div className="flex-1 w-full space-y-2">
            {activeChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-[#1E293B] truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right shrink-0">
                  <span className="font-bold text-[#101828]">
                    {item.count}
                  </span>
                  <span className="text-[11px] text-[#64748B] w-8">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Callout & Link */}
      <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#64748B]">
          <Users className="w-3.5 h-3.5 text-[#2F65F6]" />
          <span>Active Patient Census</span>
        </div>
        <Link
          href="/patients"
          className="inline-flex items-center gap-1 text-[#2F65F6] hover:text-[#1E4FD8] font-bold hover:underline transition-colors"
        >
          <span>View Roster</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
