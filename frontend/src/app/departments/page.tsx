"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Building2, Users, HeartPulse, Brain, Baby, Bone, Activity, Stethoscope, ChevronRight } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

const DEPARTMENTS = [
  {
    name: "Cardiology",
    head: "Dr. Salman Hossain",
    doctorsCount: 14,
    patientsCount: 342,
    icon: HeartPulse,
    occupancy: 88,
    color: "bg-[#EBF3FE] text-[#2F65F6]",
  },
  {
    name: "Neurology",
    head: "Dr. Michael Chen",
    doctorsCount: 11,
    patientsCount: 286,
    icon: Brain,
    occupancy: 74,
    color: "bg-[#F3E8FF] text-[#9333EA]",
  },
  {
    name: "Pediatrics",
    head: "Dr. Emily Carter",
    doctorsCount: 9,
    patientsCount: 245,
    icon: Baby,
    occupancy: 92,
    color: "bg-[#FEF3C7] text-[#D97706]",
  },
  {
    name: "Orthopedics",
    head: "Dr. James Wilson",
    doctorsCount: 12,
    patientsCount: 198,
    icon: Bone,
    occupancy: 68,
    color: "bg-[#ECFDF5] text-[#059669]",
  },
  {
    name: "Dermatology",
    head: "Dr. Ayesha Rahman",
    doctorsCount: 8,
    patientsCount: 176,
    icon: Activity,
    occupancy: 62,
    color: "bg-[#FCE7F3] text-[#DB2777]",
  },
  {
    name: "General Medicine",
    head: "Dr. Farhan Kabir",
    doctorsCount: 18,
    patientsCount: 420,
    icon: Stethoscope,
    occupancy: 95,
    color: "bg-[#EBF3FE] text-[#2F65F6]",
  },
];

export default function DepartmentsPage() {
  const { showToast } = useDoctorTracker();

  return (
    <AppShell breadcrumbTitle="Departments" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Clinical Departments
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Departmental staff rosters, ward capacities, and patient distribution across units.
            </p>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.name}
                className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow card-shadow-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${dept.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F4F7FB] text-[#64748B] border border-[#EBF0F7]">
                      {dept.occupancy}% Load
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#101828] mt-4">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Head of Department: <strong className="text-[#101828]">{dept.head}</strong>
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#F1F5F9]">
                    <div className="p-3 rounded-2xl bg-[#F8FAFC]">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Staff Doctors</span>
                      <p className="text-sm font-bold text-[#101828] mt-0.5">{dept.doctorsCount} Specialists</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F8FAFC]">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Active Cases</span>
                      <p className="text-sm font-bold text-[#2F65F6] mt-0.5">{dept.patientsCount} Patients</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <Link
                    href="/doctors"
                    className="text-xs font-semibold text-[#2F65F6] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Specialists</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
