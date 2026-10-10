"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Activity,
  X,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export function MobileSidebar() {
  const pathname = usePathname();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen, showToast } = useDoctorTracker();

  if (!isMobileSidebarOpen) return null;

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      matchExact: true,
    },
    {
      label: "Doctors",
      href: "/doctors",
      icon: Stethoscope,
      badge: "Staff",
    },
    {
      label: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
  ];

  const isNavActive = (href: string, matchExact?: boolean) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    if (matchExact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D1C2E]/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-[#E8EDF3] flex flex-col z-50 animate-fade-in shadow-xl">
        {/* Header */}
        <div className="h-[70px] px-5 flex items-center justify-between border-b border-[#E8EDF3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F9F9A] flex items-center justify-center text-white shadow-sm shrink-0">
              <Activity className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#172B4D] tracking-tight truncate">
                Doctor Tracker
              </span>
              <span className="text-[10px] font-medium text-[#7A8798] truncate">
                Care Guide BD
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-[#7A8798] hover:text-[#243247] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-5 px-3 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider">
              Workspace
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isNavActive(item.href, item.matchExact);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-[#E6F7F6] text-[#0F9F9A] font-semibold"
                        : "text-[#7A8798] hover:text-[#243247] hover:bg-[#F7F9FC]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8EDF3] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0F9F9A]/15 text-[#0F9F9A] font-semibold text-xs flex items-center justify-center">
              AU
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#172B4D] truncate">Admin User</span>
              <span className="text-[11px] text-[#7A8798] truncate">Administrator</span>
            </div>
          </div>
          <Link
            href="/login"
            onClick={() => {
              setIsMobileSidebarOpen(false);
              showToast("Signed Out", "You have signed out.", "info");
            }}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium text-[#E05252] bg-[#FDEDED] hover:bg-[#FCD8D8] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
