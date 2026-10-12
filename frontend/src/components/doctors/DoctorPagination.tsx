"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DoctorPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DoctorPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DoctorPaginationProps) {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-[#64748B]">
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-bold text-[#101828]">{startItem}</span> to{" "}
          <span className="font-bold text-[#101828]">{endItem}</span> of{" "}
          <span className="font-bold text-[#101828]">{totalItems}</span> doctors
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span>Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="px-2 py-1 text-xs bg-white/70 border border-slate-200 rounded-lg text-[#101828] focus:outline-none cursor-pointer"
            aria-label="Doctors per page"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="mr-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-xl border border-slate-200 bg-white/70 text-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-xl border border-slate-200 bg-white/70 text-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
