"use client";

import React, { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Activity,
  Calendar,
  Download,
  Users,
  BedDouble,
  DollarSign,
  HeartPulse,
  Clock,
  Award,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Date-based mock datasets for different periods
const TIME_SERIES_DATA: Record<string, { label: string; admissions: number; discharges: number; revenue: number; waitMinutes: number }[]> = {
  "7D": [
    { label: "Mon", admissions: 42, discharges: 38, revenue: 14200, waitMinutes: 14 },
    { label: "Tue", admissions: 56, discharges: 48, revenue: 18500, waitMinutes: 18 },
    { label: "Wed", admissions: 68, discharges: 52, revenue: 22400, waitMinutes: 22 },
    { label: "Thu", admissions: 62, discharges: 59, revenue: 21000, waitMinutes: 16 },
    { label: "Fri", admissions: 74, discharges: 65, revenue: 26800, waitMinutes: 24 },
    { label: "Sat", admissions: 48, discharges: 42, revenue: 16500, waitMinutes: 12 },
    { label: "Sun", admissions: 36, discharges: 34, revenue: 12900, waitMinutes: 10 },
  ],
  "30D": [
    { label: "Week 1", admissions: 280, discharges: 260, revenue: 98000, waitMinutes: 16 },
    { label: "Week 2", admissions: 340, discharges: 310, revenue: 118000, waitMinutes: 19 },
    { label: "Week 3", admissions: 395, discharges: 365, revenue: 142000, waitMinutes: 21 },
    { label: "Week 4", admissions: 420, discharges: 390, revenue: 156000, waitMinutes: 17 },
  ],
  "90D": [
    { label: "Month 1", admissions: 1350, discharges: 1280, revenue: 480000, waitMinutes: 18 },
    { label: "Month 2", admissions: 1520, discharges: 1440, revenue: 540000, waitMinutes: 17 },
    { label: "Month 3", admissions: 1680, discharges: 1610, revenue: 610000, waitMinutes: 16 },
  ],
  "1Y": [
    { label: "Jan", admissions: 1200, discharges: 1150, revenue: 420000, waitMinutes: 18 },
    { label: "Feb", admissions: 1320, discharges: 1260, revenue: 460000, waitMinutes: 17 },
    { label: "Mar", admissions: 1450, discharges: 1390, revenue: 510000, waitMinutes: 19 },
    { label: "Apr", admissions: 1400, discharges: 1360, revenue: 490000, waitMinutes: 16 },
    { label: "May", admissions: 1580, discharges: 1510, revenue: 560000, waitMinutes: 20 },
    { label: "Jun", admissions: 1620, discharges: 1570, revenue: 580000, waitMinutes: 18 },
    { label: "Jul", admissions: 1750, discharges: 1690, revenue: 620000, waitMinutes: 22 },
    { label: "Aug", admissions: 1690, discharges: 1630, revenue: 605000, waitMinutes: 19 },
    { label: "Sep", admissions: 1820, discharges: 1750, revenue: 645000, waitMinutes: 17 },
    { label: "Oct", admissions: 1940, discharges: 1880, revenue: 690000, waitMinutes: 16 },
  ],
};

const DEPARTMENT_METRICS = [
  { name: "Cardiology", revenue: 148000, patients: 420, capacityPct: 88, color: "#2F65F6" },
  { name: "Neurology", revenue: 112000, patients: 310, capacityPct: 74, color: "#9333EA" },
  { name: "Orthopedics", revenue: 96000, patients: 280, capacityPct: 68, color: "#059669" },
  { name: "Pediatrics", revenue: 84000, patients: 390, capacityPct: 92, color: "#D97706" },
  { name: "Emergency", revenue: 132000, patients: 580, capacityPct: 96, color: "#EF4444" },
  { name: "Radiology", revenue: 78000, patients: 340, capacityPct: 62, color: "#0284C7" },
];

const CONDITION_DISTRIBUTION = [
  { name: "Recovered", value: 42, color: "#10B981" },
  { name: "Stable Inpatient", value: 31, color: "#2F65F6" },
  { name: "In Active Treatment", value: 18, color: "#F59E0B" },
  { name: "Critical ICU", value: 9, color: "#EF4444" },
];

const HOURLY_INFLOW = [
  { hour: "06:00", patients: 8, waitMin: 6 },
  { hour: "08:00", patients: 24, waitMin: 12 },
  { hour: "10:00", patients: 48, waitMin: 22 },
  { hour: "12:00", patients: 38, waitMin: 18 },
  { hour: "14:00", patients: 42, waitMin: 19 },
  { hour: "16:00", patients: 36, waitMin: 15 },
  { hour: "18:00", patients: 28, waitMin: 11 },
  { hour: "20:00", patients: 19, waitMin: 9 },
  { hour: "22:00", patients: 12, waitMin: 7 },
];

export default function AnalyticsPage() {
  const { doctors, departments, showToast } = useDoctorTracker();
  const [period, setPeriod] = useState<"7D" | "30D" | "90D" | "1Y">("30D");

  const currentDataset = TIME_SERIES_DATA[period];

  const totalAdmissions = useMemo(
    () => currentDataset.reduce((sum, d) => sum + d.admissions, 0),
    [currentDataset]
  );
  const totalDischarges = useMemo(
    () => currentDataset.reduce((sum, d) => sum + d.discharges, 0),
    [currentDataset]
  );
  const totalPeriodRevenue = useMemo(
    () => currentDataset.reduce((sum, d) => sum + d.revenue, 0),
    [currentDataset]
  );
  const avgWaitTime = useMemo(
    () =>
      Math.round(
        currentDataset.reduce((sum, d) => sum + d.waitMinutes, 0) / currentDataset.length
      ),
    [currentDataset]
  );

  const handleExportReport = () => {
    const headers = ["Period Label", "Admissions", "Discharges", "Revenue ($)", "Avg Wait (Mins)"];
    const rows = currentDataset.map((d) => [
      d.label,
      d.admissions,
      d.discharges,
      d.revenue,
      d.waitMinutes,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital_analytics_${period}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Analytics Exported", `Downloaded aggregated report for ${period}.`, "success");
  };

  return (
    <AppShell breadcrumbTitle="Analytics & Reports" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Top Header & Period Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Analytics & Operational Insights
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Data visualization suite with clean aggregations, real-time clinical intake, and departmental metrics.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
            {/* Period Pills */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200 shadow-2xs">
              {(["7D", "30D", "90D", "1Y"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer",
                    period === p
                      ? "bg-[#2F65F6] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportReport}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs transition-all cursor-pointer ml-auto sm:ml-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Aggregated KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-semibold uppercase truncate">Total Admissions</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 text-[#2F65F6] flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#101828] mt-1.5 sm:mt-2 truncate">
              {totalAdmissions.toLocaleString()} Cases
            </p>
            <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 mt-1 truncate">
              <ArrowUpRight className="w-3 h-3 shrink-0" /> +14.2% vs prev period
            </span>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-semibold uppercase truncate">Period Revenue</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#10B981] mt-1.5 sm:mt-2 truncate">
              ${totalPeriodRevenue.toLocaleString()}
            </p>
            <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 mt-1 truncate">
              <ArrowUpRight className="w-3 h-3 shrink-0" /> +18.6% clinical growth
            </span>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-semibold uppercase truncate">Avg Triage Wait</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#101828] mt-1.5 sm:mt-2 truncate">{avgWaitTime} Minutes</p>
            <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 mt-1 truncate">
              -4 mins improvement
            </span>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-semibold uppercase truncate">Discharge Ratio</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#9333EA] mt-1.5 sm:mt-2 truncate">
              {Math.round((totalDischarges / (totalAdmissions || 1)) * 100)}%
            </p>
            <span className="text-[10px] text-[#64748B] mt-1 block truncate">
              {totalDischarges.toLocaleString()} total discharged
            </span>
          </div>
        </div>

        {/* Charts Row 1: Area Trend + Bar Department Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Area Trend Chart (8 cols) */}
          <div className="lg:col-span-8 min-w-0 bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-4 sm:p-6 card-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#101828]">
                  Patient Admissions & Discharges Trend ({period})
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Clean date-aggregated trajectory with volume comparisons.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs shrink-0">
                <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F65F6]" /> Admissions
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Discharges
                </span>
              </div>
            </div>

            <div className="h-[220px] sm:h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentDataset}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2F65F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2F65F6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDischarges" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="admissions"
                    name="Admissions"
                    stroke="#2F65F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAdmissions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="discharges"
                    name="Discharges"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorDischarges)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnosis Condition Donut Chart (4 cols) */}
          <div className="lg:col-span-4 min-w-0 bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-4 sm:p-6 card-shadow space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#101828]">Patient Status Breakdown</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Distribution across care states.</p>
            </div>

            <div className="h-[180px] sm:h-[200px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CONDITION_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {CONDITION_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}% of Patients`, "Share"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg sm:text-xl font-bold text-slate-900">100%</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">Inpatients</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              {CONDITION_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium truncate text-[11px] sm:text-xs">{item.name}</span>
                  <span className="font-bold text-slate-900 ml-auto text-[11px] sm:text-xs">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Department Revenue Bars + Hourly Intake Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Department Revenue & Cases Bar Chart (7 cols) */}
          <div className="lg:col-span-7 min-w-0 bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-4 sm:p-6 card-shadow space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#101828]">
                Departmental Revenue & Case Volumes
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Financial contribution and patient load by clinical unit.
              </p>
            </div>

            <div className="h-[220px] sm:h-[260px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DEPARTMENT_METRICS}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      name === "revenue" ? `$${Number(value).toLocaleString()}` : `${value} Patients`,
                      name === "revenue" ? "Total Revenue" : "Patients Treated",
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "14px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" name="revenue" fill="#2F65F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Inflow & Wait Times Line Chart (5 cols) */}
          <div className="lg:col-span-5 min-w-0 bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-4 sm:p-6 card-shadow space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#101828]">Daily Triage Inflow & Wait Times</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Hourly patient arrivals and clinic queue duration (mins).
              </p>
            </div>

            <div className="h-[220px] sm:h-[260px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={HOURLY_INFLOW}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    name="Patient Arrivals"
                    stroke="#2F65F6"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="waitMin"
                    name="Wait Time (Mins)"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Specialists & Performance Leaderboard */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-4 sm:p-6 card-shadow space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#101828]">
              Top Attending Specialists & Clinical Utilization
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Consultant productivity, patient satisfaction index, and active rounds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {doctors.slice(0, 4).map((doc, idx) => (
              <div
                key={doc.id || (doc as any)._id || `analytics-doc-${idx}`}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2F65F6] border border-blue-100">
                      Rank #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      &starf; {doc.rating || 4.9}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#101828] mt-2 sm:mt-2.5 truncate">{doc.name}</h4>
                  <p className="text-xs text-[#2F65F6] font-medium truncate">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-400 truncate">{doc.hospital}</p>
                </div>

                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] sm:text-xs">Active Patients:</span>
                  <span className="font-bold text-slate-900">{doc.patientCount || 24}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
