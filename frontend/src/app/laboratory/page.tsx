"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { 
  FlaskConical, 
  Microscope, 
  Dna, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Bell, 
  ArrowRight,
  FileText,
  Activity,
  Layers,
  Search
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export default function LaboratoryPage() {
  const { showToast } = useDoctorTracker();
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = () => {
    setSubscribed(true);
    showToast("You've been added to the early access list for the Laboratory & Diagnostics module!", "success");
  };

  const upcomingFeatures = [
    {
      title: "Specimen & Barcode Telemetry",
      description: "Automated chain-of-custody tracking with instant barcode scanning from phlebotomy to analysis.",
      icon: FlaskConical,
      tag: "Core Engine",
    },
    {
      title: "Automated Pathology & Hematology",
      description: "Direct HL7/FHIR analyzer integration delivering automated CBC, metabolic panels, and lipid profiles.",
      icon: Microscope,
      tag: "Clinical Integration",
    },
    {
      title: "Radiology & DICOM Cloud Viewer",
      description: "Zero-footprint web DICOM viewer for X-Ray, CT, and MRI scans embedded right into the patient chart.",
      icon: Layers,
      tag: "Imaging PACS",
    },
    {
      title: "Critical Biomarker Alerts",
      description: "Real-time push notifications to on-duty physicians when panic lab values or abnormal flags occur.",
      icon: Activity,
      tag: "Emergency Triage",
    },
  ];

  return (
    <AppShell breadcrumbTitle="Laboratory & Diagnostics" parentLabel="Clinical Systems">
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        {/* Upcoming Module Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A101D] text-white p-7 sm:p-10 shadow-xl border border-slate-800">
          {/* Ambient glow mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2F65F6]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            {/* Upcoming Module Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>UPCOMING MODULE &bull; IN ACTIVE DEVELOPMENT</span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2F65F6] to-[#60A5FA] text-white flex items-center justify-center shadow-md shadow-[#2F65F6]/30">
                <FlaskConical className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Laboratory & Pathology Diagnostics
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Comprehensive Diagnostic Testing, LIS Interoperability & Medical Imaging PACS
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              This module connects hospital pathology labs, digital hematology analyzers, and imaging centers directly to Doctor Tracker. Physicians will be able to order diagnostic panels, inspect DICOM scans, and receive critical biomarker alerts in real time.
            </p>

            {/* Early Access Action Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleNotifyMe}
                disabled={subscribed}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#2F65F6]/25 cursor-pointer disabled:bg-emerald-600"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Notification Active &bull; You are enrolled!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Notify Me When Laboratory Goes Live</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 justify-center sm:justify-start">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Target Availability: Q3 2026 (v2.2)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Status Card */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/80 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-[#101828]">Architecture Readiness</h2>
              <p className="text-xs text-[#64748B]">Development progress of clinical schemas, HL7 integration, and cloud PACS</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EBF3FE] text-[#2F65F6] border border-[#BFDBFE]">
              85% Completed
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#2F65F6] to-[#10B981] h-full rounded-full transition-all duration-1000" style={{ width: "85%" }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
              <span className="text-xs font-bold text-[#101828] block">Mongoose Schemas</span>
              <span className="text-[11px] text-emerald-600 font-semibold">&bull; Completed</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
              <span className="text-xs font-bold text-[#101828]">FHIR / HL7 Pipeline</span>
              <span className="text-[11px] text-emerald-600 font-semibold">&bull; Completed</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
              <span className="text-xs font-bold text-[#101828]">DICOM Web Viewer</span>
              <span className="text-[11px] text-amber-600 font-semibold">&bull; In Progress</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
              <span className="text-xs font-bold text-[#101828]">HIPAA Security Audit</span>
              <span className="text-[11px] text-slate-500 font-semibold">&bull; Scheduled</span>
            </div>
          </div>
        </div>

        {/* Feature Roadmap Grid */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#101828] px-1">Planned Clinical Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.title} 
                  className="glass-card p-5 rounded-3xl border border-white/80 hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#101828] truncate">{feat.title}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                        {feat.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
