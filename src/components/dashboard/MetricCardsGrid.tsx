"use client";

import React from "react";
import {
  Stethoscope,
  Users,
  UserCheck,
  UserPlus,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  Stethoscope: Stethoscope,
  Users: Users,
  UserCheck: UserCheck,
  UserPlus: UserPlus,
};

export function MetricCardsGrid() {
  const { metrics } = useDoctorTracker();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
      {metrics.map((card) => {
        const IconComponent = ICON_MAP[card.iconName] || Stethoscope;

        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow card-shadow-hover transition-all flex flex-col justify-between"
          >
            {/* Top Row: Label & Softly Tinted Teal Icon */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#7A8798] uppercase tracking-wider">
                {card.label}
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#E6F7F6] text-[#0F9F9A] flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            {/* Middle Row: Prominent Navy Value */}
            <div className="my-3">
              <span className="text-2xl sm:text-[30px] font-bold text-[#172B4D] tracking-tight leading-none">
                {card.value}
              </span>
            </div>

            {/* Bottom Row: Trend Pill & Supporting Text */}
            <div className="flex items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#EAF7F0] text-[#16A36A] text-[11px] font-bold">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+{card.trendPercentage}%</span>
              </div>
              <span className="text-xs text-[#7A8798] truncate">
                {card.supportingText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
