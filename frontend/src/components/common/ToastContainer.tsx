"use client";

import React from "react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useDoctorTracker();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E8EDF3] popover-shadow animate-fade-in transition-all"
            role="alert"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#16A36A]" />}
              {isError && <XCircle className="w-5 h-5 text-[#E05252]" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-[#E9A23B]" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="w-5 h-5 text-[#0F9F9A]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-[#172B4D] leading-tight">
                {toast.title}
              </h5>
              {toast.description && (
                <p className="text-xs text-[#7A8798] mt-1 leading-normal">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#7A8798] hover:text-[#243247] p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
