"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCardsGrid } from "@/components/dashboard/MetricCardsGrid";
import { PatientArrivalChart } from "@/components/dashboard/PatientArrivalChart";
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

        {/* Main Content: Left Analytics & Appointments | Right Our Specialist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Patient Arrival Stats & Appointments */}
          <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
            <PatientArrivalChart />
            <AppointmentsSection />
          </div>

          {/* Right Column (4 cols): Our Specialist Card */}
          <div className="lg:col-span-4 flex flex-col min-w-0">
            <OurSpecialistCard />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
