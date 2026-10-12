"use client";

import React from "react";
import Link from "next/link";
import { Patient, PatientCondition } from "@/lib/types";
import { getInitials, formatDate, cn } from "@/lib/utils";
import { Eye, Trash2, Edit2, Users } from "lucide-react";

interface PatientDataTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const CONDITION_STYLES: Record<
  PatientCondition,
  { bg: string; text: string; dot: string }
> = {
  General: {
    bg: "bg-[#EBF3FE]",
    text: "text-[#2F65F6]",
    dot: "bg-[#2F65F6]",
  },
  Chronic: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#1D4ED8]",
    dot: "bg-[#1D4ED8]",
  },
  Recovering: {
    bg: "bg-[#ECFDF5]",
    text: "text-[#10B981]",
    dot: "bg-[#10B981]",
  },
  "Follow-up": {
    bg: "bg-[#FEF3C7]",
    text: "text-[#D97706]",
    dot: "bg-[#D97706]",
  },
  Critical: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
};

export function PatientDataTable({
  patients,
  onEdit,
  onDelete,
}: PatientDataTableProps) {
  if (patients.length === 0) {
    return (
      <div className="glass-card p-12 text-center rounded-3xl space-y-3 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-[#101828]">No patient records found</p>
        <p className="text-xs text-[#64748B]">Try adjusting your search criteria or filter options.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 rounded-3xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-left border-collapse min-w-[840px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="py-3 px-6">Patient</th>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Condition</th>
              <th className="py-3 px-4">Assigned Doctor</th>
              <th className="py-3 px-4">Care Status</th>
              <th className="py-3 px-4">Blood</th>
              <th className="py-3 px-4">Registered</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70 text-xs">
            {patients.map((pt, i) => {
              const condStyle = CONDITION_STYLES[pt.condition] || CONDITION_STYLES.General;

              return (
                <tr key={pt.id || (pt as any)._id || `pt-${i}`} className="hover:bg-white/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2F65F6]/20 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(pt.name)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/patients/${pt.id}`}
                          className="font-bold text-[#101828] hover:text-[#2F65F6] transition-colors truncate block"
                        >
                          {pt.name}
                        </Link>
                        <span className="text-[11px] text-[#64748B] truncate block">
                          {pt.age} yrs &bull; {pt.gender} &bull; {pt.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-[#64748B]">
                    {pt.patientCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                        condStyle.bg,
                        condStyle.text
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", condStyle.dot)} />
                      <span>{pt.condition}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#1E293B] truncate max-w-[160px]">
                    {pt.assignedDoctorName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        pt.status === "Outpatient" && "bg-blue-50 text-blue-700",
                        pt.status === "Admitted" && "bg-amber-50 text-amber-700",
                        pt.status === "Discharged" && "bg-emerald-50 text-emerald-700"
                      )}
                    >
                      {pt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#101828]">
                    {pt.bloodGroup}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B] text-[11px] whitespace-nowrap">
                    {formatDate(pt.registrationDate)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(pt)}
                        className="p-1.5 text-[#64748B] hover:text-[#2F65F6] hover:bg-white rounded-lg transition-colors cursor-pointer"
                        title="Edit patient"
                        aria-label="Edit patient"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(pt)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                        title="Delete patient"
                        aria-label="Delete patient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/patients/${pt.id}`}
                        className="p-1.5 text-[#2F65F6] hover:bg-white rounded-lg border border-white/80 transition-colors"
                        title="View patient chart"
                        aria-label="View patient chart"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
