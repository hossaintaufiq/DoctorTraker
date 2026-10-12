"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Building2,
  DollarSign,
  BriefcaseMedical,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Baseline benchmark revenues by department specialty
const DEPARTMENT_BASE_REVENUE: Record<string, number> = {
  Cardiology: 148500,
  "Neurology & Neurosurgery": 118200,
  Neurology: 118200,
  "Pediatrics & Neonatology": 86400,
  Pediatrics: 86400,
  "Orthopedics & Joint Clinic": 98600,
  Orthopedics: 98600,
  "Emergency & Trauma Unit": 136000,
  "Emergency & Trauma": 136000,
  Emergency: 136000,
  "Oncology & Infusion Care": 124500,
  Oncology: 124500,
  "General Medicine": 72000,
  "Radiology & Imaging": 65000,
};

export function DepartmentRevenueVolumeCard() {
  const { departments, invoices, appointments } = useDoctorTracker();
  const [metricView, setMetricView] = useState<"combined" | "revenue" | "volume">("combined");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute departmental metrics dynamically from active invoices and appointments
  const departmentalData = useMemo(() => {
    // 6 primary units
    const baseUnits = departments.length > 0 ? departments : [
      { id: "dept-1", name: "Cardiology", code: "CARD", activeCasesCount: 342, totalBeds: 45, occupiedBeds: 38, occupancyPercentage: 84 },
      { id: "dept-2", name: "Neurology", code: "NEUR", activeCasesCount: 286, totalBeds: 35, occupiedBeds: 28, occupancyPercentage: 80 },
      { id: "dept-3", name: "Pediatrics", code: "PED", activeCasesCount: 245, totalBeds: 30, occupiedBeds: 26, occupancyPercentage: 87 },
      { id: "dept-4", name: "Orthopedics", code: "ORTH", activeCasesCount: 218, totalBeds: 28, occupiedBeds: 22, occupancyPercentage: 78 },
      { id: "dept-5", name: "Emergency", code: "EMER", activeCasesCount: 412, totalBeds: 25, occupiedBeds: 24, occupancyPercentage: 96 },
      { id: "dept-6", name: "Oncology", code: "ONCO", activeCasesCount: 176, totalBeds: 20, occupiedBeds: 15, occupancyPercentage: 75 },
    ];

    return baseUnits.slice(0, 6).map((dept, index) => {
      // Find extra revenue from invoices billed to this department
      const extraInvoiceRev = invoices
        .filter((inv: any) =>
          inv.items?.some((item: any) =>
            item.department?.toLowerCase().includes(dept.name.toLowerCase().split(" ")[0])
          )
        )
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

      // Extra cases from appointments for this department
      const aptCount = appointments.filter((apt: any) =>
        apt.doctorSpecialty?.toLowerCase().includes(dept.name.toLowerCase().split(" ")[0])
      ).length;

      const baseRev = DEPARTMENT_BASE_REVENUE[dept.name] || 82000;
      const totalRevenue = Math.round(baseRev + extraInvoiceRev * 15);
      const totalCases = (dept.activeCasesCount || 180) + aptCount * 4;
      const avgRevenuePerCase = Math.round(totalRevenue / Math.max(1, totalCases));

      // Clean short name for charts
      const shortName = dept.name
        .replace(" & Neurosurgery", "")
        .replace(" & Neonatology", "")
        .replace(" & Joint Clinic", "")
        .replace(" & Trauma Unit", "")
        .replace(" & Infusion Care", "");

      const uniqueId = dept.id || (dept as any)._id?.toString?.() || dept.name || `dept-${index}`;

      return {
        id: uniqueId,
        name: dept.name,
        shortName,
        revenue: totalRevenue,
        revenueInK: Math.round(totalRevenue / 1000),
        cases: totalCases,
        occupancy: dept.occupancyPercentage || 80,
        avgTicket: avgRevenuePerCase,
      };
    });
  }, [departments, invoices, appointments]);

  // Aggregate totals
  const totalRevenue = useMemo(
    () => departmentalData.reduce((sum: number, d: any) => sum + d.revenue, 0),
    [departmentalData]
  );

  const totalCases = useMemo(
    () => departmentalData.reduce((sum: number, d: any) => sum + d.cases, 0),
    [departmentalData]
  );

  const avgCaseValue = useMemo(
    () => (totalCases > 0 ? Math.round(totalRevenue / totalCases) : 0),
    [totalRevenue, totalCases]
  );

  const topDepartment = useMemo(() => {
    return [...departmentalData].sort((a, b) => b.revenue - a.revenue)[0];
  }, [departmentalData]);

  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full transition-all">
      <div>
        {/* Header with Title, Live Badge & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#101828] tracking-tight">
                  Departmental Revenue & Case Volume
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#2F65F6] border border-[#BFDBFE]">
                  <Activity className="w-2.5 h-2.5 text-[#2F65F6] animate-pulse" />
                  REALTIME
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Financial yield vs. inpatient & outpatient clinical encounters
              </p>
            </div>
          </div>

          {/* View Mode Switcher Pills */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMetricView("combined")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer",
                metricView === "combined"
                  ? "bg-white text-[#101828] shadow-2xs font-bold"
                  : "text-[#64748B] hover:text-[#101828]"
              )}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setMetricView("revenue")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer",
                metricView === "revenue"
                  ? "bg-white text-[#101828] shadow-2xs font-bold"
                  : "text-[#64748B] hover:text-[#101828]"
              )}
            >
              Revenue ($)
            </button>
            <button
              type="button"
              onClick={() => setMetricView("volume")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer",
                metricView === "volume"
                  ? "bg-white text-[#101828] shadow-2xs font-bold"
                  : "text-[#64748B] hover:text-[#101828]"
              )}
            >
              Volume (#)
            </button>
          </div>
        </div>

        {/* 3 Summary KPIs Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4">
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
              <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-semibold">Total Unit Revenue</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#101828]">
                ${(totalRevenue / 1000).toFixed(1)}k
              </span>
              <span className="text-[11px] font-semibold text-[#10B981]">
                +14.2% YoY
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
              <BriefcaseMedical className="w-3.5 h-3.5 text-[#2F65F6]" />
              <span className="font-semibold">Clinical Case Volume</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#101828]">
                {totalCases.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">
                Active Encounters
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="font-semibold">Yield / Case</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#101828]">
                ${avgCaseValue}
              </span>
              <span className="text-[11px] font-semibold text-[#2F65F6] truncate">
                Top: {topDepartment?.shortName}
              </span>
            </div>
          </div>
        </div>

        {/* Dual Bar Chart Canvas */}
        <div className="w-full h-[250px] relative">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentalData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                barGap={6}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="shortName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="revenue"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 10 }}
                  tickFormatter={(val) => `$${val}k`}
                />
                {metricView === "combined" && (
                  <YAxis
                    yAxisId="cases"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 10 }}
                    tickFormatter={(val) => `${val}`}
                  />
                )}
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-[#E2E8F0] text-xs space-y-1.5">
                          <p className="font-bold text-[#101828] text-sm border-b border-[#F1F5F9] pb-1">
                            {data.name}
                          </p>
                          <div className="flex items-center justify-between gap-4 text-xs">
                            <span className="text-[#64748B] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#2F65F6]" />
                              Billed Revenue:
                            </span>
                            <span className="font-bold text-[#101828]">
                              ${data.revenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-xs">
                            <span className="text-[#64748B] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                              Case Volume:
                            </span>
                            <span className="font-bold text-[#101828]">
                              {data.cases} cases
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-[11px] text-[#64748B] pt-1 border-t border-[#F1F5F9]">
                            <span>Avg Yield / Case:</span>
                            <span className="font-semibold text-[#2F65F6]">
                              ${data.avgTicket}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-[11px] text-[#64748B]">
                            <span>Bed Occupancy:</span>
                            <span className="font-semibold text-emerald-600">
                              {data.occupancy}%
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {(metricView === "combined" || metricView === "revenue") && (
                  <Bar
                    yAxisId="revenue"
                    dataKey="revenueInK"
                    name="Revenue ($k)"
                    fill="#2F65F6"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                )}
                {(metricView === "combined" || metricView === "volume") && (
                  <Bar
                    yAxisId={metricView === "combined" ? "cases" : "revenue"}
                    dataKey="cases"
                    name="Case Volume"
                    fill="#10B981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Mini Departmental Progress Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3">
          {departmentalData.slice(0, 3).map((dept: any, index: number) => (
            <div
              key={dept.id || dept.name || `dept-card-${index}`}
              className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#101828] truncate">
                  {dept.shortName}
                </span>
                <span className="text-[11px] font-bold text-[#2F65F6]">
                  ${(dept.revenue / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#64748B]">
                <span>{dept.cases} Cases</span>
                <span className="text-emerald-600 font-semibold">{dept.occupancy}% Bed Cap</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs mt-3">
        <div className="flex items-center gap-1.5 text-[#64748B]">
          <Layers className="w-3.5 h-3.5 text-[#2F65F6]" />
          <span>Clinical Capacity & Billing Yield</span>
        </div>
        <Link
          href="/departments"
          className="inline-flex items-center gap-1 text-[#2F65F6] hover:text-[#1E4FD8] font-bold hover:underline transition-colors"
        >
          <span>Department Directory</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
