"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Check,
  Search,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  breadcrumbTitle?: string;
  parentPath?: string;
  parentLabel?: string;
}

export function TopNavbar({
  breadcrumbTitle,
  parentPath = "/dashboard",
  parentLabel = "Workspace",
}: TopNavbarProps) {
  const pathname = usePathname();
  const {
    unreadNotificationCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsMobileSidebarOpen,
    showToast,
  } = useDoctorTracker();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Derive current page title if not explicitly passed
  const getPageTitle = () => {
    if (breadcrumbTitle) return breadcrumbTitle;
    if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/doctors")) return "Doctors";
    if (pathname.startsWith("/patients")) return "Patients";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Dashboard";
  };

  const currentTitle = getPageTitle();

  return (
    <header className="h-[70px] bg-white border-b border-[#E8EDF3] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 text-[#7A8798] hover:text-[#172B4D] hover:bg-[#F7F9FC] rounded-lg border border-[#E8EDF3]"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Clean Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-[#7A8798]" aria-label="Breadcrumb">
          <Link
            href={parentPath}
            className="hover:text-[#243247] transition-colors"
          >
            {parentLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9BA6B5]" />
          <span className="text-[#172B4D] font-semibold">{currentTitle}</span>
        </nav>
      </div>

      {/* Right side: Notifications & Profile Control */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={cn(
              "relative p-2 rounded-xl text-[#7A8798] hover:text-[#172B4D] hover:bg-[#F7F9FC] border border-[#E8EDF3] transition-all",
              showNotifications && "bg-[#F7F9FC] text-[#0F9F9A] border-[#0F9F9A]/30"
            )}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E05252] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E8EDF3] popover-shadow p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8EDF3]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#172B4D]">Notifications</h4>
                    {unreadNotificationCount > 0 && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#E6F7F6] text-[#0F9F9A]">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-medium text-[#0F9F9A] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#F0F4F8] mt-2 -mx-1 px-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={cn(
                        "py-2.5 px-2 rounded-xl cursor-pointer transition-colors flex items-start gap-3",
                        item.read ? "opacity-75 hover:bg-[#F7F9FC]" : "bg-[#F7F9FC]/80 hover:bg-[#E6F7F6]/40"
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          item.read ? "bg-transparent" : "bg-[#0F9F9A]"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#172B4D] truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#7A8798] mt-0.5 line-clamp-2">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-[#9BA6B5] mt-1 block">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-[#E8EDF3] hover:bg-[#F7F9FC] transition-all"
            aria-label="User profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F9F9A]/15 text-[#0F9F9A] font-semibold text-xs flex items-center justify-center border border-[#0F9F9A]/25">
              AU
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#172B4D] leading-tight">
                Admin User
              </span>
              <span className="text-[10px] text-[#7A8798] leading-tight">
                Administrator
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E8EDF3] popover-shadow p-2 z-50 animate-fade-in text-xs">
                <div className="px-3 py-2 border-b border-[#E8EDF3] mb-1">
                  <p className="font-semibold text-[#172B4D]">Admin User</p>
                  <p className="text-[11px] text-[#7A8798] truncate">admin@careguide.bd</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#243247] hover:bg-[#F7F9FC] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#7A8798]" />
                  <span>Account Settings</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#243247] hover:bg-[#F7F9FC] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#7A8798]" />
                  <span>System Preferences</span>
                </Link>
                <div className="my-1 border-t border-[#E8EDF3]" />
                <Link
                  href="/login"
                  onClick={() => {
                    setShowProfileMenu(false);
                    showToast("Signed Out", "You have signed out of your session.", "info");
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#E05252] hover:bg-[#FDEDED] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
