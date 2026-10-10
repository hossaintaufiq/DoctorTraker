"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { UserCheck, Stethoscope, Plus, Star, Mail, Phone } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function StaffPage() {
  const { doctors, setIsAddDoctorModalOpen } = useDoctorTracker();

  return (
    <AppShell breadcrumbTitle="Staff" parentLabel="Other Menu" parentPath="/dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Medical & Support Staff
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Active medical specialists, clinical practitioners, nursing leads, and on-call teams.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow card-shadow-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] font-bold text-sm flex items-center justify-center shrink-0">
                    {getInitials(doc.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#101828]">{doc.name}</h3>
                    <span className="text-xs font-semibold text-[#2F65F6]">{doc.specialty}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F1F5F9] space-y-1.5 text-xs text-[#64748B]">
                  <p>Email: {doc.email}</p>
                  <p>Phone: {doc.phone}</p>
                  <p>Room: {doc.roomNumber}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#10B981]">
                  &bull; {doc.status}
                </span>
                <Link
                  href={`/doctors/${doc.id}`}
                  className="text-xs font-semibold text-[#2F65F6] hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
