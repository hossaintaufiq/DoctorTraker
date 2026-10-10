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

export default function DashboardPage() {
  return (
    <AppShell breadcrumbTitle="Dashboard" parentLabel="Workspace" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <DashboardHeader />

        {/* 4 Summary Metric Cards */}
        <MetricCardsGrid />

        {/* Main Analytics Row (60% / 40% Ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <PatientGrowthChart />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <PatientsByDoctorChart />
          </div>
        </div>

        {/* Secondary Row: Patient Conditions & Operations Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <RecentPatientsTable />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <PatientConditionsChart />
          </div>
        </div>

        {/* Tertiary Row: Top Doctors & Staff Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
            <TopDoctorsOverview />
          </div>
          
          {/* Quick Department Operational Highlights Card */}
          <div className="lg:col-span-7 xl:col-span-7 bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
                  Clinical Departments Overview
                </h3>
                <span className="text-xs font-semibold text-[#0F9F9A] bg-[#E6F7F6] px-2.5 py-1 rounded-full">
                  All Systems Online
                </span>
              </div>
              <p className="text-xs text-[#7A8798] mb-5">
                Real-time bed occupancy, emergency triage, and doctor availability across care units.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/70">
                  <span className="text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider block mb-1">
                    Cardiology
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#172B4D]">88%</span>
                    <span className="text-[11px] text-[#16A36A] font-semibold">Normal</span>
                  </div>
                  <div className="w-full bg-[#E8EDF3] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#0F9F9A] h-full rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/70">
                  <span className="text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider block mb-1">
                    Neurology
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#172B4D]">74%</span>
                    <span className="text-[11px] text-[#16A36A] font-semibold">Optimal</span>
                  </div>
                  <div className="w-full bg-[#E8EDF3] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: "74%" }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/70">
                  <span className="text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider block mb-1">
                    Pediatrics & OR
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#172B4D]">92%</span>
                    <span className="text-[11px] text-[#D97706] font-semibold">High Load</span>
                  </div>
                  <div className="w-full bg-[#E8EDF3] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#E9A23B] h-full rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F0F4F8] flex flex-wrap items-center justify-between text-xs text-[#7A8798] gap-2">
              <span>Next staff rotation in 3 hours &bull; Shift B</span>
              <span className="font-semibold text-[#172B4D]">32 On-call Staff Available</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
