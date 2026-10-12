"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";

const CONDITION_COLORS: Record<string, string> = {
  General: "#3B82F6",
  Chronic: "#F59E0B",
  Recovering: "#10B981",
  "Follow-up": "#8B5CF6",
  Critical: "#EF4444",
};

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
  const { data: dashboardData, isLoading } = useDashboard();

  const rawConditions = dashboardData?.conditionBreakdown || [];
  const totalPatients = dashboardData?.summary?.totalPatients || 0;

  const conditionsData = rawConditions.map((item: any) => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage,
    color: CONDITION_COLORS[item.name] || "#64748B",
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
          Patient Conditions
        </h3>
        <p className="text-xs text-[#7A8798] mt-0.5">
          Real clinical condition distribution across registered patients
        </p>
      </div>

      {isLoading ? (
        <div className="w-full h-[220px] flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-400">Loading conditions breakdown...</span>
        </div>
      ) : conditionsData.length === 0 ? (
        <div className="w-full h-[220px] flex items-center justify-center text-xs text-slate-400">
          No condition records available
        </div>
      ) : (
        <>
          {/* Donut Chart with Center Total Label */}
          <div className="relative w-full h-[200px] sm:h-[220px] my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={conditionsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={86}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {conditionsData.map((entry: any, index: number) => (
                    <Cell
                      key={`donut-cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Clean Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl sm:text-2xl font-bold text-[#172B4D] tracking-tight leading-none">
                {totalPatients.toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A8798] mt-1">
                Total Patients
              </span>
            </div>
          </div>

          {/* Categorical Legend Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-[#F0F4F8]">
            {conditionsData.map((item: any) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/70"
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
                  <span className="text-[10px] text-[#7A8798] block leading-none mt-0.5">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
