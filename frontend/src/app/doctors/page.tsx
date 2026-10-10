"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Search,
  Plus,
  Star,
  Phone,
  Mail,
  Building,
  Eye,
  Trash2,
  Stethoscope,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import { DoctorSpecialty, DoctorStatus } from "@/lib/types";

export default function DoctorsPage() {
  const { doctors, setIsAddDoctorModalOpen, deleteDoctor, showToast } =
    useDoctorTracker();

  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const specialties = [
    "All",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "General Medicine",
    "Gynecology",
    "Oncology",
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.email.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "All" || doc.specialty === selectedSpecialty;

    const matchesStatus =
      selectedStatus === "All" || doc.status === selectedStatus;

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  return (
    <AppShell breadcrumbTitle="Doctors" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
                Medical Staff & Doctors
              </h1>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#EBF3FE] text-[#2F65F6] border border-[#DCE8FC]">
                {doctors.length} Registered
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Manage clinical departments, physician schedules, and patient load capacity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#EBF0F7] card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#101828] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="font-semibold hidden sm:inline">Specialty:</span>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#101828] focus:outline-none focus:border-[#2F65F6]"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="font-semibold hidden sm:inline">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#101828] focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="In Surgery">In Surgery</option>
                <option value="On Leave">On Leave</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => {
            const isActive = doc.status === "Active";
            const isInSurgery = doc.status === "In Surgery";
            const isOnLeave = doc.status === "On Leave";
            const loadPercentage = Math.min(
              100,
              Math.round((doc.patientCount / doc.maxPatients) * 100)
            );

            return (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow card-shadow-hover transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] font-bold text-sm flex items-center justify-center shrink-0">
                        {getInitials(doc.name)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/doctors/${doc.id}`}
                          className="text-sm font-bold text-[#101828] hover:text-[#2F65F6] transition-colors truncate block"
                        >
                          {doc.name}
                        </Link>
                        <span className="text-xs font-semibold text-[#2F65F6] block">
                          {doc.specialty}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                        isActive && "bg-[#ECFDF5] text-[#10B981]",
                        isInSurgery && "bg-[#FEF3C7] text-[#D97706]",
                        isOnLeave && "bg-[#F1F5F9] text-[#64748B]",
                        !isActive && !isInSurgery && !isOnLeave && "bg-[#FEF2F2] text-[#EF4444]"
                      )}
                    >
                      &bull; {doc.status}
                    </span>
                  </div>

                  {/* Contact info list */}
                  <div className="mt-4 space-y-2 text-xs text-[#64748B]">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                      <span className="truncate">{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                      <span>{doc.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                      <span>{doc.roomNumber}</span>
                    </div>
                  </div>

                  {/* Patient Load Capacity Bar */}
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#64748B]">Patient Load</span>
                      <span className="font-semibold text-[#101828]">
                        {doc.patientCount} / {doc.maxPatients} ({loadPercentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          loadPercentage > 85 ? "bg-[#F59E0B]" : "bg-[#2F65F6]"
                        )}
                        style={{ width: `${loadPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="font-semibold text-[#101828]">{doc.rating.toFixed(1)}</span>
                    <span>&bull; {doc.experienceYears} yrs</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => deleteDoctor(doc.id)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                      title="Remove Doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/doctors/${doc.id}`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#2F65F6] bg-[#EBF3FE] hover:bg-[#DBEAFE] rounded-full transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
