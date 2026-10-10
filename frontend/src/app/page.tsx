"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCardsGrid } from "@/components/dashboard/MetricCardsGrid";
import { PatientGrowthChart } from "@/components/dashboard/PatientGrowthChart";
import { PatientsByDoctorChart } from "@/components/dashboard/PatientsByDoctorChart";
import { PatientConditionsChart } from "@/components/dashboard/PatientConditionsChart";
import { RecentPatientsTable } from "@/components/dashboard/RecentPatientsTable";
import { TopDoctorsOverview } from "@/components/dashboard/TopDoctorsOverview";
import { Activity, Clock, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <AppShell breadcrumbTitle="Dashboard" parentLabel="Workspace" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Page Heading & Action Controls */}
        <DashboardHeader />

        {/* 4 Summary Metric Cards */}
        <MetricCardsGrid />

        {/* Main Analytics Section: 60% Patient Growth | 40% Patients by Doctor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <PatientGrowthChart />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <PatientsByDoctorChart />
          </div>
        </div>

        {/* Operational Section: Recent Patients Table | Patient Conditions Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <RecentPatientsTable />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <PatientConditionsChart />
          </div>
        </div>

        {/* Lower Row: Top Doctors Overview | Clinical Departments Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
            <TopDoctorsOverview />
          </div>

          {/* Clinical Departments Overview Card */}
          <div className="lg:col-span-7 xl:col-span-7 bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
                  Clinical Departments Overview
                </h3>
                <span className="text-xs font-semibold text-[#0F9F9A] bg-[#E6F7F6] px-2.5 py-1 rounded-full">
                  All Systems Online
                </span>
              </div>
              <p className="text-xs text-[#7A8798] mb-5">
                Real-time bed occupancy, emergency triage load, and physician availability across care units.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/80">
                  <span className="text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider block mb-1">
                    Cardiology & ICU
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#172B4D]">88%</span>
                    <span className="text-[11px] text-[#16A36A] font-semibold">Normal</span>
                  </div>
                  <div className="w-full bg-[#E8EDF3] h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-[#0F9F9A] h-full rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/80">
                  <span className="text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider block mb-1">
                    Neurology Care
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#172B4D]">74%</span>
                    <span className="text-[11px] text-[#16A36A] font-semibold">Optimal</span>
                  </div>
                  <div className="w-full bg-[#E8EDF3] h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: "74%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/80">
                  <span className="text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider block mb-1">
                    Pediatrics & OR
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#172B4D]">92%</span>
                    <span className="text-[11px] text-[#D97706] font-semibold">High Load</span>
                  </div>
                  <div className="w-full bg-[#E8EDF3] h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-[#E9A23B] h-full rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F0F4F8] flex flex-wrap items-center justify-between text-xs text-[#7A8798] gap-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0F9F9A]" />
                <span>Next staff rotation in 3 hours &bull; Shift B</span>
              </div>
              <span className="font-semibold text-[#172B4D]">32 On-call Staff Active</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
