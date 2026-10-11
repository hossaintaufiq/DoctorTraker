"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCardsGrid } from "@/components/dashboard/MetricCardsGrid";
import { PatientArrivalChart } from "@/components/dashboard/PatientArrivalChart";
import { PatientStatusBreakdownCard } from "@/components/dashboard/PatientStatusBreakdownCard";
import { DepartmentRevenueVolumeCard } from "@/components/dashboard/DepartmentRevenueVolumeCard";
import { AppointmentsSection } from "@/components/dashboard/AppointmentsSection";
import { OurSpecialistCard } from "@/components/dashboard/OurSpecialistCard";

export default function DashboardPage() {
  return (
    <AppShell breadcrumbTitle="Dashboard" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Welcome Header */}
        <DashboardHeader />

        {/* 4 Summary Metric Cards with Embedded Sparklines */}
        <MetricCardsGrid />

        {/* Clinical Operations Row: Patient Arrivals & Patient Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Patient Arrivals Trend (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col min-w-0">
            <PatientArrivalChart />
          </div>

          {/* Realtime Patient Status Breakdown (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col min-w-0">
            <PatientStatusBreakdownCard />
          </div>
        </div>

        {/* Hospital Economics & Medical Staff Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Realtime Departmental Revenue & Case Volume (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col min-w-0">
            <DepartmentRevenueVolumeCard />
          </div>

          {/* Our Specialists Overview (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col min-w-0">
            <OurSpecialistCard />
          </div>
        </div>

        {/* Scheduled Appointments Roster */}
        <div className="w-full">
          <AppointmentsSection />
        </div>
      </div>
    </AppShell>
  );
}
