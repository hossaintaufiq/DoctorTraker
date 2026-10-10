"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AlertCircle, Activity, Bed, PhoneCall, Plus } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

const EMERGENCY_TRIAGE = [
  { id: "EM-104", patient: "Lucas Vance", age: 63, condition: "Arrhythmia Monitoring", priority: "High Priority", room: "ICU Bed 4", time: "10 mins ago" },
  { id: "EM-103", patient: "Rachel Green", age: 29, condition: "Acute Appendicitis", priority: "Immediate OR", room: "OR Suite 2", time: "25 mins ago" },
  { id: "EM-102", patient: "David Miller", age: 55, condition: "Fracture Stabilization", priority: "Stable", room: "Triage Bed 8", time: "1 hour ago" },
];

export default function EmergencyPage() {
  const { showToast } = useDoctorTracker();

  return (
    <AppShell breadcrumbTitle="Emergency & Admission" parentLabel="Other Menu" parentPath="/dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Emergency Trauma & Patient Admission
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Real-time ICU telemetry, triage priority queue, and rapid hospital admissions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => showToast("Emergency Dispatch", "Trauma team alert dispatched to Wing A.", "error")}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Emergency Intake</span>
          </button>
        </div>

        {/* Emergency Triage Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">ICU Beds Occupied</span>
            <p className="text-2xl font-bold text-[#101828] mt-1">18 / 20 Beds</p>
            <span className="text-[10px] text-[#EF4444] font-semibold">90% Capacity</span>
          </div>
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Available Ambulances</span>
            <p className="text-2xl font-bold text-[#10B981] mt-1">4 Active Units</p>
            <span className="text-[10px] text-[#64748B]">GPS Telemetry Live</span>
          </div>
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
            <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Trauma On-Call</span>
            <p className="text-2xl font-bold text-[#2F65F6] mt-1">Dr. Salman Hossain</p>
            <span className="text-[10px] text-[#10B981] font-semibold">Lead Surgeon</span>
          </div>
        </div>

        {/* Triage Live Queue */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow">
          <h3 className="text-base font-bold text-[#101828] mb-4">Active Triage Queue</h3>
          <div className="space-y-3">
            {EMERGENCY_TRIAGE.map((em) => (
              <div
                key={em.id}
                className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#EBF0F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center font-bold text-xs shrink-0">
                    {em.id}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101828]">{em.patient} ({em.age} yrs)</h4>
                    <p className="text-[11px] text-[#64748B]">{em.condition} &bull; {em.room}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]">
                    {em.priority}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">{em.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
