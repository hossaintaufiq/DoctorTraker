"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Activity,
  HelpCircle,
  MoreVertical,
  LogOut,
  User,
  Settings as SettingsIcon,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export function Sidebar() {
  const pathname = usePathname();
  const { showToast } = useDoctorTracker();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <aside className="hidden lg:flex flex-col w-[256px] shrink-0 bg-white border-r border-[#E8EDF3] h-screen sticky top-0 z-30 select-none">
      {/* Brand Identity Header */}
      <div className="h-[72px] px-5 flex items-center gap-3 border-b border-[#E8EDF3]">
        <div className="w-10 h-10 rounded-xl bg-[#0F9F9A] flex items-center justify-center text-white shadow-xs shrink-0">
          <Activity className="w-5 h-5 text-white stroke-[2.2]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-bold text-[#172B4D] tracking-tight leading-snug truncate">
            Doctor Tracker
          </span>
          <span className="text-[11px] font-medium text-[#7A8798] tracking-normal leading-none truncate">
            Healthcare Management
          </span>
        </div>
      </div>

      {/* Main Navigation Section */}
      <div className="flex-1 py-5 px-3 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 pb-2.5 text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider">
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
                  className={cn(
                    "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-[#E6F7F6] text-[#0F9F9A] font-semibold"
                      : "text-[#7A8798] hover:text-[#243247] hover:bg-[#F7F9FC]"
                  )}
                >
                  {/* Narrow Teal Indicator on Left */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0F9F9A] rounded-r-full" />
                  )}

                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      active
                        ? "text-[#0F9F9A] stroke-[2.2]"
                        : "text-[#7A8798] group-hover:text-[#243247] stroke-[1.8]"
                    )}
                  />

                  <span className="truncate flex-1">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Clinical Node Status Indicator */}
        <div className="px-3.5 py-3 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-[#172B4D] truncate">Care Guide BD</span>
          </div>
          <p className="text-[11px] text-[#7A8798] leading-tight">
            Main Hospital Node &bull; Operational
          </p>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3.5 border-t border-[#E8EDF3] space-y-3 bg-white" ref={profileMenuRef}>
        {/* Help & Support Card */}
        <div className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E8EDF3] flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-[#0F9F9A]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#172B4D] truncate">Need assistance?</p>
              <button
                type="button"
                onClick={() =>
                  showToast("Support Center", "Support ticket #8841 opened. An agent will connect shortly.", "info")
                }
                className="text-[11px] font-medium text-[#0F9F9A] hover:underline block truncate"
              >
                Contact support
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E8EDF3]" />

        {/* User Avatar & Profile Controls */}
        <div className="relative">
          <div className="flex items-center justify-between p-1 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#E6F7F6] text-[#0F9F9A] font-bold text-xs flex items-center justify-center border border-[#0F9F9A]/20">
                  AU
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A36A] border-2 border-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#172B4D] truncate leading-tight">
                  Admin User
                </span>
                <span className="text-[11px] text-[#7A8798] truncate leading-tight">
                  Administrator
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-1.5 text-[#7A8798] hover:text-[#243247] hover:bg-white rounded-lg border border-transparent hover:border-[#E8EDF3] transition-all"
              aria-label="Profile menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Dropdown Popover */}
          {showProfileMenu && (
            <div className="absolute bottom-12 left-0 w-full bg-white rounded-xl border border-[#E8EDF3] popover-shadow p-1.5 z-50 animate-fade-in text-xs space-y-0.5">
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#243247] hover:bg-[#F7F9FC] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#7A8798]" />
                <span>Account Profile</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#243247] hover:bg-[#F7F9FC] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#7A8798]" />
                <span>Security & Roles</span>
              </Link>
              <div className="my-1 border-t border-[#E8EDF3]" />
              <Link
                href="/login"
                onClick={() => {
                  setShowProfileMenu(false);
                  showToast("Signed Out", "You have signed out of the workspace.", "info");
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#E05252] hover:bg-[#FDEDED] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
