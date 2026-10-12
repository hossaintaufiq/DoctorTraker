"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MoreVertical,
  ChevronRight,
  Eye,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { getInitials, formatDate, cn } from "@/lib/utils";
import { PatientCondition } from "@/lib/types";

const CONDITION_STYLES: Record<
  PatientCondition,
  { bg: string; text: string; dot: string }
> = {
  General: {
    bg: "bg-[#E6F7F6]",
    text: "text-[#0F9F9A]",
    dot: "bg-[#0F9F9A]",
  },
  Chronic: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#2563EB]",
    dot: "bg-[#2563EB]",
  },
  Recovering: {
    bg: "bg-[#EAF7F0]",
    text: "text-[#16A36A]",
    dot: "bg-[#16A36A]",
  },
  "Follow-up": {
    bg: "bg-[#FEF7EC]",
    text: "text-[#D97706]",
    dot: "bg-[#D97706]",
  },
  Critical: {
    bg: "bg-[#FDEDED]",
    text: "text-[#E05252]",
    dot: "bg-[#E05252]",
  },
};

export function RecentPatientsTable() {
  const { patients, deletePatient, showToast, openConfirmDialog } = useDoctorTracker();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Display top 5 latest patients
  const displayPatients = patients.slice(0, 5);

  return (
    <div
      ref={tableRef}
      className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full"
    >
      {/* Table Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
            Recent Patients
          </h3>
          <p className="text-xs text-[#7A8798] mt-0.5">
            Latest patient registrations and their assigned doctors
          </p>
        </div>

        <Link
          href="/patients"
          className="text-xs font-semibold text-[#0F9F9A] hover:text-[#0B7F7A] inline-flex items-center gap-0.5 hover:underline"
        >
          <span>View all patients</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto -mx-5 sm:-mx-6 flex-1">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-y border-[#E8EDF3] bg-[#F7F9FC]/70 text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider">
              <th className="py-2.5 px-5 sm:px-6">Patient</th>
              <th className="py-2.5 px-4">Patient ID</th>
              <th className="py-2.5 px-4">Assigned Doctor</th>
              <th className="py-2.5 px-4">Condition</th>
              <th className="py-2.5 px-4">Registration</th>
              <th className="py-2.5 px-5 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F8] text-xs">
            {displayPatients.map((patient, i) => {
              const conditionStyle =
                CONDITION_STYLES[patient.condition] || CONDITION_STYLES.General;
              const isMenuOpen = activeMenuId === patient.id;

              return (
                <tr
                  key={patient.id || (patient as any)._id || `pt-rec-${i}`}
                  className="hover:bg-[#F7F9FC]/70 transition-colors group"
                >
                  {/* Patient Name + Avatar */}
                  <td className="py-3.5 px-5 sm:px-6">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="flex items-center gap-2.5 group-hover:opacity-90"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#E6F7F6] text-[#0F9F9A] font-bold text-xs flex items-center justify-center border border-[#0F9F9A]/20 shrink-0">
                        {getInitials(patient.name)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-[#172B4D] group-hover:text-[#0F9F9A] transition-colors truncate block">
                          {patient.name}
                        </span>
                        <span className="text-[11px] text-[#7A8798] block">
                          {patient.gender}, {patient.age} yrs
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* Patient ID */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#7A8798]">
                    {patient.patientCode}
                  </td>

                  {/* Assigned Doctor */}
                  <td className="py-3.5 px-4 text-[#243247] font-medium">
                    {patient.assignedDoctorName}
                  </td>

                  {/* Condition Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold",
                        conditionStyle.bg,
                        conditionStyle.text
                      )}
                    >
                      <span
                        className={cn("w-1.5 h-1.5 rounded-full", conditionStyle.dot)}
                      />
                      {patient.condition}
                    </span>
                  </td>

                  {/* Registration Date */}
                  <td className="py-3.5 px-4 text-[#7A8798] text-[11px]">
                    {formatDate(patient.registrationDate)}
                  </td>

                  {/* Action Menu */}
                  <td className="py-3.5 px-5 sm:px-6 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(isMenuOpen ? null : patient.id)
                      }
                      className="p-1.5 text-[#7A8798] hover:text-[#243247] hover:bg-white rounded-lg border border-transparent hover:border-[#E8EDF3] transition-all"
                      aria-label="Patient options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-6 mt-1 w-36 bg-white rounded-xl border border-[#E8EDF3] popover-shadow p-1 z-50 animate-fade-in text-left">
                        <Link
                          href={`/patients/${patient.id}`}
                          onClick={() => setActiveMenuId(null)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#243247] hover:bg-[#F7F9FC] text-xs font-medium"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#7A8798]" />
                          <span>View Chart</span>
                        </Link>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            showToast(
                              "Follow-up Booked",
                              `Consultation scheduled for ${patient.name}.`,
                              "info"
                            );
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#243247] hover:bg-[#F7F9FC] text-xs font-medium"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#7A8798]" />
                          <span>Schedule</span>
                        </button>
                        <div className="my-1 border-t border-[#E8EDF3]" />
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            openConfirmDialog({
                              title: "Delete Patient Record",
                              itemName: `${patient.name} (${patient.patientCode})`,
                              itemType: "Patient File",
                              message: `Are you sure you want to remove ${patient.name} from the active patient registry? This action cannot be undone.`,
                              confirmLabel: "Yes, Delete Record",
                              onConfirm: () => {
                                deletePatient(patient.id);
                              },
                            });
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#E05252] hover:bg-[#FDEDED] text-xs font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
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
