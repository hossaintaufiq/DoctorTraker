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
  Clock,
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
      <div className="p-8 text-center bg-white rounded-3xl border border-[#EBF0F7]">
        <p className="text-sm font-semibold text-[#101828]">Doctor record not found</p>
        <Link href="/doctors" className="mt-4 inline-block text-xs text-[#2F65F6] font-semibold underline">
          Return to Doctors directory
        </Link>
      </div>
    );
  }

  const assignedPatients = patients.filter(
    (p) => p.assignedDoctorId === doctor.id || p.assignedDoctorName === doctor.name
  );

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/doctors"
            className="p-2.5 rounded-full bg-white border border-[#EBF0F7] text-[#64748B] hover:text-[#101828] hover:bg-[#F8FAFC] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
                {doctor.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                &bull; {doctor.status}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {doctor.specialty} Department &bull; Staff ID: #{doctor.id.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              showToast("Schedule Updated", `Duty hours for ${doctor.name} adjusted.`, "success");
            }}
            className="px-4 py-2.5 text-xs font-medium text-[#1E293B] bg-white border border-[#EBF0F7] rounded-full hover:bg-[#F8FAFC] transition-colors"
          >
            Update Duty Hours
          </button>
          <button
            type="button"
            onClick={() => setIsAddPatientModalOpen(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-colors"
          >
            Assign New Patient
          </button>
        </div>
      </div>

      {/* Top Info Banner Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] font-bold text-xl flex items-center justify-center shrink-0">
              {getInitials(doctor.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[#101828]">{doctor.name}</h3>
              <p className="text-xs font-semibold text-[#2F65F6] mt-0.5">
                Senior Specialist in {doctor.specialty}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="font-semibold text-[#101828]">{doctor.rating.toFixed(1)}</span>
                  <span>Patient satisfaction</span>
                </div>
                <span>&bull;</span>
                <span>{doctor.experienceYears} Years Clinical Exp</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9]">
            <h4 className="text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
              Clinical Biography & Scope
            </h4>
            <p className="text-xs text-[#1E293B] leading-relaxed">
              {doctor.biography}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F1F5F9]">
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EBF0F7]">
              <span className="text-[10px] font-semibold text-[#94A3B8] uppercase block">Email</span>
              <span className="text-xs font-medium text-[#101828] truncate block mt-0.5">{doctor.email}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EBF0F7]">
              <span className="text-[10px] font-semibold text-[#94A3B8] uppercase block">Phone</span>
              <span className="text-xs font-medium text-[#101828] truncate block mt-0.5">{doctor.phone}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EBF0F7]">
              <span className="text-[10px] font-semibold text-[#94A3B8] uppercase block">Consultation Room</span>
              <span className="text-xs font-medium text-[#101828] truncate block mt-0.5">{doctor.roomNumber}</span>
            </div>
          </div>
        </div>

        {/* Workload */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-[#101828] uppercase tracking-wider mb-4">
              Workload & Availability
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Active Patient Load</span>
                <span className="font-bold text-[#101828]">{doctor.patientCount} Patients</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Max Capacity Target</span>
                <span className="font-semibold text-[#101828]">{doctor.maxPatients} Patients</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Clinical Rating</span>
                <span className="font-semibold text-[#10B981]">{doctor.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EBF3FE] border border-[#DCE8FC] text-xs">
            <div className="flex items-center gap-2 text-[#2F65F6] font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Today&apos;s Rounds: 09:00 - 17:00</span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              On-call emergency specialist for Cardiology unit.
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Patients */}
      <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow">
        <h3 className="text-base font-bold text-[#101828] mb-4">Assigned Patient Roster</h3>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold text-[#94A3B8] uppercase">
                <th className="py-2.5 px-6">Patient</th>
                <th className="py-2.5 px-4">Patient ID</th>
                <th className="py-2.5 px-4">Condition</th>
                <th className="py-2.5 px-4">Blood</th>
                <th className="py-2.5 px-4">Registration</th>
                <th className="py-2.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs">
              {assignedPatients.map((pt) => (
                <tr key={pt.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-6 font-bold text-[#101828]">{pt.name}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#94A3B8]">{pt.patientCode}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF3FE] text-[#2F65F6]">
                      {pt.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#101828]">{pt.bloodGroup}</td>
                  <td className="py-3 px-4 text-[#64748B]">{formatDate(pt.registrationDate)}</td>
                  <td className="py-3 px-6 text-right">
                    <Link
                      href={`/patients/${pt.id}`}
                      className="text-xs font-semibold text-[#2F65F6] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Chart</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DoctorDetailPage() {
  return (
    <AppShell breadcrumbTitle="Doctor Profile" parentLabel="Doctors" parentPath="/doctors">
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#94A3B8]">Loading physician chart...</div>}>
        <DoctorDetailContent />
      </Suspense>
    </AppShell>
  );
}
