"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { cn } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl border border-[#E8EDF3] popover-shadow text-xs">
        <p className="font-bold text-[#172B4D] mb-1.5">{label}</p>
        <div className="flex items-center gap-2 text-[#243247]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F9F9A]" />
          <span className="text-[#7A8798]">Total Patients:</span>
          <span className="font-bold text-[#172B4D]">{data.patients.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-[#7A8798] mt-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A]" />
          <span>New Admissions:</span>
          <span className="font-semibold text-[#16A36A]">+{data.admissions}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function PatientGrowthChart() {
  const { growthPeriod, setGrowthPeriod, growthData } = useDoctorTracker();

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full">
      {/* Card Header with Title, Subtitle, and Monthly / Weekly Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
              Patient Growth
            </h3>
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#E6F7F6] text-[#0F9F9A]">
              +12.8% YTD
            </span>
          </div>
          <p className="text-xs text-[#7A8798] mt-0.5">
            Patient registrations over time
          </p>
        </div>

        {/* Period Selector: Monthly / Weekly */}
        <div className="flex items-center p-1 bg-[#F7F9FC] border border-[#E8EDF3] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setGrowthPeriod("Monthly")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-lg transition-all",
              growthPeriod === "Monthly"
                ? "bg-white text-[#0F9F9A] shadow-xs"
                : "text-[#7A8798] hover:text-[#243247]"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setGrowthPeriod("Weekly")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-lg transition-all",
              growthPeriod === "Weekly"
                ? "bg-white text-[#0F9F9A] shadow-xs"
                : "text-[#7A8798] hover:text-[#243247]"
            )}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[270px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={growthData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="patientGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F9F9A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0F9F9A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F0F4F8"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7A8798", fontSize: 11 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7A8798", fontSize: 11 }}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="patients"
              stroke="#0F9F9A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#patientGrowthGradient)"
              activeDot={{
                r: 5,
                fill: "#0F9F9A",
                stroke: "#FFFFFF",
                strokeWidth: 2.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subtle Legend / Contextual Footer */}
      <div className="pt-3.5 border-t border-[#F0F4F8] flex items-center justify-between text-xs text-[#7A8798]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F9F9A]" />
          <span>Active Patient Enrollees</span>
        </div>
        <span className="font-semibold text-[#172B4D]">Average +237 / month</span>
      </div>
    </div>
  );
}
