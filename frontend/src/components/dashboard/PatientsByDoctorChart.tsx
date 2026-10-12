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
import { ChevronRight } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

interface CustomBarTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomBarTooltip = ({ active, payload }: CustomBarTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl border border-[#E8EDF3] popover-shadow text-xs">
        <p className="font-bold text-[#172B4D]">{data.doctorName || data.name}</p>
        <p className="text-[11px] text-[#7A8798] mb-1.5">{data.specialty || "Specialist"}</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F9F9A]" />
          <span className="text-[#243247] font-semibold">{data.patientCount} Active Patients</span>
        </div>
      </div>
    );
  }
  return null;
};

export function PatientsByDoctorChart() {
  const { data: dashboardData, isLoading } = useDashboard();

  const patientsPerDoctor = dashboardData?.patientsPerDoctor || [];
  const topDoctors = patientsPerDoctor.slice(0, 6).map((doc: any) => ({
    name: doc.doctorName,
    specialty: doc.specialty,
    patientCount: doc.patientCount,
  }));

  const totalAssignedPatients = topDoctors.reduce((acc: number, d: any) => acc + (d.patientCount || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
            Patients by Doctor
          </h3>
          <p className="text-xs text-[#7A8798] mt-0.5">
            Real distribution across active medical specialists
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
      <div className="w-full h-[270px] sm:h-[300px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center animate-pulse">
            <span className="text-xs text-slate-400">Loading specialist distribution...</span>
          </div>
        ) : topDoctors.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            No patient assignment data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topDoctors}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 8, bottom: 5 }}
            >
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#7A8798", fontSize: 11 }}
                allowDecimals={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={120}
                tick={{ fill: "#243247", fontSize: 11, fontWeight: 500 }}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(241, 244, 249, 0.5)" }} />
              <Bar
                dataKey="patientCount"
                radius={[0, 6, 6, 0]}
                barSize={16}
              >
                {topDoctors.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#0F9F9A" : index === 1 ? "#13B6B0" : "#22C1BA"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Stats */}
      <div className="pt-3.5 border-t border-[#F0F4F8] flex items-center justify-between text-xs text-[#7A8798]">
        <span>Top specialists active load</span>
        <span className="font-semibold text-[#172B4D]">{totalAssignedPatients.toLocaleString()} Patients</span>
      </div>
    </div>
  );
}
