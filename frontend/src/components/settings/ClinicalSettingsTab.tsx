"use client";

import React from "react";
import { Stethoscope } from "lucide-react";

interface ClinicalSettingsTabProps {
  consultationDuration: string;
  setConsultationDuration: (val: string) => void;
  maxPatientsPerSlot: string;
  setMaxPatientsPerSlot: (val: string) => void;
  icuTotalBeds: string;
  setIcuTotalBeds: (val: string) => void;
  triageSystem: string;
  setTriageSystem: (val: string) => void;
  dischargeChecklistEnforced: boolean;
  setDischargeChecklistEnforced: (val: boolean) => void;
  triageAlertAudio: boolean;
  setTriageAlertAudio: (val: boolean) => void;
}

export function ClinicalSettingsTab({
  consultationDuration,
  setConsultationDuration,
  maxPatientsPerSlot,
  setMaxPatientsPerSlot,
  icuTotalBeds,
  setIcuTotalBeds,
  triageSystem,
  setTriageSystem,
  dischargeChecklistEnforced,
  setDischargeChecklistEnforced,
  triageAlertAudio,
  setTriageAlertAudio,
}: ClinicalSettingsTabProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 pb-4 border-b border-[#EBF0F7]">
        <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center border border-[#D1FAE5]">
          <Stethoscope className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#101828]">Clinical Protocols & Ward Operations</h3>
          <p className="text-xs text-[#64748B]">Consultation duration limits, ICU bed distribution, and triage rules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Standard Consultation Duration</label>
          <select
            value={consultationDuration}
            onChange={(e) => setConsultationDuration(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          >
            <option value="15">15 Minutes / Slot</option>
            <option value="20">20 Minutes / Slot (Recommended)</option>
            <option value="30">30 Minutes / Slot</option>
            <option value="45">45 Minutes / Complex Consultation</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Max Concurrent Outpatient Queue per Doctor</label>
          <input
            type="number"
            value={maxPatientsPerSlot}
            onChange={(e) => setMaxPatientsPerSlot(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Emergency / ICU Available Bed Capacity</label>
          <input
            type="number"
            value={icuTotalBeds}
            onChange={(e) => setIcuTotalBeds(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Clinical Triage Assessment Standard</label>
          <select
            value={triageSystem}
            onChange={(e) => setTriageSystem(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          >
            <option>ESI (Emergency Severity Index 5-Tier)</option>
            <option>Manchester Triage Protocol</option>
            <option>Australasian Triage Scale (ATS)</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
          <div>
            <p className="text-xs font-bold text-[#101828]">Mandatory Multi-Discipline Inpatient Discharge Checklist</p>
            <p className="text-[11px] text-[#64748B]">
              Prevents billing closure until attending physician and pharmacy sign off
            </p>
          </div>
          <input
            type="checkbox"
            checked={dischargeChecklistEnforced}
            onChange={(e) => setDischargeChecklistEnforced(e.target.checked)}
            className="w-4 h-4 accent-[#2F65F6] rounded"
          />
        </label>

        <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
          <div>
            <p className="text-xs font-bold text-rose-700">Audio Siren for Critical Triage Score Intake</p>
            <p className="text-[11px] text-[#64748B]">
              Play audible workstation siren when a Level-1 trauma case is entered
            </p>
          </div>
          <input
            type="checkbox"
            checked={triageAlertAudio}
            onChange={(e) => setTriageAlertAudio(e.target.checked)}
            className="w-4 h-4 accent-rose-600 rounded"
          />
        </label>
      </div>
    </div>
  );
}
