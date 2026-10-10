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
      <div className="p-8 text-center bg-white rounded-2xl border border-[#E8EDF3]">
        <p className="text-sm font-semibold text-[#172B4D]">Patient chart not found</p>
        <Link href="/patients" className="mt-4 inline-block text-xs text-[#0F9F9A] font-semibold underline">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EDF3]/60">
        <div className="flex items-center gap-3">
          <Link
            href="/patients"
            className="p-2 rounded-xl bg-white border border-[#E8EDF3] text-[#7A8798] hover:text-[#172B4D] hover:bg-[#F7F9FC] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">
                {patient.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7F6] text-[#0F9F9A]">
                {patient.patientCode}
              </span>
            </div>
            <p className="text-xs text-[#7A8798] mt-0.5">
              {patient.gender} &bull; {patient.age} years old &bull; Blood Group: {patient.bloodGroup}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              showToast("Prescription Generated", `Latest Rx summary printed for ${patient.name}.`, "success");
            }}
            className="px-3.5 py-2 text-xs font-medium text-[#243247] bg-white border border-[#E8EDF3] rounded-xl hover:bg-[#F7F9FC] transition-colors"
          >
            Print Clinical Summary
          </button>
          <button
            onClick={() => {
              showToast("Visit Logged", "Follow-up consultation successfully scheduled.", "info");
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] rounded-xl shadow-xs transition-colors"
          >
            Schedule Follow-up
          </button>
        </div>
      </div>

      {/* 4 Vitals Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4 card-shadow">
          <div className="flex items-center justify-between text-[#7A8798] mb-2">
            <span className="text-[11px] font-semibold uppercase">Blood Pressure</span>
            <Activity className="w-4 h-4 text-[#0F9F9A]" />
          </div>
          <p className="text-xl font-bold text-[#172B4D]">120 / 80</p>
          <span className="text-[10px] text-[#16A36A] font-semibold">Optimal &bull; mmHg</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4 card-shadow">
          <div className="flex items-center justify-between text-[#7A8798] mb-2">
            <span className="text-[11px] font-semibold uppercase">Heart Rate</span>
            <Heart className="w-4 h-4 text-[#E05252]" />
          </div>
          <p className="text-xl font-bold text-[#172B4D]">72</p>
          <span className="text-[10px] text-[#7A8798]">Resting &bull; BPM</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4 card-shadow">
          <div className="flex items-center justify-between text-[#7A8798] mb-2">
            <span className="text-[11px] font-semibold uppercase">Body Temp</span>
            <Thermometer className="w-4 h-4 text-[#E9A23B]" />
          </div>
          <p className="text-xl font-bold text-[#172B4D]">98.6°F</p>
          <span className="text-[10px] text-[#16A36A] font-semibold">Afebrile</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4 card-shadow">
          <div className="flex items-center justify-between text-[#7A8798] mb-2">
            <span className="text-[11px] font-semibold uppercase">SpO2 Oxygen</span>
            <Activity className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-xl font-bold text-[#172B4D]">99%</p>
          <span className="text-[10px] text-[#16A36A] font-semibold">Normal air</span>
        </div>
      </div>

      {/* Clinical Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Notes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8EDF3] p-6 card-shadow space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#172B4D] mb-1">
              Clinical Diagnosis & Case History
            </h3>
            <p className="text-xs text-[#7A8798]">
              Classification: <strong className="text-[#0F9F9A]">{patient.condition}</strong> &bull; Care Status: <strong className="text-[#243247]">{patient.status}</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3] text-xs space-y-2">
            <h4 className="font-bold text-[#172B4D]">Physician Assessment:</h4>
            <p className="text-[#243247] leading-relaxed">
              {patient.notes || "Patient presented for scheduled follow-up. Vital indicators stable, medication compliance verified. Routine diagnostic biomarkers within normal therapeutic range."}
            </p>
          </div>

          {/* Past Encounters History */}
          <div className="pt-4 border-t border-[#F0F4F8]">
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">
              Recent Clinical Timeline
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#0F9F9A] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-[#172B4D]">Comprehensive Consultation with {patient.assignedDoctorName}</p>
                  <p className="text-[11px] text-[#7A8798]">{formatDate(patient.lastVisit)} &bull; Outpatient Clinic</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#7A8798] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-[#172B4D]">Initial Intake Registration</p>
                  <p className="text-[11px] text-[#7A8798]">{formatDate(patient.registrationDate)} &bull; Reception Desk</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Doctor & Contact Card */}
        <div className="space-y-6">
          {/* Assigned Doctor Card */}
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 card-shadow">
            <span className="text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider block mb-3">
              Attending Physician
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F7F6] text-[#0F9F9A] font-bold text-xs flex items-center justify-center border border-[#0F9F9A]/20 shrink-0">
                {assignedDoc ? getInitials(assignedDoc.name) : "DR"}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#172B4D] truncate">
                  {patient.assignedDoctorName}
                </h4>
                <p className="text-[11px] text-[#0F9F9A] font-semibold truncate">
                  {assignedDoc?.specialty || "Medical Specialist"}
                </p>
              </div>
            </div>
            {assignedDoc && (
              <div className="mt-3 pt-3 border-t border-[#F0F4F8] text-xs text-[#7A8798] space-y-1">
                <p className="truncate">Email: {assignedDoc.email}</p>
                <p>Location: {assignedDoc.roomNumber}</p>
              </div>
            )}
          </div>

          {/* Patient Contact Card */}
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 card-shadow space-y-3 text-xs">
            <span className="text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider block">
              Contact & Emergency Details
            </span>
            <div className="flex items-center gap-2 text-[#243247]">
              <Phone className="w-3.5 h-3.5 text-[#7A8798]" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[#243247] truncate">
              <Mail className="w-3.5 h-3.5 text-[#7A8798]" />
              <span className="truncate">{patient.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[#243247]">
              <Calendar className="w-3.5 h-3.5 text-[#7A8798]" />
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
    <AppShell breadcrumbTitle="Patient Chart" parentLabel="Patients" parentPath="/patients">
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#7A8798]">Loading patient chart...</div>}>
        <PatientDetailContent />
      </Suspense>
    </AppShell>
  );
}
