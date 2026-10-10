"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Star, Award, Shield } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { getInitials, cn } from "@/lib/utils";

export function TopDoctorsOverview() {
  const { doctors } = useDoctorTracker();

  // Sort by patientCount and take top 5
  const topDoctors = [...doctors]
    .sort((a, b) => b.patientCount - a.patientCount)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#172B4D] tracking-tight">
            Top Doctors
          </h3>
          <p className="text-xs text-[#7A8798] mt-0.5">
            Leading physicians by patient volume
          </p>
        </div>

        <Link
          href="/doctors"
          className="text-xs font-semibold text-[#0F9F9A] hover:text-[#0B7F7A] inline-flex items-center gap-0.5 hover:underline"
        >
          <span>View all doctors</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-[#F0F4F8] -my-1">
        {topDoctors.map((doc, idx) => {
          const isActive = doc.status === "Active";
          const isInSurgery = doc.status === "In Surgery";

          return (
            <Link
              key={doc.id}
              href={`/doctors/${doc.id}`}
              className="py-3 flex items-center justify-between gap-3 hover:bg-[#F7F9FC] -mx-2 px-2 rounded-xl transition-all group"
            >
              {/* Doctor Details */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with Status Dot */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#0F9F9A]/15 text-[#0F9F9A] font-bold text-xs flex items-center justify-center border border-[#0F9F9A]/20">
                    {getInitials(doc.name)}
                  </div>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
                      isActive
                        ? "bg-[#16A36A]"
                        : isInSurgery
                        ? "bg-[#E9A23B]"
                        : "bg-[#7A8798]"
                    )}
                    title={doc.status}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#172B4D] group-hover:text-[#0F9F9A] transition-colors truncate">
                      {doc.name}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#FEF7EC] text-[#D97706] font-semibold">
                        Top
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A8798] truncate">
                    {doc.specialty} &bull; {doc.experienceYears} yrs exp
                  </p>
                </div>
              </div>

              {/* Patient Count & Rating */}
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-[#172B4D] block">
                  {doc.patientCount} pts
                </span>
                <div className="flex items-center justify-end gap-1 text-[11px] text-[#7A8798] mt-0.5">
                  <Star className="w-3 h-3 text-[#E9A23B] fill-[#E9A23B]" />
                  <span>{doc.rating.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#F0F4F8] flex items-center justify-between text-xs text-[#7A8798]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
          <span>Staff capacity 84% utilized</span>
        </div>
        <span className="font-semibold text-[#172B4D]">8 Active Specialties</span>
      </div>
    </div>
  );
}
