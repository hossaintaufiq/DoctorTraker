"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { api } from "@/lib/api";
import { Doctor, Patient } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Eye,
  UserPlus,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { getInitials, formatDate, cn } from "@/lib/utils";

function DoctorDetailContent() {
  const params = useParams();
  const rawId = typeof params?.id === "string" ? params.id : "";
  const queryClient = useQueryClient();

  const {
    setIsAddPatientModalOpen,
    setSelectedDoctorForNewPatient,
    setEditingDoctor,
    setIsEditDoctorModalOpen,
    setEditingPatient,
    setIsEditPatientModalOpen,
    showToast,
    openConfirmDialog,
  } = useDoctorTracker();

  const [patientPage, setPatientPage] = useState(1);
  const patientLimit = 5;

  // 1. Fetch Doctor details
  const {
    data: doctorData,
    isLoading: isDoctorLoading,
    isError: isDoctorError,
  } = useQuery({
    queryKey: ["doctor", rawId],
    queryFn: async () => {
      if (!rawId) return null;
      const res = await api.doctors.getById(rawId);
      if (!res.success) {
        throw new Error(res.message || "Failed to load doctor profile");
      }
      return res.data as Doctor;
    },
    enabled: Boolean(rawId),
  });

  const doctor = doctorData;

  // 2. Fetch paginated patients under doctor
  const {
    data: patientsData,
    isLoading: isPatientsLoading,
  } = useQuery({
    queryKey: ["doctor-patients", doctor?.id || rawId, patientPage],
    queryFn: async () => {
      const targetId = doctor?.id || rawId;
      if (!targetId) return { data: [], total: 0, totalPages: 1 };
      const res = await api.doctors.getPatients(targetId, {
        page: patientPage,
        limit: patientLimit,
      });
      if (!res.success) {
        throw new Error(res.message || "Failed to load doctor patients");
      }
      return {
        patients: (res.data as Patient[]) || [],
        total: res.total || 0,
        totalPages: res.totalPages || 1,
      };
    },
    enabled: Boolean(doctor?.id || rawId),
  });

  // 3. Remove patient from doctor mutation
  const removePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const targetId = doctor?.id || rawId;
      const res = await api.doctors.removePatient(targetId, patientId);
      if (!res.success) {
        throw new Error(res.message || "Failed to remove patient");
      }
      return res;
    },
    onSuccess: () => {
      showToast("Patient Removed", "Patient removed from doctor roster successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["doctor-patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", rawId] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err: any) => {
      showToast("Action Failed", err?.message || "Could not remove patient.", "error");
    },
  });

  if (isDoctorLoading) {
    return (
      <div className="glass-card p-12 text-center rounded-3xl space-y-3">
        <Loader2 className="w-8 h-8 text-[#2F65F6] animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#64748B]">Loading physician chart...</p>
      </div>
    );
  }

  if (isDoctorError || !doctor) {
    return (
      <div className="glass-card p-12 text-center rounded-3xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-[#101828]">Doctor record not found</p>
        <Link
          href="/doctors"
          className="inline-block text-xs text-[#2F65F6] font-semibold underline"
        >
          Return to Doctors directory
        </Link>
      </div>
    );
  }

  const assignedPatients = patientsData?.patients || [];
  const totalPatients = patientsData?.total ?? (doctor.patientCount || 0);
  const totalPages = patientsData?.totalPages || 1;

  const handleAddPatientToDoctor = () => {
    setSelectedDoctorForNewPatient(doctor);
    setIsAddPatientModalOpen(true);
  };

  const handleEditDoctor = () => {
    setEditingDoctor(doctor);
    setIsEditDoctorModalOpen(true);
  };

  const handleEditPatient = (pt: Patient) => {
    setEditingPatient(pt);
    setIsEditPatientModalOpen(true);
  };

  const handleDeletePatient = (pt: Patient) => {
    openConfirmDialog({
      title: "Remove Patient Record",
      itemName: `${pt.name} (${pt.patientCode || ""})`,
      itemType: "Patient Record",
      message: `Are you sure you want to remove ${pt.name} from Dr. ${doctor.name}'s care roster?`,
      confirmLabel: "Yes, Remove Patient",
      onConfirm: () => {
        removePatientMutation.mutate(pt.id);
      },
    });
  };

  const loadPercentage = Math.min(
    100,
    Math.round(((doctor.patientCount || totalPatients) / (doctor.maxPatients || 300)) * 100)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/doctors"
            className="p-2.5 rounded-full bg-white/70 border border-white/80 text-[#64748B] hover:text-[#101828] card-shadow transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
                {doctor.name}
              </h1>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  doctor.status === "Active" && "bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]",
                  doctor.status === "In Surgery" && "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]",
                  doctor.status === "On Leave" && "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                )}
              >
                &bull; {doctor.status}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {doctor.specialty} Department &bull; {doctor.hospital || "Doctor Tracker Medical Center"} &bull; Staff ID: #{doctor.id ? doctor.id.slice(-6).toUpperCase() : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleEditDoctor}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1E293B] bg-white/70 border border-white/80 rounded-full hover:bg-white card-shadow transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#2F65F6]" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={handleAddPatientToDoctor}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.2]" />
            <span>Add Patient to Doctor</span>
          </button>
        </div>
      </div>

      {/* Top Info Banner Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2F65F6]/20 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-xl flex items-center justify-center border border-white/80 shrink-0 shadow-2xs">
              {getInitials(doctor.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[#101828]">{doctor.name}</h3>
              <p className="text-xs font-semibold text-[#2F65F6] mt-0.5">
                Specialist in {doctor.specialty}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="font-semibold text-[#101828]">{(doctor.rating || 4.8).toFixed(1)}</span>
                  <span>Patient satisfaction</span>
                </div>
                <span>&bull;</span>
                <span>{doctor.experienceYears ?? 5} Years Clinical Experience</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
              Clinical Biography & Scope
            </h4>
            <p className="text-xs text-[#334155] leading-relaxed">
              {doctor.biography ||
                `Dr. ${doctor.name} is a specialist at ${doctor.hospital || "Doctor Tracker Medical Center"} managing outpatient diagnostics and treatment.`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80">
              <span className="text-[10px] font-semibold text-[#94A3B8] uppercase block">Hospital Affiliation</span>
              <span className="text-xs font-bold text-[#101828] truncate block mt-0.5">
                {doctor.hospital || "Doctor Tracker Medical Center"}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80">
              <span className="text-[10px] font-semibold text-[#94A3B8] uppercase block">Contact Phone</span>
              <span className="text-xs font-medium text-[#101828] truncate block mt-0.5">{doctor.phone}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80">
              <span className="text-[10px] font-semibold text-[#94A3B8] uppercase block">Email & Room</span>
              <span className="text-xs font-medium text-[#101828] truncate block mt-0.5">
                {doctor.roomNumber} &bull; {doctor.email}
              </span>
            </div>
          </div>
        </div>

        {/* Workload & Availability Card */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-[#101828] uppercase tracking-wider mb-4">
              Workload & Capacity
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Active Patient Roster</span>
                <span className="font-bold text-[#101828]">{totalPatients} Patients</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Max Patient Target</span>
                <span className="font-semibold text-[#101828]">{doctor.maxPatients || 300} Patients</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Capacity Ratio</span>
                <span className="font-bold text-[#2F65F6]">{loadPercentage}% Allocated</span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-[#2F65F6] h-full rounded-full transition-all"
                  style={{ width: `${loadPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EBF3FE] border border-[#DCE8FC] text-xs">
            <div className="flex items-center gap-2 text-[#2F65F6] font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Consultation Schedule: 09:00 - 17:00</span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Department: {doctor.specialty} &bull; Room {doctor.roomNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Patient Roster */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-[#101828]">Assigned Patient Roster</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2F65F6]/10 text-[#2F65F6]">
              {totalPatients} Active Patients
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddPatientToDoctor}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#2F65F6] bg-[#EBF3FE] hover:bg-[#DCE8FC] rounded-full transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Patient Under Dr. {doctor.name.split(" ")[1] || doctor.name}</span>
          </button>
        </div>

        {isPatientsLoading ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#2F65F6] mb-2" />
            Loading patients under this physician...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    <th className="py-3 px-6">Patient</th>
                    <th className="py-3 px-4">Patient Code</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Care Status</th>
                    <th className="py-3 px-4">Blood</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-xs">
                  {assignedPatients.map((pt: any, index: number) => (
                    <tr
                      key={pt.id ? `doc-pt-${pt.id}-${index}` : (pt._id ? `doc-pt-${pt._id}-${index}` : `doc-pt-${index}`)}
                      className="hover:bg-white/40 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-bold text-[#101828]">
                        <Link
                          href={`/patients/${pt.id || pt._id}`}
                          className="hover:text-[#2F65F6] transition-colors"
                        >
                          {pt.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-[#64748B]">
                        {pt.patientCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF3FE] text-[#2F65F6]">
                          {pt.condition}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#1E293B] font-medium">
                        {pt.status}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#101828]">
                        {pt.bloodGroup}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] text-[11px]">
                        {formatDate(pt.registrationDate)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditPatient(pt)}
                            className="p-1.5 text-[#64748B] hover:text-[#2F65F6] hover:bg-white rounded-lg transition-colors cursor-pointer"
                            title="Edit Patient"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePatient(pt)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                            title="Delete Patient from Doctor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/patients/${pt.id}`}
                            className="p-1.5 text-[#2F65F6] hover:bg-white rounded-lg border border-white/80 transition-colors"
                            title="View Patient Chart"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {assignedPatients.length === 0 && (
              <div className="p-8 text-center text-xs text-[#64748B]">
                No patients currently assigned to Dr. {doctor.name}. Click &quot;Add Patient to Doctor&quot; above to register a patient under this specialist.
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                <span className="text-[#64748B]">
                  Page {patientPage} of {totalPages} ({totalPatients} total patients)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={patientPage <= 1}
                    onClick={() => setPatientPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-xl border border-slate-200 bg-white/70 text-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={patientPage >= totalPages}
                    onClick={() => setPatientPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-xl border border-slate-200 bg-white/70 text-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DoctorDetailPage() {
  return (
    <AppShell
      breadcrumbTitle="Doctor Profile"
      parentLabel="Doctors"
      parentPath="/doctors"
    >
      <DoctorDetailContent />
    </AppShell>
  );
}
