"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  UserCheck,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  Bell,
  CheckCircle2,
  ArrowLeft,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

export default function StaffPage() {
  const { showToast } = useDoctorTracker();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = () => {
    setIsSubscribed(true);
    showToast(
      "Notification Preference Saved",
      "You will receive priority access when the Staff & HR Management module launches.",
      "success"
    );
  };

  const plannedFeatures = [
    {
      icon: Clock,
      title: "Shift Scheduling & On-Call Rosters",
      description:
        "Automated 24/7 rotating shift assignments, overtime tracking, and emergency on-call substitution workflows.",
    },
    {
      icon: UserCheck,
      title: "Nursing & Paramedical Directory",
      description:
        "Comprehensive records for head nurses, ward attendants, lab technicians, and surgical assistants.",
    },
    {
      icon: ShieldCheck,
      title: "License & Credential Compliance",
      description:
        "Automated verification of medical board licenses, CME credits, malpractice coverage, and hospital privileges.",
    },
    {
      icon: Award,
      title: "Clinical Performance & Duty Logs",
      description:
        "Department-level KPI tracking, ward rounds logging, patient feedback, and peer reviews.",
    },
  ];

  return (
    <AppShell breadcrumbTitle="Staff" parentLabel="Menu" parentPath="/dashboard">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-4">
        {/* Hero Upcoming Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#F8FAFC] to-[#EFF6FF] border border-[#E2E8F0] p-8 sm:p-12 card-shadow text-center">
          {/* Decorative glowing blobs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#2F65F6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#60A5FA]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF3FE] border border-[#BFDBFE] text-[#2F65F6] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upcoming Feature &bull; Version 2.5</span>
          </div>

          {/* Icon Emblem */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#2F65F6] to-[#60A5FA] text-white flex items-center justify-center shadow-lg shadow-[#2F65F6]/20 mb-6">
            <UserCheck className="w-10 h-10 stroke-[2.2]" />
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight max-w-2xl mx-auto">
            Hospital Staff & Human Resources Suite
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto mt-3 leading-relaxed">
            We are engineering a comprehensive workforce operations module designed for hospital administrators to manage nursing staff, paramedical duty rosters, credentialing, and shifts seamlessly.
          </p>

          {/* Notification Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleNotifyMe}
              disabled={isSubscribed}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
                isSubscribed
                  ? "bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]"
                  : "bg-[#2F65F6] text-white hover:bg-[#1E4FD8] shadow-md shadow-[#2F65F6]/25"
              }`}
            >
              {isSubscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notification Enabled</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Notify Me on Deployment</span>
                </>
              )}
            </button>

            <Link
              href="/doctors"
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-[#1E293B] bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all card-shadow"
            >
              <Stethoscope className="w-4 h-4 text-[#2F65F6]" />
              <span>Go to Doctors Directory</span>
            </Link>
          </div>
        </div>

        {/* Planned Feature Highlights */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#101828] tracking-tight">
              Planned Workforce Capabilities
            </h2>
            <p className="text-xs text-[#64748B]">
              Core features actively under development for the medical personnel management system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plannedFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex items-start gap-4 transition-all hover:border-[#BFDBFE]"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#101828] mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Navigation Footer Card */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#101828]">Need to manage physicians?</p>
              <p className="text-[11px] text-[#64748B]">
                Doctor profiles, assigned patient loads, and chambers are live in the Doctors Directory.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-[#2F65F6] hover:text-[#1E4FD8] transition-colors"
          >
            <span>Return to Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
