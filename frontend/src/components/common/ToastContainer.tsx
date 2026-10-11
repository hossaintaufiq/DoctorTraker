"use client";

import React from "react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useDoctorTracker();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-3 sm:bottom-5 inset-x-3 sm:inset-x-auto sm:right-5 z-[9999] flex flex-col gap-2 items-center sm:items-end pointer-events-none select-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            role="status"
            className="w-full max-w-[420px] sm:max-w-sm pointer-events-auto flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-2xl animate-in slide-in-from-bottom-3 duration-200 transition-all"
          >
            {/* Type Indicator Icon */}
            <div className="shrink-0 mt-0.5">
              {isSuccess && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </div>
              )}
              {isError && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-2xs">
                  <XCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </div>
              )}
              {isWarning && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
                  <AlertCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </div>
              )}
              {!isSuccess && !isError && !isWarning && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                  <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </div>
              )}
            </div>

            {/* Content text */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h5 className="text-xs sm:text-sm font-bold text-[#101828] leading-tight truncate sm:whitespace-normal">
                {toast.title}
              </h5>
              {toast.description && (
                <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 leading-snug break-words line-clamp-2 sm:line-clamp-none">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#94A3B8] hover:text-[#101828] p-1.5 -mr-1 -mt-1 rounded-lg hover:bg-black/5 active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
