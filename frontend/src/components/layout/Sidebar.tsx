"use client";

import React from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export function Sidebar() {
  const pathname = usePathname();
  const { showToast } = useDoctorTracker();

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
    { label: "Payment", href: "/payment", icon: Wallet },
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

  return (
    <aside className="hidden lg:flex flex-col w-[250px] shrink-0 bg-white border-r border-[#EBF0F7] h-screen sticky top-0 z-30 select-none overflow-hidden">
      {/* Brand Header */}
      <Link href="/dashboard" className="h-[72px] px-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2F65F6] flex items-center justify-center text-white shadow-xs shrink-0">
          <Activity className="w-5 h-5 stroke-[2.5]" />
        </div>
        <span className="text-xl font-bold text-[#101828] tracking-tight">
          Medcare
        </span>
      </Link>

      {/* Search Input with ⌘ K */}
      <div className="px-5 pb-3">
        <div className="relative flex items-center bg-[#F4F7FB] border border-[#EBF0F7] rounded-full px-3 py-2 text-xs text-[#64748B]">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none"
          />
          <kbd className="text-[10px] font-semibold text-[#94A3B8] bg-white px-1.5 py-0.5 rounded-md border border-[#E2E8F0] shadow-2xs shrink-0">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Nav Menu Lists */}
      <div className="flex-1 px-4 py-2 space-y-5 overflow-y-auto">
        {/* Menu Section 1 */}
        <div>
          <span className="px-3 text-[11px] font-semibold text-[#94A3B8] block mb-2">
            Menu
          </span>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const active = isNavActive(item.href, item.isExact);
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all",
                    active
                      ? "bg-[#EBF3FE] text-[#2F65F6] font-semibold border border-[#DCE8FC]"
                      : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        active ? "text-[#2F65F6] stroke-[2.2]" : "text-[#64748B] stroke-[1.8]"
                      )}
                    />
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

        {/* Menu Section 2 */}
        <div>
          <span className="px-3 text-[11px] font-semibold text-[#94A3B8] block mb-2">
            Other Menu
          </span>
          <nav className="space-y-1">
            {otherMenuItems.map((item) => {
              const active = isNavActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all",
                    active
                      ? "bg-[#EBF3FE] text-[#2F65F6] font-semibold border border-[#DCE8FC]"
                      : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      active ? "text-[#2F65F6] stroke-[2.2]" : "text-[#64748B] stroke-[1.8]"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Log In Control */}
      <div className="p-4 border-t border-[#EBF0F7] bg-white">
        <Link
          href="/login"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] text-xs font-medium text-[#64748B] hover:text-[#1E293B] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-[#64748B]" />
            <span>Log In</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
        </Link>
      </div>
    </aside>
  );
}
