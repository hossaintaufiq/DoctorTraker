"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  UserCheck,
  Stethoscope,
  Plus,
  Star,
  Mail,
  Phone,
  Search,
  RotateCcw,
  Shield,
  Building2,
  Clock,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";

export default function StaffPage() {
  const { doctors, setIsAddDoctorModalOpen, showToast } = useDoctorTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedSpecialty !== "All" ||
    selectedStatus !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All");
    setSelectedStatus("All");
  };

  const filteredStaff = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.hospital.toLowerCase().includes(q) ||
      doc.email.toLowerCase().includes(q) ||
      doc.phone.includes(q);

    const matchesSpecialty =
      selectedSpecialty === "All" || doc.specialty === selectedSpecialty;

    const matchesStatus =
      selectedStatus === "All" || doc.status === selectedStatus;

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const activeSpecialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  return (
    <AppShell breadcrumbTitle="Staff" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Medical & Clinical Staff Directory
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Active medical specialists, clinical consultants, attending physicians, and departmental duty rosters.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Practitioner</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-4 card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search staff by name, specialty, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-full pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="All">All Specialties</option>
              {activeSpecialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Duty</option>
              <option value="In Surgery">In Surgery</option>
              <option value="On Leave">On Leave</option>
              <option value="Off Duty">Off Duty</option>
            </select>

            {/* Non-shifting Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={!isFiltered}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shrink-0",
                isFiltered
                  ? "bg-white text-[#2F65F6] border-[#2F65F6]/30 hover:bg-[#2F65F6]/5 cursor-pointer shadow-2xs"
                  : "bg-[#F8FAFC] text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
              )}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Staff Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow card-shadow-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2F65F6]/15 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100">
                      {getInitials(doc.name)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#101828] leading-tight">{doc.name}</h3>
                      <span className="text-xs font-semibold text-[#2F65F6]">{doc.specialty}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0",
                      doc.status === "Active"
                        ? "bg-[#ECFDF5] text-[#10B981] border-[#D1FAE5]"
                        : doc.status === "In Surgery"
                        ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    )}
                  >
                    &bull; {doc.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F1F5F9] space-y-2 text-xs text-[#64748B]">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.hospital}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{doc.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.phone}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Chamber / Room</span>
                    <p className="font-bold text-slate-900 mt-0.5">{doc.roomNumber}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Patient Load</span>
                    <p className="font-bold text-[#2F65F6] mt-0.5">{doc.patientCount} Active</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  &starf; {doc.rating || 4.9} Rating
                </span>
                <Link
                  href={`/doctors/${doc.id}`}
                  className="text-xs font-semibold text-[#2F65F6] hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}

          {filteredStaff.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs text-slate-400">
              No staff members match the selected criteria.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
