"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Stethoscope,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Printer,
  CalendarPlus,
} from "lucide-react";
import { getInitials, formatDate, cn } from "@/lib/utils";

function PatientDetailContent() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "pat-1";
  const { patients, doctors, showToast } = useDoctorTracker();

  const patient =
    patients.find((p) => p.id === id) ||
    patients.find((p) => p.id === "pat-1") ||
    patients[0];

  if (!patient) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-[#EBF0F7] card-shadow">
        <p className="text-sm font-semibold text-[#101828]">Patient chart not found</p>
        <Link href="/patients" className="mt-4 inline-block text-xs text-[#2F65F6] font-semibold underline">
          Return to Patients directory
        </Link>
      </div>
    );
  }

  const assignedDoc =
    doctors.find((d) => d.id === patient.assignedDoctorId) ||
    doctors.find((d) => d.name === patient.assignedDoctorName);

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/patients"
            className="p-2.5 rounded-full bg-white border border-[#EBF0F7] text-[#64748B] hover:text-[#101828] hover:bg-[#F8FAFC] card-shadow transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
                {patient.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF3FE] text-[#2F65F6] border border-[#DCE8FC]">
                {patient.patientCode}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              {patient.gender} &bull; {patient.age} years old &bull; Blood Group: {patient.bloodGroup}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              showToast("Prescription Generated", `Latest Rx summary printed for ${patient.name}.`, "success");
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1E293B] bg-white border border-[#EBF0F7] rounded-full hover:bg-[#F8FAFC] card-shadow transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Print Summary</span>
          </button>
          <button
            onClick={() => {
              showToast("Visit Logged", "Follow-up consultation successfully scheduled.", "info");
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all"
          >
            <CalendarPlus className="w-4 h-4 stroke-[2.2]" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* 4 Vitals Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase">Blood Pressure</span>
            <div className="w-7 h-7 rounded-full bg-[#EBF3FE] flex items-center justify-center text-[#2F65F6]">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#101828]">120 / 80</p>
          <span className="text-[11px] text-[#10B981] font-semibold">Optimal &bull; mmHg</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase">Heart Rate</span>
            <div className="w-7 h-7 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444]">
              <Heart className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#101828]">72</p>
          <span className="text-[11px] text-[#64748B]">Resting &bull; BPM</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase">Body Temp</span>
            <div className="w-7 h-7 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#101828]">98.6°F</p>
          <span className="text-[11px] text-[#10B981] font-semibold">Afebrile</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase">SpO2 Oxygen</span>
            <div className="w-7 h-7 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8]">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#101828]">99%</p>
          <span className="text-[11px] text-[#10B981] font-semibold">Normal air</span>
        </div>
      </div>

      {/* Clinical Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Notes */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#101828] mb-1">
              Clinical Diagnosis & Case History
            </h3>
            <p className="text-xs text-[#64748B]">
              Classification: <strong className="text-[#2F65F6]">{patient.condition}</strong> &bull; Care Status: <strong className="text-[#1E293B]">{patient.status}</strong>
            </p>
          </div>

          <div className="p-4.5 rounded-2xl bg-[#F4F7FB] border border-[#EBF0F7] text-xs space-y-2">
            <h4 className="font-bold text-[#101828]">Physician Assessment:</h4>
            <p className="text-[#334155] leading-relaxed">
              {patient.notes || "Patient presented for scheduled follow-up. Vital indicators stable, medication compliance verified. Routine diagnostic biomarkers within normal therapeutic range."}
            </p>
          </div>

          {/* Past Encounters History */}
          <div className="pt-4 border-t border-[#EBF0F7]">
            <h4 className="text-xs font-bold text-[#101828] uppercase tracking-wider mb-3.5">
              Recent Clinical Timeline
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2F65F6] mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-[#101828]">Comprehensive Consultation with {patient.assignedDoctorName}</p>
                  <p className="text-[11px] text-[#64748B]">{formatDate(patient.lastVisit)} &bull; Outpatient Clinic</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-[#101828]">Initial Intake Registration</p>
                  <p className="text-[11px] text-[#64748B]">{formatDate(patient.registrationDate)} &bull; Reception Desk</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Doctor & Contact Card */}
        <div className="space-y-6">
          {/* Assigned Doctor Card */}
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow">
            <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block mb-3.5">
              Attending Physician
            </span>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] font-bold text-xs flex items-center justify-center border border-[#DCE8FC] shrink-0">
                {assignedDoc ? getInitials(assignedDoc.name) : "DR"}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#101828] truncate">
                  {patient.assignedDoctorName}
                </h4>
                <p className="text-[11px] text-[#2F65F6] font-semibold truncate">
                  {assignedDoc?.specialty || "Medical Specialist"}
                </p>
              </div>
            </div>
            {assignedDoc && (
              <div className="mt-4 pt-3 border-t border-[#EBF0F7] text-xs text-[#64748B] space-y-1.5">
                <p className="truncate">Email: {assignedDoc.email}</p>
                <p>Location: {assignedDoc.roomNumber}</p>
              </div>
            )}
          </div>

          {/* Patient Contact Card */}
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-3.5 text-xs">
            <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Contact & Emergency Details
            </span>
            <div className="flex items-center gap-2.5 text-[#334155]">
              <Phone className="w-4 h-4 text-[#94A3B8]" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#334155] truncate">
              <Mail className="w-4 h-4 text-[#94A3B8]" />
              <span className="truncate">{patient.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#334155]">
              <Calendar className="w-4 h-4 text-[#94A3B8]" />
              <span>Registered: {formatDate(patient.registrationDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatientDetailPage() {
  return (
    <AppShell breadcrumbTitle="Patient Chart" parentLabel="Patient" parentPath="/patients">
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading patient chart...</div>}>
        <PatientDetailContent />
      </Suspense>
    </AppShell>
  );
}
