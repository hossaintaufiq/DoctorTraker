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
  X,
  LogOut,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export function MobileSidebar() {
  const pathname = usePathname();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen, showToast } = useDoctorTracker();

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
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B132B]/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-[270px] bg-white border-r border-[#EBF0F7] flex flex-col z-50 animate-fade-in shadow-xl">
        {/* Header */}
        <div className="h-[72px] px-6 flex items-center justify-between border-b border-[#EBF0F7]">
          <Link
            href="/dashboard"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-[#2F65F6] flex items-center justify-center text-white shadow-xs shrink-0">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold text-[#101828] tracking-tight">
              Medcare
            </span>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
          <div>
            <span className="px-3 text-[11px] font-semibold text-[#94A3B8] uppercase block mb-1.5">
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
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all",
                      active
                        ? "bg-[#EBF3FE] text-[#2F65F6] font-semibold border border-[#DCE8FC]"
                        : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="px-3 text-[11px] font-semibold text-[#94A3B8] uppercase block mb-1.5">
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
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all",
                      active
                        ? "bg-[#EBF3FE] text-[#2F65F6] font-semibold border border-[#DCE8FC]"
                        : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
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
        <div className="p-4 border-t border-[#EBF0F7]">
          <Link
            href="/login"
            onClick={() => {
              setIsMobileSidebarOpen(false);
              showToast("Signed Out", "You have signed out.", "info");
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-xs font-semibold text-[#EF4444] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
