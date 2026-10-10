"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Stethoscope,
  Users,
  Calendar,
  Building2,
  TrendingUp,
  CreditCard,
  UserCheck,
  ShoppingBag,
  AlertCircle,
  Wallet,
  Settings,
  Shield,
  X,
  LogOut,
  Activity,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export function MobileSidebar() {
  const pathname = usePathname();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen, showToast } = useDoctorTracker();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isMobileSidebarOpen) return null;

  const mainMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGrid, isExact: true },
    { label: "Doctors", href: "/doctors", icon: Stethoscope },
    { label: "Patient", href: "/patients", icon: Users },
    { label: "Appointment", href: "/appointments", icon: Calendar },
    { label: "Departments", href: "/departments", icon: Building2 },
    { label: "Analytics & Reports", href: "/analytics", icon: TrendingUp },
    { label: "Billing & Insurance", href: "/billing", icon: CreditCard },
  ];

  const otherMenuItems = [
    { label: "Staff", href: "/staff", icon: UserCheck },
    { label: "Pharmacy Management", href: "/pharmacy", icon: ShoppingBag },
    { label: "Emergency & Admission", href: "/emergency", icon: AlertCircle },
    { label: "Setting", href: "/settings", icon: Settings },
    { label: "Admin Panel", href: "/admin", icon: Shield },
  ];

  const isNavActive = (href: string, isExact?: boolean) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    if (isExact) return pathname === href;
    return pathname.startsWith(href) && href !== "/dashboard";
  };

  const filteredMainMenu = mainMenuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOtherMenu = otherMenuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasNoResults =
    searchQuery.trim().length > 0 &&
    filteredMainMenu.length === 0 &&
    filteredOtherMenu.length === 0;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B132B]/30 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Frosted Glass Drawer */}
      <div className="fixed inset-y-0 left-0 w-[280px] bg-white/80 backdrop-blur-2xl border-r border-white/80 flex flex-col z-50 animate-fade-in shadow-2xl">
        {/* Header */}
        <div className="h-[72px] px-6 flex items-center justify-between border-b border-white/50 shrink-0">
          <Link
            href="/dashboard"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2F65F6] to-[#4F84F8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 border border-white/30">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#101828] tracking-tight leading-none">
                Medcare
              </span>
              <span className="text-[10px] font-medium text-[#94A3B8] tracking-wider uppercase mt-1">
                Care Guide BD
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-[#64748B] hover:text-[#1E293B] hover:bg-white/80 rounded-xl transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 shrink-0 border-b border-white/40">
          <div className="relative flex items-center bg-white/60 backdrop-blur-md border border-white/80 rounded-full px-3 py-2 text-xs text-[#64748B]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-0.5 text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto overscroll-contain">
          {hasNoResults ? (
            <div className="py-8 text-center px-4">
              <p className="text-xs text-[#64748B]">No navigation items found</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-[#2F65F6] font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              {filteredMainMenu.length > 0 && (
                <div>
                  <span className="px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">
                    Menu
                  </span>
                  <nav className="space-y-1">
                    {filteredMainMenu.map((item) => {
                      const active = isNavActive(item.href, item.isExact);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium border transition-all",
                            active
                              ? "glass-active-item font-semibold"
                              : "text-[#64748B] border-transparent hover:text-[#1E293B] hover:bg-white/60"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {active && (
                            <ChevronRight className="w-4 h-4 text-[#2F65F6] shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              )}

              {filteredOtherMenu.length > 0 && (
                <div>
                  <span className="px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">
                    Other Menu
                  </span>
                  <nav className="space-y-1">
                    {filteredOtherMenu.map((item) => {
                      const active = isNavActive(item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium border transition-all",
                            active
                              ? "glass-active-item font-semibold"
                              : "text-[#64748B] border-transparent hover:text-[#1E293B] hover:bg-white/60"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {active && (
                            <ChevronRight className="w-4 h-4 text-[#2F65F6] shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/50 shrink-0 bg-white/40">
          <Link
            href="/login"
            onClick={() => {
              setIsMobileSidebarOpen(false);
              showToast("Signed Out", "You have signed out.", "info");
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-xs font-semibold text-[#EF4444] bg-[#FEF2F2]/80 hover:bg-[#FEF2F2] transition-colors border border-[#FEE2E2]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
