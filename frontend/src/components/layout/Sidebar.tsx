"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Search,
  ChevronRight,
  LogOut,
  ChevronDown,
  Activity,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export function Sidebar() {
  const pathname = usePathname();
  const { showToast } = useDoctorTracker();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global shortcut ⌘K / Ctrl+K to focus sidebar search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    <aside className="hidden lg:flex flex-col w-64 min-w-[256px] max-w-[256px] shrink-0 bg-white/65 backdrop-blur-2xl border-r border-white/60 h-screen sticky top-0 z-30 select-none overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Header with Glass Specular Effect */}
      <Link
        href="/dashboard"
        className="h-[72px] px-6 flex items-center gap-3 border-b border-white/40 shrink-0 hover:opacity-90 transition-opacity relative group"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2F65F6] to-[#4F84F8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 border border-white/30 transition-transform group-hover:scale-105">
          <Activity className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold text-[#101828] tracking-tight leading-none bg-gradient-to-r from-[#101828] to-[#1E293B] bg-clip-text">
              Medcare
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F65F6] animate-pulse" />
          </div>
          <span className="text-[10px] font-semibold text-[#94A3B8] tracking-wider uppercase mt-1">
            Care Guide BD
          </span>
        </div>
      </Link>

      {/* Glass Search Input with ⌘ K */}
      <div className="px-4 py-3 shrink-0">
        <div className="relative flex items-center bg-white/50 backdrop-blur-md border border-white/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] rounded-full px-3 py-2 text-xs text-[#64748B] focus-within:border-[#2F65F6]/60 focus-within:bg-white/90 focus-within:ring-2 focus-within:ring-[#2F65F6]/10 transition-all">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] mr-2 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-0.5 text-[#94A3B8] hover:text-[#1E293B] rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="text-[10px] font-bold text-[#94A3B8] bg-white/90 px-1.5 py-0.5 rounded-md border border-slate-200/80 shadow-2xs shrink-0">
              ⌘ K
            </kbd>
          )}
        </div>
      </div>

      {/* Nav Menu Lists - Glass items with smooth hover */}
      <div className="flex-1 px-3 py-2 space-y-5 overflow-y-auto overscroll-contain">
        {hasNoResults ? (
          <div className="py-8 text-center px-4">
            <p className="text-xs text-[#64748B]">No menu items found</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs text-[#2F65F6] font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {/* Menu Section 1 */}
            {filteredMainMenu.length > 0 && (
              <div>
                <span className="px-3 text-[11px] font-bold text-[#94A3B8] block mb-2 uppercase tracking-wider">
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
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium border transition-all duration-200",
                          active
                            ? "glass-active-item font-semibold shadow-xs"
                            : "text-[#64748B] border-transparent hover:text-[#1E293B] hover:bg-white/60 hover:border-white/70 hover:shadow-2xs"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0 transition-transform duration-200",
                              active
                                ? "text-[#2F65F6] stroke-[2.3] scale-105"
                                : "text-[#64748B] stroke-[1.8]"
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {active && (
                          <ChevronRight className="w-4 h-4 text-[#2F65F6] shrink-0 stroke-[2.5]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Menu Section 2 */}
            {filteredOtherMenu.length > 0 && (
              <div>
                <span className="px-3 text-[11px] font-bold text-[#94A3B8] block mb-2 uppercase tracking-wider">
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
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium border transition-all duration-200",
                          active
                            ? "glass-active-item font-semibold shadow-xs"
                            : "text-[#64748B] border-transparent hover:text-[#1E293B] hover:bg-white/60 hover:border-white/70 hover:shadow-2xs"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0 transition-transform duration-200",
                              active
                                ? "text-[#2F65F6] stroke-[2.3] scale-105"
                                : "text-[#64748B] stroke-[1.8]"
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {active && (
                          <ChevronRight className="w-4 h-4 text-[#2F65F6] shrink-0 stroke-[2.5]" />
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

      {/* Bottom Log In / Session Control */}
      <div className="p-3 border-t border-white/50 bg-white/40 backdrop-blur-md shrink-0">
        <Link
          href="/login"
          onClick={() => showToast("Session", "Redirecting to authentication portal.", "info")}
          className="flex items-center justify-between px-3 py-2.5 rounded-2xl border border-transparent hover:border-white/80 hover:bg-white/70 text-xs font-medium text-[#64748B] hover:text-[#1E293B] transition-all shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-[#64748B]" />
            <span>Switch Account</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
        </Link>
      </div>
    </aside>
  );
}
