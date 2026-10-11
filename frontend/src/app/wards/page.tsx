"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { 
  Bed, 
  HeartPulse, 
  Activity, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Bell, 
  Users,
  AlertTriangle,
  RotateCcw,
  Building
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export default function WardsPage() {
  const { showToast } = useDoctorTracker();
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = () => {
    setSubscribed(true);
    showToast("You've been added to the early access list for the Ward & Bed Management module!", "success");
  };

  const upcomingFeatures = [
    {
      title: "Realtime Bed Occupancy Heatmap",
      description: "Visual floor-by-floor interactive ward map showing occupied, vacant, cleaning, and maintenance beds.",
      icon: Bed,
      tag: "Ward Telemetry",
    },
    {
      title: "ICU & Critical Care Roster",
      description: "Dedicated telemetry view for Intensive Care and CCU beds with high-dependency nurse-to-patient ratios.",
      icon: HeartPulse,
      tag: "Critical Care",
    },
    {
      title: "Automated Sanitization Turnaround",
      description: "Instant housekeeping alerts triggered on patient discharge to minimize bed turnaround time.",
      icon: RotateCcw,
      tag: "Sanitization Ops",
    },
    {
      title: "Emergency Overflow Allocation",
      description: "One-click overflow routing during surge capacity scenarios with dynamic department re-zoning.",
      icon: AlertTriangle,
      tag: "Surge Readiness",
    },
  ];

  return (
    <AppShell breadcrumbTitle="Ward & Bed Management" parentLabel="Hospital Operations">
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        {/* Upcoming Module Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#162725] to-[#0D1E1B] text-white p-7 sm:p-10 shadow-xl border border-slate-800">
          {/* Ambient glow mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            {/* Upcoming Module Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>UPCOMING MODULE &bull; IN ACTIVE DEVELOPMENT</span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F9F9A] to-[#34D399] text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                <Bed className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Inpatient Ward & Bed Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Realtime Bed Heatmaps, ICU Telemetry, Admission Queue & Housekeeping Turnaround
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              Provides live floor-plan oversight for General Wards, Private Suites, Maternity, and ICU units. Track admission census in real time, automate housekeeping turnaround notifications, and optimize emergency bed allocations.
            </p>

            {/* Early Access Action Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleNotifyMe}
                disabled={subscribed}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0F9F9A] hover:bg-[#0D8782] transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer disabled:bg-emerald-600"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Notification Active &bull; You are enrolled!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Notify Me When Bed Tracking Goes Live</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 justify-center sm:justify-start">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Target Availability: Q4 2026 (v2.3)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Status Card */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/80 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-[#101828]">Architecture Readiness</h2>
              <p className="text-xs text-[#64748B]">Development progress of ward topology, bed state machines, and housekeeping webhooks</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              80% Completed
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F9F9A] to-[#2F65F6] h-full rounded-full transition-all duration-1000" style={{ width: "80%" }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
              <span className="text-xs font-bold text-[#101828] block">Ward Data Topology</span>
              <span className="text-[11px] text-emerald-600 font-semibold">&bull; Completed</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
              <span className="text-xs font-bold text-[#101828]">Bed State Machine</span>
              <span className="text-[11px] text-emerald-600 font-semibold">&bull; Completed</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
              <span className="text-xs font-bold text-[#101828]">Interactive SVG Heatmap</span>
              <span className="text-[11px] text-amber-600 font-semibold">&bull; In Progress</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
              <span className="text-xs font-bold text-[#101828]">Admissions Integration</span>
              <span className="text-[11px] text-slate-500 font-semibold">&bull; Scheduled</span>
            </div>
          </div>
        </div>

        {/* Feature Roadmap Grid */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#101828] px-1">Planned Inpatient Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.title} 
                  className="glass-card p-5 rounded-3xl border border-white/80 hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0F9F9A] flex items-center justify-center shrink-0">
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
