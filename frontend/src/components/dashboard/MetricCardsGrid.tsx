"use client";

import React, { useMemo } from "react";
import {
  Users,
  Calendar,
  Stethoscope,
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
} from "recharts";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export function MetricCardsGrid() {
  const { doctors, patients, appointments, invoices, showToast } = useDoctorTracker();

  // Dynamic values
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const activeDoctors = doctors.filter((d) => d.status === "Active").length;
  const totalDoctors = doctors.length;

  const totalRevenue = useMemo(() => {
    const sum = invoices.reduce(
      (acc, inv) => acc + (inv.status === "Paid" ? inv.total : inv.total * 0.7),
      0
    );
    return sum > 0 ? sum : 34250;
  }, [invoices]);

  // Dynamic sparkline curves derived from counts
  const patientWaveData = useMemo(() => [
    { day: "Sat", val: Math.max(1, Math.round(totalPatients * 0.2)) },
    { day: "Sun", val: Math.max(2, Math.round(totalPatients * 0.35)) },
    { day: "Mon", val: Math.max(2, Math.round(totalPatients * 0.28)) },
    { day: "Tue", val: Math.max(3, Math.round(totalPatients * 0.45)) },
    { day: "Wed", val: Math.max(2, totalPatients) },
  ], [totalPatients]);

  const appointmentBarsData = useMemo(() => {
    const base = Math.max(1, totalAppointments);
    return [
      { day: "1", val: Math.max(1, Math.round(base * 0.3)) },
      { day: "2", val: Math.max(1, Math.round(base * 0.45)) },
      { day: "3", val: Math.max(1, Math.round(base * 0.38)) },
      { day: "4", val: Math.max(1, Math.round(base * 0.55)) },
      { day: "5", val: Math.max(2, base), isTop: true },
      { day: "6", val: Math.max(1, Math.round(base * 0.5)) },
      { day: "7", val: Math.max(1, Math.round(base * 0.42)) },
      { day: "8", val: Math.max(1, Math.round(base * 0.58)) },
      { day: "9", val: Math.max(1, Math.round(base * 0.35)) },
      { day: "10", val: Math.max(1, Math.round(base * 0.45)) },
    ];
  }, [totalAppointments]);

  const revenueWaveData = useMemo(() => [
    { day: "Sat", val: Math.round(totalRevenue * 0.15) },
    { day: "Sun", val: Math.round(totalRevenue * 0.28) },
    { day: "Mon", val: Math.round(totalRevenue * 0.22) },
    { day: "Tue", val: Math.round(totalRevenue * 0.35) },
    { day: "Wed", val: Math.round(totalRevenue * 0.3) },
  ], [totalRevenue]);

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
              onClick={() => showToast("Patients Options", `${totalPatients} active patient records in MongoDB.`, "info")}
              className="text-[#94A3B8] hover:text-[#1E293B]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-[#101828]">{totalPatients}</span>
            <span className="text-[11px] text-[#94A3B8]">in database</span>
          </div>
        </div>

        {/* Mini Wave Chart with Badge */}
        <div className="relative mt-2">
          <div className="absolute left-[38%] top-0 -translate-y-1/2 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#2F65F6] text-white text-[9px] font-bold shadow-2xs">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>+100% live</span>
          </div>

          <div className="h-14 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientWaveData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
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
              <span className="text-xs font-bold text-[#101828]">Appointments</span>
            </div>
            <button
              type="button"
              onClick={() => showToast("Appointments", `${totalAppointments} active consultations booked.`, "info")}
              className="text-[#94A3B8] hover:text-[#1E293B]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-[#101828]">{totalAppointments}</span>
            <span className="text-[11px] text-[#94A3B8]">scheduled</span>
          </div>
        </div>

        {/* Mini Bar Chart with Active Blue Pillar */}
        <div className="relative mt-2">
          <div className="absolute left-[44%] -top-3 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#EBF3FE] text-[#2F65F6] text-[9px] font-bold border border-[#DCE8FC]">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>Active</span>
          </div>

          <div className="h-14 w-full flex items-end">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentBarsData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  {appointmentBarsData.map((entry, index) => (
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

      {/* Card 3: Active Specialists */}
      <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow card-shadow-hover flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center">
                <Stethoscope className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#101828]">Active Specialists</span>
            </div>
            <button
              type="button"
              onClick={() => showToast("Specialists", `${activeDoctors} of ${totalDoctors} doctors on active duty.`, "info")}
              className="text-[#94A3B8] hover:text-[#1E293B]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-[#101828]">{activeDoctors}</span>
            <span className="text-[11px] text-[#94A3B8]">/ {totalDoctors} registered</span>
          </div>
        </div>

        {/* Dynamic Capacity Progress */}
        <div className="relative mt-2 space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#64748B]">Staff Deployment</span>
            <div className="flex items-center gap-1 text-[#2F65F6] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F65F6]" />
              <span>{totalDoctors > 0 ? Math.round((activeDoctors / totalDoctors) * 100) : 100}% Active</span>
            </div>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-3 rounded-full bg-[#F1F5F9] overflow-hidden flex">
            <div
              className="bg-[#2F65F6] h-full transition-all duration-500"
              style={{ width: `${totalDoctors > 0 ? (activeDoctors / totalDoctors) * 100 : 100}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-[#94A3B8] pt-1">
            <span>On Duty</span>
            <span>Surgeries / On Leave</span>
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
              onClick={() => showToast("Financials", `Revenue tracked from ${invoices.length} invoices.`, "info")}
              className="text-[#94A3B8] hover:text-[#1E293B]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-[#101828]">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-[#94A3B8]">ledger balance</span>
          </div>
        </div>

        {/* Mini Revenue Wave with Floating Badge */}
        <div className="relative mt-2">
          <div className="absolute left-[56%] top-0 -translate-y-1/2 z-10 px-1.5 py-0.5 rounded-full bg-[#2F65F6] text-white text-[9px] font-bold shadow-2xs">
            ${Math.round(totalRevenue / 1000)}K
          </div>

          <div className="h-14 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueWaveData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
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
