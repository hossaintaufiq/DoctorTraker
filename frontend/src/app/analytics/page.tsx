"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PatientArrivalChart } from "@/components/dashboard/PatientArrivalChart";
import { MetricCardsGrid } from "@/components/dashboard/MetricCardsGrid";
import { TrendingUp, BarChart2, PieChart, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppShell breadcrumbTitle="Analytics & Reports" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-2">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
            Hospital Analytics & Operational Reports
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time patient intake trends, clinical volume patterns, and financial diagnostics.
          </p>
        </div>

        {/* Top Metric Cards */}
        <MetricCardsGrid />

        {/* Main Chart */}
        <PatientArrivalChart />
      </div>
    </AppShell>
  );
}
