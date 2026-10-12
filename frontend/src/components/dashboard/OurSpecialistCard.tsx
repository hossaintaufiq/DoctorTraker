"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  ArrowUpRight,
  MessageCircle,
  Stethoscope,
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { cn } from "@/lib/utils";

export function OurSpecialistCard() {
  const { doctors, setIsMessagesModalOpen, showToast } = useDoctorTracker();

  const featuredDoctor = doctors[0] || {
    id: "doc-1",
    name: "Dr. Sarah Ahmed",
    specialty: "Cardiology",
    status: "Active",
    hospital: "Care Guide BD Medical Center",
    experienceYears: 12,
  };

  const listDoctors = doctors.slice(1, 5);

  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#101828] tracking-tight">
              Our Specialists ({doctors.length})
            </h3>
          </div>
        </div>

        {/* Diagonal Arrow Circle */}
        <Link
          href="/doctors"
          className="w-8 h-8 rounded-full bg-[#101828] text-white flex items-center justify-center hover:bg-[#2F65F6] transition-colors"
          aria-label="View all specialists"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Featured Doctor Hero Card */}
      <div className="relative rounded-2xl overflow-hidden mb-5 bg-[#F4F7FB] border border-[#EBF0F7] group">
        {/* Top Right Specialty Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-[#2F65F6] shadow-xs">
            {featuredDoctor.specialty}
          </span>
        </div>

        {/* Doctor Photo */}
        <div className="h-52 sm:h-56 w-full relative overflow-hidden bg-gradient-to-tr from-[#2F65F6]/10 to-[#93C5FD]/20 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-[#2F65F6] to-[#60A5FA] text-white font-bold text-2xl flex items-center justify-center shadow-md mb-2">
              {featuredDoctor.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-[#64748B]">Senior Consultant</span>
          </div>
        </div>

        {/* Frosted Bottom Details Card */}
        <div className="p-3.5 bg-white/95 backdrop-blur-md border-t border-[#EBF0F7] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[#101828] truncate">
              {featuredDoctor.name}
            </h4>
            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
              <span className="text-[#94A3B8]">Hospital:</span> {featuredDoctor.hospital || "Care Guide BD Medical Center"}
            </p>
            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
              <span className="text-[#94A3B8]">Experience:</span> {featuredDoctor.experienceYears || 8}+ Years &bull; Room {featuredDoctor.roomNumber || "402"}
            </p>
          </div>

          {/* Blue Circular Message/Chat Button */}
          <button
            type="button"
            onClick={() => setIsMessagesModalOpen(true)}
            className="w-9 h-9 rounded-full bg-[#2F65F6] text-white flex items-center justify-center shrink-0 hover:bg-[#1E4FD8] transition-colors shadow-xs cursor-pointer"
            aria-label="Message doctor"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Specialists Mini List */}
      <div className="space-y-3.5 divide-y divide-[#F1F5F9] -my-1">
        {listDoctors.length === 0 ? (
          <div className="py-4 text-center text-xs text-[#64748B]">
            All registered specialists active.
          </div>
        ) : (
          listDoctors.map((doc, i) => (
            <Link
              href={`/doctors/${doc.id || (doc as any)._id || ""}`}
              key={doc.id || (doc as any)._id || `doc-${i}`}
              className={cn(
                "flex items-center justify-between gap-3 pt-3 first:pt-0 hover:bg-[#F8FAFC] p-1.5 rounded-xl transition-colors group",
                i !== 0 && "pt-3.5"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#EBF3FE] text-[#2F65F6] font-bold text-xs flex items-center justify-center border border-[#EBF0F7] shrink-0">
                  {doc.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-[#101828] group-hover:text-[#2F65F6] transition-colors truncate">
                    {doc.name}
                  </h5>
                  <p className="text-[10px] text-[#94A3B8] truncate">
                    {doc.specialty} &bull; Room {doc.roomNumber || "Chamber"}
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0",
                  doc.status === "Active"
                    ? "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]"
                    : doc.status === "In Surgery"
                    ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                    : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]"
                )}
              >
                &bull; {doc.status}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
