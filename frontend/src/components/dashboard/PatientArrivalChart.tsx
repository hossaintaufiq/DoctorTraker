"use client";

import React, { useState } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";

const PERIOD_OPTIONS: Array<{ label: string; value: "7d" | "30d" | "90d" | "ytd" }> = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "YTD", value: "ytd" },
];

export function PatientArrivalChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "ytd">("30d");
  const { data: dashboardData, isLoading, isError, refetch } = useDashboard({ period: selectedPeriod });

  const arrivalTrends = dashboardData?.arrivalTrends || [];
  const currentTotal = dashboardData?.changes?.currentPatientsInRange ?? arrivalTrends.reduce((acc: number, item: any) => acc + (item.total || 0), 0);
  const changePercent = dashboardData?.changes?.arrivalsChangePercent;
  const inPatientsCount = dashboardData?.summary?.admittedPatientsCount ?? 0;
  const totalPatients = dashboardData?.summary?.totalPatients ?? 0;
  const outPatientsCount = Math.max(0, totalPatients - inPatientsCount);

  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#101828] tracking-tight">
              Patient Arrival Statistics
            </h3>
            <p className="text-xs text-[#64748B]">Real-time clinical intake telemetry</p>
          </div>
        </div>

        {/* Real Period Selector that drives request */}
        <div className="flex items-center bg-[#F4F7FB] p-1 rounded-xl border border-[#EBF0F7] gap-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedPeriod(opt.value)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedPeriod === opt.value
                  ? "bg-white text-[#2F65F6] shadow-sm"
                  : "text-[#64748B] hover:text-[#101828]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stat & Real Calculated Period Change */}
      <div className="flex flex-wrap items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-[#101828]">
          {isLoading ? (
            <span className="inline-block w-16 h-8 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            currentTotal.toLocaleString()
          )}
        </span>
        <span className="text-xs text-[#64748B] font-medium">
          New Patient Registrations
        </span>
        {typeof changePercent === "number" && !isNaN(changePercent) && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-1 ${
              changePercent >= 0
                ? "text-[#10B981] bg-[#ECFDF5]"
                : "text-[#EF4444] bg-[#FEF2F2]"
            }`}
          >
            {changePercent >= 0 ? `+${changePercent}%` : `${changePercent}%`} vs prior period
          </span>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full h-[280px]">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-[#2F65F6] border-t-transparent animate-spin mb-2" />
            <span className="text-xs text-slate-400">Loading arrival telemetry...</span>
          </div>
        ) : isError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-center">
            <AlertCircle className="w-6 h-6 text-rose-500 mb-2" />
            <p className="text-xs font-semibold text-rose-700">Failed to load arrival statistics</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 px-3 py-1 text-xs font-medium bg-white text-rose-600 rounded-lg border border-rose-200 hover:bg-rose-50 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : arrivalTrends.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-4 text-center">
            <Calendar className="w-6 h-6 text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No arrivals recorded in this timeframe</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Select a wider period or register new patients.</p>
          </div>
        ) : (
          <>
            {/* Live active cohort pills */}
            <div className="absolute right-4 top-2 z-20 bg-white/90 backdrop-blur-md rounded-2xl border border-[#EBF0F7] popover-shadow p-3 text-xs pointer-events-none hidden md:block">
              <p className="font-bold text-[#101828] mb-1.5">Active Cohort Summary</p>
              <div className="flex items-center justify-between gap-4 text-[11px] mb-1">
                <span className="text-[#64748B]">In-Patients (Admitted):</span>
                <span className="font-bold text-[#10B981]">{inPatientsCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[11px]">
                <span className="text-[#64748B]">Out-Patients:</span>
                <span className="font-bold text-[#2F65F6]">{outPatientsCount}</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={arrivalTrends}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="arrivalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F65F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2F65F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  dy={6}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  allowDecimals={false}
                />

                <Tooltip
                  formatter={(value: any) => [`${value} Patients`, "Registrations"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #EBF0F7",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                    fontSize: "12px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2F65F6"
                  strokeWidth={2.5}
                  fill="url(#arrivalColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}
