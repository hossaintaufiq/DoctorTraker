"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PATIENT_CONDITIONS_DATA } from "@/lib/mock-data";

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomPieTooltip = ({ active, payload }: CustomPieTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl border border-[#E8EDF3] popover-shadow text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-bold text-[#172B4D]">{data.name}</span>
        </div>
        <p className="text-[#7A8798]">
          <span className="font-semibold text-[#243247]">{data.value.toLocaleString()}</span> patients ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export function PatientConditionsChart() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
          Patient Conditions
        </h3>
        <p className="text-xs text-[#7A8798] mt-0.5">
          Overview of patient condition categories
        </p>
      </div>

      {/* Donut Chart with Center Total */}
      <div className="relative w-full h-[190px] sm:h-[210px] my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomPieTooltip />} />
            <Pie
              data={PATIENT_CONDITIONS_DATA}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={4}
              dataKey="value"
            >
              {PATIENT_CONDITIONS_DATA.map((entry, index) => (
                <Cell key={`donut-cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg sm:text-xl font-bold text-[#172B4D] tracking-tight leading-none">
            2,846
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A8798] mt-0.5">
            Total Patients
          </span>
        </div>
      </div>

      {/* Compact Categorical Legend */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#F0F4F8]">
        {PATIENT_CONDITIONS_DATA.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/60"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-semibold text-[#243247] truncate">
                {item.name}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-[#172B4D]">
                {item.percentage}%
              </span>
              <span className="text-[10px] text-[#7A8798] block">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
