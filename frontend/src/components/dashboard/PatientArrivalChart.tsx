"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceDot,
} from "recharts";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

const ARRIVAL_DATA = [
  { month: "Jan", inPatients: 220, outPatients: 140, total: 360 },
  { month: "Feb", inPatients: 250, outPatients: 170, total: 420 },
  { month: "Mar", inPatients: 240, outPatients: 160, total: 400 },
  { month: "Apr", inPatients: 380, outPatients: 230, total: 610, isTop: true },
  { month: "May", inPatients: 310, outPatients: 190, total: 500 },
  { month: "Jun", inPatients: 290, outPatients: 180, total: 470 },
  { month: "Jul", inPatients: 330, outPatients: 200, total: 530 },
  { month: "Aug", inPatients: 350, outPatients: 211, total: 561 },
  { month: "Sep", inPatients: 320, outPatients: 195, total: 515 },
  { month: "Oct", inPatients: 340, outPatients: 205, total: 545 },
];

export function PatientArrivalChart() {
  const { showToast } = useDoctorTracker();
  const [filterMonth, setFilterMonth] = useState("This Months");

  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#101828] tracking-tight">
            Patient Arrival Statistics
          </h3>
        </div>

        {/* Dropdown Pill */}
        <button
          type="button"
          onClick={() =>
            showToast("Arrival Filter", "Viewing stats for this month.", "info")
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F7FB] border border-[#EBF0F7] rounded-full text-xs font-semibold text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6] transition-all"
        >
          <span>{filterMonth}</span>
          <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
        </button>
      </div>

      {/* Main Stat Label */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-[#101828]">$54,24.05</span>
        <span className="text-xs text-[#94A3B8]">vs last week</span>
      </div>

      {/* Chart Canvas with Dual Curve and Active April Blue Pillar */}
      <div className="relative w-full h-[280px]">
        {/* Active Tooltip Popover Card over August / Top Peak */}
        <div className="absolute left-[38%] top-[14%] z-20 pointer-events-none transform -translate-x-1/2">
          {/* Top Black Pill Badge */}
          <div className="w-fit mx-auto mb-1.5 px-2 py-0.5 rounded-full bg-[#101828] text-white text-[10px] font-bold shadow-xs">
            Top
          </div>
        </div>

        {/* Static December-2025 Floating Card matching image */}
        <div className="absolute right-[32%] top-[12%] z-20 bg-white rounded-2xl border border-[#EBF0F7] popover-shadow p-3 text-xs pointer-events-none hidden md:block">
          <p className="font-bold text-[#101828] mb-1.5">December-2025</p>
          <div className="flex items-center justify-between gap-4 text-[11px] mb-1">
            <span className="text-[#64748B]">Patients: In</span>
            <span className="font-bold text-[#10B981]">350</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[11px]">
            <span className="text-[#64748B]">Patients: Out</span>
            <span className="font-bold text-[#EF4444]">211</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={ARRIVAL_DATA}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              {/* Pattern Striped Hatching Fill */}
              <pattern
                id="stripedPattern"
                width="8"
                height="8"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="#93C5FD"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              </pattern>
              <linearGradient id="solidPillar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F65F6" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              dy={6}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickFormatter={(v) => `$${Math.round(v / 10)}k`}
            />

            {/* Hatched Area Curve */}
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2F65F6"
              strokeWidth={2}
              fill="url(#stripedPattern)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
