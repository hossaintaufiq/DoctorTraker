"use client";

import React from "react";
import Link from "next/link";
import { Doctor } from "@/lib/types";
import { getInitials, cn } from "@/lib/utils";
import {
  Phone,
  Mail,
  Building2,
  Eye,
  Trash2,
  Edit2,
  UserPlus,
  Users,
} from "lucide-react";

interface DoctorCardGridProps {
  doctors: Doctor[];
  onEdit: (doc: Doctor) => void;
  onDelete: (doc: Doctor) => void;
  onAddPatient: (doc: Doctor) => void;
}

export function DoctorCardGrid({
  doctors,
  onEdit,
  onDelete,
  onAddPatient,
}: DoctorCardGridProps) {
  if (doctors.length === 0) {
    return (
      <div className="glass-card p-12 text-center rounded-3xl space-y-3 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-[#101828]">No doctors match your criteria</p>
        <p className="text-xs text-[#64748B]">Try adjusting your search query or filter options.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {doctors.map((doc, i) => {
        const patientCount = doc.patientCount ?? 0;
        const maxPatients = doc.maxPatients || 300;
        const loadRatio = Math.min(100, Math.round((patientCount / maxPatients) * 100));

        return (
          <div
            key={doc.id || (doc as any)._id || `doc-grid-${i}`}
            className="glass-card p-5 rounded-3xl flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-200 group"
          >
            <div>
              {/* Header: Avatar, Name, Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2F65F6]/20 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-base flex items-center justify-center border border-white/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {getInitials(doc.name)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/doctors/${doc.id}`}
                      className="text-sm font-bold text-[#101828] hover:text-[#2F65F6] transition-colors truncate block"
                    >
                      {doc.name}
                    </Link>
                    <span className="text-xs font-semibold text-[#2F65F6] block truncate">
                      {doc.specialty}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                    doc.status === "Active" && "bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]",
                    doc.status === "In Surgery" && "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]",
                    doc.status === "On Leave" && "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                  )}
                >
                  {doc.status}
                </span>
              </div>

              {/* Hospital & Info */}
              <div className="mt-3.5 space-y-1.5 text-xs text-[#64748B]">
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <span className="truncate">{doc.hospital || "Doctor Tracker Medical Center"}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <span className="truncate">{doc.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <span className="truncate">{doc.email}</span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-[#64748B]">Active Patients</span>
                  <span className="font-bold text-[#101828]">
                    {patientCount} / {maxPatients}
                  </span>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      loadRatio > 85 ? "bg-amber-500" : "bg-[#2F65F6]"
                    )}
                    style={{ width: `${loadRatio}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100/70">
              <button
                type="button"
                onClick={() => onAddPatient(doc)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2F65F6] bg-[#EBF3FE] hover:bg-[#DCE8FC] rounded-xl transition-colors cursor-pointer"
                title="Add patient under this doctor"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Patient</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(doc)}
                  className="p-1.5 text-[#64748B] hover:text-[#2F65F6] hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Edit doctor"
                  aria-label="Edit doctor"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(doc)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                  title="Delete doctor"
                  aria-label="Delete doctor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <Link
                  href={`/doctors/${doc.id}`}
                  className="p-1.5 text-[#2F65F6] hover:bg-white rounded-lg border border-white/80 transition-colors"
                  title="View doctor profile"
                  aria-label="View doctor profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
