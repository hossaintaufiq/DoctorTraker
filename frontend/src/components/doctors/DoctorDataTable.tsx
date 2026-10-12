"use client";

import React from "react";
import Link from "next/link";
import { Doctor } from "@/lib/types";
import { getInitials, cn } from "@/lib/utils";
import { Eye, Trash2, Edit2, UserPlus, Users } from "lucide-react";

interface DoctorDataTableProps {
  doctors: Doctor[];
  onEdit: (doc: Doctor) => void;
  onDelete: (doc: Doctor) => void;
  onAddPatient: (doc: Doctor) => void;
}

export function DoctorDataTable({
  doctors,
  onEdit,
  onDelete,
  onAddPatient,
}: DoctorDataTableProps) {
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
    <div className="glass-card p-5 rounded-3xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="py-3 px-6">Doctor</th>
              <th className="py-3 px-4">Specialty</th>
              <th className="py-3 px-4">Hospital</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Patients</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70 text-xs">
            {doctors.map((doc, i) => (
              <tr key={doc.id || (doc as any)._id || `doc-${i}`} className="hover:bg-white/40 transition-colors">
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2F65F6]/20 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-xs flex items-center justify-center shrink-0">
                      {getInitials(doc.name)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/doctors/${doc.id}`}
                        className="font-bold text-[#101828] hover:text-[#2F65F6] transition-colors truncate block"
                      >
                        {doc.name}
                      </Link>
                      <span className="text-[11px] text-[#64748B] truncate block">
                        {doc.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#2F65F6]">
                  {doc.specialty}
                </td>
                <td className="py-3.5 px-4 text-[#1E293B] truncate max-w-[180px]">
                  {doc.hospital || "Doctor Tracker Medical Center"}
                </td>
                <td className="py-3.5 px-4 text-[#64748B]">
                  {doc.phone}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                      doc.status === "Active" && "bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]",
                      doc.status === "In Surgery" && "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]",
                      doc.status === "On Leave" && "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                    )}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#101828]">
                  {doc.patientCount ?? 0}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onAddPatient(doc)}
                      className="p-1.5 text-[#2F65F6] hover:bg-[#EBF3FE] rounded-lg transition-colors cursor-pointer"
                      title="Add patient under doctor"
                      aria-label="Add patient under doctor"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
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
                      title="View doctor chart"
                      aria-label="View doctor chart"
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
    </div>
  );
}
