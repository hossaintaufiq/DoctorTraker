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
  Building,
  Star,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
} from "lucide-react";
import { getInitials, formatDate, cn } from "@/lib/utils";

function DoctorDetailContent() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "doc-1";
  const { doctors, patients, setIsAddPatientModalOpen, showToast } = useDoctorTracker();

  const doctor =
    doctors.find((d) => d.id === id) ||
    doctors.find((d) => d.id === "doc-1") ||
    doctors[0];

  if (!doctor) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#E8EDF3]">
        <p className="text-sm font-semibold text-[#172B4D]">Doctor record not found</p>
        <Link href="/doctors" className="mt-4 inline-block text-xs text-[#0F9F9A] font-semibold underline">
          Return to Doctors directory
        </Link>
      </div>
    );
  }

  // Find assigned patients for this doctor
  const assignedPatients = patients.filter(
    (p) => p.assignedDoctorId === doctor.id || p.assignedDoctorName === doctor.name
  );

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EDF3]/60">
        <div className="flex items-center gap-3">
          <Link
            href="/doctors"
            className="p-2 rounded-xl bg-white border border-[#E8EDF3] text-[#7A8798] hover:text-[#172B4D] hover:bg-[#F7F9FC] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">
                {doctor.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7F0] text-[#16A36A]">
                {doctor.status}
              </span>
            </div>
            <p className="text-xs text-[#7A8798] mt-0.5">
              {doctor.specialty} Department &bull; Staff ID: #{doctor.id.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              showToast("Schedule Updated", `Duty hours for ${doctor.name} adjusted.`, "success");
            }}
            className="px-3.5 py-2 text-xs font-medium text-[#243247] bg-white border border-[#E8EDF3] rounded-xl hover:bg-[#F7F9FC] transition-colors"
          >
            Update Duty Hours
          </button>
          <button
            onClick={() => setIsAddPatientModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] rounded-xl shadow-xs transition-colors"
          >
            Assign New Patient
          </button>
        </div>
      </div>

      {/* Top Info Banner Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8EDF3] p-6 card-shadow space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E6F7F6] text-[#0F9F9A] font-bold text-xl flex items-center justify-center border border-[#0F9F9A]/20 shrink-0">
              {getInitials(doctor.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[#172B4D]">{doctor.name}</h3>
              <p className="text-xs font-semibold text-[#0F9F9A] mt-0.5">
                Senior Specialist in {doctor.specialty}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#7A8798] mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#E9A23B] fill-[#E9A23B]" />
                  <span className="font-semibold text-[#172B4D]">{doctor.rating.toFixed(1)}</span>
                  <span>Patient satisfaction</span>
                </div>
                <span>&bull;</span>
                <span>{doctor.experienceYears} Years Clinical Exp</span>
                <span>&bull;</span>
                <span>Joined {formatDate(doctor.joinedDate)}</span>
              </div>
            </div>
          </div>

          {/* Professional Biography */}
          <div className="pt-4 border-t border-[#F0F4F8]">
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-1.5">
              Clinical Biography & Scope
            </h4>
            <p className="text-xs text-[#243247] leading-relaxed">
              {doctor.biography ||
                `${doctor.name} has been providing advanced ${doctor.specialty.toLowerCase()} care at Care Guide BD Medical Center. Experienced in patient risk management, surgical and non-surgical therapies, and medical mentorship.`}
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F0F4F8]">
            <div className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/70">
              <span className="text-[10px] font-semibold text-[#7A8798] uppercase block">Email Address</span>
              <span className="text-xs font-medium text-[#243247] truncate block mt-0.5">{doctor.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/70">
              <span className="text-[10px] font-semibold text-[#7A8798] uppercase block">Contact Phone</span>
              <span className="text-xs font-medium text-[#243247] truncate block mt-0.5">{doctor.phone}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/70">
              <span className="text-[10px] font-semibold text-[#7A8798] uppercase block">Consultation Wing</span>
              <span className="text-xs font-medium text-[#243247] truncate block mt-0.5">{doctor.roomNumber}</span>
            </div>
          </div>
        </div>

        {/* Quick Metrics & Duty Summary */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6 card-shadow flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-4">
              Workload & Availability
            </h4>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7A8798]">Active Patient Load</span>
                <span className="text-sm font-bold text-[#172B4D]">{doctor.patientCount} Patients</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7A8798]">Max Capacity Target</span>
                <span className="text-sm font-semibold text-[#243247]">{doctor.maxPatients} Patients</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7A8798]">Clinical Rating</span>
                <span className="text-sm font-semibold text-[#16A36A]">{doctor.rating.toFixed(1)} / 5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7A8798]">Department Tier</span>
                <span className="text-sm font-semibold text-[#0F9F9A]">Consultant A</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#E6F7F6] border border-[#0F9F9A]/20 text-xs">
            <div className="flex items-center gap-2 text-[#0F9F9A] font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Today&apos;s Rounds: 09:00 - 17:00</span>
            </div>
            <p className="text-[11px] text-[#243247]">
              On-call emergency triage backup active for Wing A.
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Patients Section */}
      <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
              Assigned Patient Roster
            </h3>
            <p className="text-xs text-[#7A8798] mt-0.5">
              Current clinical cases under {doctor.name}&apos;s supervision
            </p>
          </div>
          <span className="text-xs font-semibold text-[#0F9F9A] bg-[#E6F7F6] px-2.5 py-1 rounded-full">
            {assignedPatients.length} Active Patients
          </span>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead>
              <tr className="border-y border-[#E8EDF3] bg-[#F7F9FC]/60 text-[11px] font-semibold text-[#7A8798] uppercase">
                <th className="py-2.5 px-6">Patient</th>
                <th className="py-2.5 px-4">Patient ID</th>
                <th className="py-2.5 px-4">Condition</th>
                <th className="py-2.5 px-4">Blood Group</th>
                <th className="py-2.5 px-4">Registration</th>
                <th className="py-2.5 px-6 text-right">View Chart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F8] text-xs">
              {assignedPatients.map((pt) => (
                <tr key={pt.id} className="hover:bg-[#F7F9FC]/70 transition-colors">
                  <td className="py-3 px-6 font-semibold text-[#172B4D]">
                    {pt.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#7A8798]">
                    {pt.patientCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#E6F7F6] text-[#0F9F9A]">
                      {pt.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#243247]">{pt.bloodGroup}</td>
                  <td className="py-3 px-4 text-[#7A8798]">{formatDate(pt.registrationDate)}</td>
                  <td className="py-3 px-6 text-right">
                    <Link
                      href={`/patients/${pt.id}`}
                      className="text-xs font-semibold text-[#0F9F9A] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Open Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {assignedPatients.length === 0 && (
          <div className="text-center py-8 text-xs text-[#7A8798]">
            No patients assigned to this doctor yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default function DoctorDetailPage() {
  return (
    <AppShell breadcrumbTitle="Doctor Profile" parentLabel="Doctors" parentPath="/doctors">
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#7A8798]">Loading physician chart...</div>}>
        <DoctorDetailContent />
      </Suspense>
    </AppShell>
  );
}
