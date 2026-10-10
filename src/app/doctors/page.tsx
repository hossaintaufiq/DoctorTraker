"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Search,
  Filter,
  Plus,
  Star,
  Phone,
  Mail,
  Building,
  MoreVertical,
  Eye,
  Trash2,
  Calendar,
  Stethoscope,
  Users,
  CheckCircle2,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import { DoctorSpecialty, DoctorStatus } from "@/lib/types";

export default function DoctorsPage() {
  const { doctors, setIsAddDoctorModalOpen, deleteDoctor, showToast } =
    useDoctorTracker();

  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
    <AppShell breadcrumbTitle="Doctors" parentLabel="Workspace" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8EDF3]/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-[26px] font-bold text-[#172B4D] tracking-tight">
                Medical Staff & Doctors
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#E6F7F6] text-[#0F9F9A]">
                {doctors.length} Registered
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7A8798] mt-1">
              Manage clinical departments, physician schedules, and patient load capacity.
            </p>
          </div>

          <button
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] rounded-xl shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.4]" />
            <span>Add Doctor</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8EDF3] card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#7A8798] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-[#F7F9FC] text-[#243247] placeholder-[#7A8798] focus:bg-white focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            {/* Specialty Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#7A8798]">
              <span className="font-medium hidden sm:inline">Specialty:</span>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A]"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#7A8798]">
              <span className="font-medium hidden sm:inline">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A]"
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
            const isMenuOpen = activeMenuId === doc.id;
            const loadPercentage = Math.min(
              100,
              Math.round((doc.patientCount / doc.maxPatients) * 100)
            );

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-[#E8EDF3] p-5 card-shadow card-shadow-hover transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Avatar, Info & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#E6F7F6] text-[#0F9F9A] font-bold text-sm flex items-center justify-center border border-[#0F9F9A]/20 shrink-0">
                        {getInitials(doc.name)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/doctors/${doc.id}`}
                          className="text-sm font-bold text-[#172B4D] hover:text-[#0F9F9A] transition-colors truncate block"
                        >
                          {doc.name}
                        </Link>
                        <span className="text-xs font-semibold text-[#0F9F9A] block">
                          {doc.specialty}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                        isActive && "bg-[#EAF7F0] text-[#16A36A]",
                        isInSurgery && "bg-[#FEF7EC] text-[#D97706]",
                        isOnLeave && "bg-[#F1F4F9] text-[#7A8798]",
                        !isActive && !isInSurgery && !isOnLeave && "bg-[#FDEDED] text-[#E05252]"
                      )}
                    >
                      {doc.status}
                    </span>
                  </div>

                  {/* Contact info list */}
                  <div className="mt-4 space-y-2 text-xs text-[#7A8798]">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#9BA6B5] shrink-0" />
                      <span className="truncate">{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#9BA6B5] shrink-0" />
                      <span>{doc.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-[#9BA6B5] shrink-0" />
                      <span>{doc.roomNumber}</span>
                    </div>
                  </div>

                  {/* Patient Load Capacity Bar */}
                  <div className="mt-4 pt-4 border-t border-[#F0F4F8]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#7A8798]">Patient Load</span>
                      <span className="font-semibold text-[#172B4D]">
                        {doc.patientCount} / {doc.maxPatients} ({loadPercentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#E8EDF3] h-2 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          loadPercentage > 85 ? "bg-[#E9A23B]" : "bg-[#0F9F9A]"
                        )}
                        style={{ width: `${loadPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-[#F0F4F8] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#7A8798]">
                    <Star className="w-3.5 h-3.5 text-[#E9A23B] fill-[#E9A23B]" />
                    <span className="font-semibold text-[#172B4D]">{doc.rating.toFixed(1)}</span>
                    <span>&bull; {doc.experienceYears} yrs</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        deleteDoctor(doc.id);
                      }}
                      className="p-1.5 text-[#7A8798] hover:text-[#E05252] hover:bg-[#FDEDED] rounded-lg transition-colors"
                      title="Remove Doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/doctors/${doc.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0F9F9A] bg-[#E6F7F6] hover:bg-[#D5F2F0] rounded-xl transition-colors inline-flex items-center gap-1"
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

        {filteredDoctors.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-12 text-center card-shadow">
            <Stethoscope className="w-10 h-10 text-[#7A8798] mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-[#172B4D]">No physicians found</h3>
            <p className="text-xs text-[#7A8798] mt-1 max-w-sm mx-auto">
              No doctor records matched your search filter. Try clearing your filters or registering a new physician.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
