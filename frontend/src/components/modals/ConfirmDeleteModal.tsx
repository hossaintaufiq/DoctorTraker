"use client";

import React, { useEffect } from "react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { AlertTriangle, Trash2, X } from "lucide-react";

export function ConfirmDeleteModal() {
  const { confirmDialog, closeConfirmDialog } = useDoctorTracker();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && confirmDialog) {
        closeConfirmDialog();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmDialog, closeConfirmDialog]);

  if (!confirmDialog) return null;

  const handleConfirm = async () => {
    try {
      await confirmDialog.onConfirm();
    } finally {
      closeConfirmDialog();
    }
  };

  const isDestructive = confirmDialog.destructive !== false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeConfirmDialog}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/80 animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Subtle decorative glow in the background */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-red-100 rounded-full blur-2xl pointer-events-none opacity-60" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-orange-100 rounded-full blur-2xl pointer-events-none opacity-40" />

        {/* Close Icon in Corner */}
        <button
          onClick={closeConfirmDialog}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#101828] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="relative mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-xs mb-4">
          {isDestructive ? (
            <Trash2 className="w-6 h-6 stroke-[2.2]" />
          ) : (
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          )}
        </div>

        {/* Title & Badge */}
        <div className="text-center space-y-1.5">
          <h3
            id="confirm-dialog-title"
            className="text-xl font-bold text-[#101828] tracking-tight"
          >
            {confirmDialog.title}
          </h3>

          {confirmDialog.itemName && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/80 max-w-full truncate">
                {confirmDialog.itemType && (
                  <span className="text-red-500 font-normal">
                    {confirmDialog.itemType}:
                  </span>
                )}
                <span className="truncate">{confirmDialog.itemName}</span>
              </span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-[#64748B] pt-2 leading-relaxed">
            {confirmDialog.message}
          </p>
        </div>

        {/* Warning Callout Box */}
        <div className="mt-4 p-3 rounded-2xl bg-[#FFF5F5] border border-red-100/80 text-[11px] text-red-800 leading-snug flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>
            This action cannot be undone. Relevant records and schedules will be updated.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeConfirmDialog}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#475569] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-full transition-all cursor-pointer text-center"
          >
            {confirmDialog.cancelLabel || "Cancel"}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmDialog.confirmLabel || "Delete Record"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
