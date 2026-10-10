"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  ArrowUpRight,
  MessageCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { cn } from "@/lib/utils";

const SPECIALISTS_LIST = [
  {
    id: "spec-1",
    name: "Dr. Eleanor Pena",
    specialty: "MBBS, MD (Cardiology)",
    status: "Available",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    statusType: "success",
  },
  {
    id: "spec-2",
    name: "Dr. Esther Howard",
    specialty: "MBBS, MD (Cardiology)",
    status: "On duty",
    avatar: "https://images.unsplash.com/photo-1594824813576-2f08511634b8?w=150&auto=format&fit=crop&q=80",
    statusType: "info",
  },
  {
    id: "spec-3",
    name: "Dr. Theresa Webb",
    specialty: "MBBS, MD (Cardiology)",
    status: "Available",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    statusType: "success",
  },
  {
    id: "spec-4",
    name: "Dr. Jacob Alex",
    specialty: "MBBS, MD (Cardiology)",
    status: "Available",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    statusType: "success",
  },
];

export function OurSpecialistCard() {
  const { showToast } = useDoctorTracker();

  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#101828] tracking-tight">
            Our Specialist
          </h3>
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
            Cardiologist
          </span>
        </div>

        {/* Doctor Photo */}
        <div className="h-56 sm:h-64 w-full relative overflow-hidden bg-gradient-to-t from-gray-900/30 to-transparent">
          <img
            src="/images/doctor_hero.jpg"
            alt="Dr. Salman Hossain"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Frosted Bottom Details Card */}
        <div className="p-3.5 bg-white/95 backdrop-blur-md border-t border-[#EBF0F7] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[#101828] truncate">
              Dr. Salman Hossain
            </h4>
            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
              <span className="text-[#94A3B8]">Qualification:</span> MBBS, MD (Cardiology)
            </p>
            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
              <span className="text-[#94A3B8]">Availability:</span> Sat-Thu | 5:00 PM-9:00 PM
            </p>
          </div>

          {/* Blue Circular Message/Chat Button */}
          <button
            type="button"
            onClick={() =>
              showToast("Direct Chat", "Connecting with Dr. Salman Hossain...", "info")
            }
            className="w-9 h-9 rounded-full bg-[#2F65F6] text-white flex items-center justify-center shrink-0 hover:bg-[#1E4FD8] transition-colors shadow-xs"
            aria-label="Message doctor"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Specialists Mini List */}
      <div className="space-y-3.5 divide-y divide-[#F1F5F9] -my-1">
        {SPECIALISTS_LIST.map((spec, i) => (
          <div
            key={spec.id}
            className={cn(
              "flex items-center justify-between gap-3 pt-3 first:pt-0",
              i !== 0 && "pt-3.5"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F4F7FB] border border-[#EBF0F7] shrink-0">
                <img
                  src={spec.avatar}
                  alt={spec.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#101828] truncate">
                  {spec.name}
                </h5>
                <p className="text-[10px] text-[#94A3B8] truncate">
                  {spec.specialty}
                </p>
              </div>
            </div>

            {/* Status Pill */}
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0",
                spec.statusType === "success"
                  ? "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]"
                  : "bg-[#EBF3FE] text-[#2F65F6] border-[#BFDBFE]"
              )}
            >
              &bull; {spec.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
