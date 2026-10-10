"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AppointmentsSection } from "@/components/dashboard/AppointmentsSection";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { Calendar, Plus, Clock, Users, CheckCircle2 } from "lucide-react";

export default function AppointmentsPage() {
  const { showToast } = useDoctorTracker();

  return (
    <AppShell breadcrumbTitle="Appointments" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Clinical Appointments Schedule
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Manage patient booking slots, consultation timetables, and attending specialist rounds.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              showToast("New Booking", "Appointment scheduling modal initialized.", "info")
            }
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Total Scheduled Today</span>
              <p className="text-2xl font-bold text-[#101828]">96 Slots</p>
              <span className="text-[10px] text-[#10B981] font-semibold">100% On-time</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Completed Consultations</span>
              <p className="text-2xl font-bold text-[#101828]">68 Completed</p>
              <span className="text-[10px] text-[#64748B]">Average 18 min / patient</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Pending In Queue</span>
              <p className="text-2xl font-bold text-[#101828]">28 Waiting</p>
              <span className="text-[10px] text-[#F59E0B] font-semibold">Next: 11:30 AM</span>
            </div>
          </div>
        </div>

        {/* Main Appointment Board */}
        <AppointmentsSection />
      </div>
    </AppShell>
  );
}
