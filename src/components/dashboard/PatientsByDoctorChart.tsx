"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TOP_DOCTORS_DISTRIBUTION } from "@/lib/mock-data";
import { ChevronRight } from "lucide-react";

interface CustomBarTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomBarTooltip = ({ active, payload }: CustomBarTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl border border-[#E8EDF3] popover-shadow text-xs">
        <p className="font-bold text-[#172B4D]">{data.name}</p>
        <p className="text-[11px] text-[#7A8798] mb-1.5">{data.specialty}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0F9F9A]" />
          <span className="text-[#243247] font-semibold">{data.patients} Assigned Patients</span>
        </div>
      </div>
    );
  }
  return null;
};

export function PatientsByDoctorChart() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
            Patients by Doctor
          </h3>
          <p className="text-xs text-[#7A8798] mt-0.5">
            Distribution across top doctors
          </p>
        </div>

        <Link
          href="/doctors"
          className="text-xs font-semibold text-[#0F9F9A] hover:text-[#0B7F7A] inline-flex items-center gap-0.5 hover:underline"
        >
          <span>View all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="w-full h-[260px] sm:h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={TOP_DOCTORS_DISTRIBUTION}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7A8798", fontSize: 11 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={110}
              tick={{ fill: "#243247", fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(241, 244, 249, 0.6)" }} />
            <Bar
              dataKey="patients"
              radius={[0, 6, 6, 0]}
              barSize={16}
            >
              {TOP_DOCTORS_DISTRIBUTION.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#0F9F9A" : index === 1 ? "#13B6B0" : "#2EC4B6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats summary */}
      <div className="pt-3 border-t border-[#F0F4F8] flex items-center justify-between text-xs text-[#7A8798]">
        <span>Top 5 account for 43.8% of total volume</span>
        <span className="font-semibold text-[#172B4D]">1,247 Pts</span>
      </div>
    </div>
  );
}
