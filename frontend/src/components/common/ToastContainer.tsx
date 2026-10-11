"use client";

import React from "react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useDoctorTracker();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex flex-col gap-2.5 max-w-sm w-auto sm:w-full pointer-events-none mx-auto">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-xl animate-fade-in transition-all"
            role="status"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && (
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
              )}
              {isError && (
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <XCircle className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
              )}
              {isWarning && (
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <AlertCircle className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
              )}
              {!isSuccess && !isError && !isWarning && (
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Info className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h5 className="text-xs sm:text-sm font-bold text-[#101828] leading-tight">
                {toast.title}
              </h5>
              {toast.description && (
                <p className="text-[11px] sm:text-xs text-[#64748B] mt-1 leading-normal">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#94A3B8] hover:text-[#101828] p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer shrink-0"
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
