"use client";

import React from "react";
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
} from "recharts";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

const PATIENT_WAVE_DATA = [
  { day: "Sat", val: 32 },
  { day: "Sun", val: 58 },
  { day: "Mon", val: 40 },
  { day: "Tue", val: 62 },
  { day: "Wed", val: 45 },
];

const APPOINTMENT_BARS_DATA = [
  { day: "1", val: 28 },
  { day: "2", val: 42 },
  { day: "3", val: 35 },
  { day: "4", val: 50 },
  { day: "5", val: 88, isTop: true },
  { day: "6", val: 45 },
  { day: "7", val: 38 },
  { day: "8", val: 52 },
  { day: "9", val: 30 },
  { day: "10", val: 40 },
];

const REVENUE_WAVE_DATA = [
  { day: "Sat", val: 12 },
  { day: "Sun", val: 35 },
  { day: "Mon", val: 24 },
  { day: "Tue", val: 48 },
  { day: "Wed", val: 42 },
];

export function MetricCardsGrid() {
  const { metrics, showToast } = useDoctorTracker();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
      {/* Card 1: Total Patients */}
      <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow card-shadow-hover flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#101828]">Total Patients</span>
            </div>
            <button
              type="button"
              onClick={() => showToast("Patients Options", "Filter patient records.", "info")}
              className="text-[#94A3B8] hover:text-[#1E293B]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-[#101828]">148</span>
            <span className="text-[11px] text-[#94A3B8]">vs last week</span>
          </div>
        </div>

        {/* Mini Wave Chart with Badge */}
        <div className="relative mt-2">
          {/* Floating +24% Pill Badge */}
          <div className="absolute left-[38%] top-0 -translate-y-1/2 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#2F65F6] text-white text-[9px] font-bold shadow-2xs">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>+24%</span>
          </div>

          <div className="h-14 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PATIENT_WAVE_DATA} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueWave1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F65F6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2F65F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#2F65F6"
                  strokeWidth={2}
                  fill="url(#blueWave1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[10px] text-[#94A3B8] pt-1 border-t border-[#F1F5F9]">
            <span>Sat</span>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
          </div>
        </div>
      </div>

      {/* Card 2: Appointments Today */}
      <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow card-shadow-hover flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#101828]">Appointments Today</span>
            </div>
            <button
              type="button"
              onClick={() => showToast("Appointments", "View appointment slots.", "info")}
              className="text-[#94A3B8] hover:text-[#1E293B]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-[#101828]">96</span>
            <span className="text-[11px] text-[#94A3B8]">vs last week</span>
          </div>
        </div>

        {/* Mini Bar Chart with Active Blue Pillar */}
        <div className="relative mt-2">
          {/* Floating +14% Pill Badge */}
          <div className="absolute left-[44%] -top-3 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#EBF3FE] text-[#2F65F6] text-[9px] font-bold border border-[#DCE8FC]">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>+14%</span>
          </div>

          <div className="h-14 w-full flex items-end">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={APPOINTMENT_BARS_DATA} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  {APPOINTMENT_BARS_DATA.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.isTop ? "#2F65F6" : "#E2E8F0"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#94A3B8] pt-1 border-t border-[#F1F5F9]">
            <span className="px-1.5 py-0.2 rounded bg-[#101828] text-white text-[9px]">Ave</span>
            <span>Optimal capacity</span>
          </div>
        </div>
      </div>

      {/* Card 3: Pending Reports */}
      <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow card-shadow-hover flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#101828]">Pending Reports</span>
            </div>
            <button
              type="button"
              onClick={() => showToast("Reports", "Lab diagnostics pending.", "info")}
              className="text-[#94A3B8] hover:text-[#1E293B]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-[#101828]">96</span>
            <span className="text-[11px] text-[#94A3B8]">vs last week</span>
          </div>
        </div>

        {/* 3-Segment Horizontal Progress with Pill */}
        <div className="relative mt-2 space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#64748B]">Total Pending</span>
            <div className="flex items-center gap-1 text-[#2F65F6] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F65F6]" />
              <span>Lab Reports (+48%)</span>
            </div>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-3 rounded-full bg-[#F1F5F9] overflow-hidden flex">
            <div className="bg-[#1E4FD8] h-full" style={{ width: "38%" }} />
            <div className="bg-[#2F65F6] h-full" style={{ width: "32%" }} />
            <div className="bg-[#93C5FD] h-full" style={{ width: "30%" }} />
          </div>

          <div className="flex justify-between text-[10px] text-[#94A3B8] pt-1">
            <span>Blood test</span>
            <span>[X-ray / MRI]</span>
          </div>
        </div>
      </div>

      {/* Card 4: Total Revenue */}
      <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow card-shadow-hover flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#101828]">Total Revenue</span>
            </div>
            <button
              type="button"
              onClick={() => showToast("Financials", "Billing & ledger summary.", "info")}
              className="text-[#94A3B8] hover:text-[#1E293B]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-[#101828]">$54,24.05</span>
            <span className="text-[11px] text-[#94A3B8]">vs last week</span>
          </div>
        </div>

        {/* Mini Revenue Wave with $32K Floating Tooltip */}
        <div className="relative mt-2">
          {/* Floating $32K Badge */}
          <div className="absolute left-[56%] top-0 -translate-y-1/2 z-10 px-1.5 py-0.5 rounded-full bg-[#2F65F6] text-white text-[9px] font-bold shadow-2xs">
            $32K
          </div>

          <div className="h-14 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_WAVE_DATA} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueWaveRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F65F6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2F65F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#2F65F6"
                  strokeWidth={2}
                  fill="url(#blueWaveRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[10px] text-[#94A3B8] pt-1 border-t border-[#F1F5F9]">
            <span>Sat</span>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
