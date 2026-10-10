"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Sun,
  Mail,
  Bell,
  Settings,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Check,
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
  parentLabel = "Menu",
}: TopNavbarProps = {}) {
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
  const [searchVal, setSearchVal] = useState("");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] bg-white border-b border-[#EBF0F7] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Search bar & mobile toggle */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-xl border border-[#EBF0F7]"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Wide Pill Search Input */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-[#F4F7FB] border border-[#EBF0F7] rounded-full pl-4 pr-10 py-2.5 text-xs text-[#1E293B] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right side: Theme toggle, Mail, Bell, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Theme Pill Toggle */}
        <button
          type="button"
          onClick={() => showToast("Theme Changed", "Switched appearance preferences.", "info")}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#F4F7FB] border border-[#EBF0F7] rounded-full text-xs text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6] transition-all"
        >
          <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
          <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
        </button>

        {/* Mail Button */}
        <button
          type="button"
          onClick={() => showToast("Messages", "No unread direct patient messages.", "info")}
          className="w-9 h-9 rounded-full bg-[#F4F7FB] border border-[#EBF0F7] flex items-center justify-center text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6] transition-all"
          aria-label="Messages"
        >
          <Mail className="w-4 h-4 stroke-[1.8]" />
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={cn(
              "relative w-9 h-9 rounded-full bg-[#F4F7FB] border border-[#EBF0F7] flex items-center justify-center text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6] transition-all",
              showNotifications && "bg-[#EBF3FE] text-[#2F65F6] border-[#2F65F6]/30"
            )}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#EBF0F7] popover-shadow p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBF0F7]">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[#101828]">Notifications</h4>
                  {unreadNotificationCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#EBF3FE] text-[#2F65F6]">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-medium text-[#2F65F6] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5F9] mt-2 -mx-1 px-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationAsRead(item.id)}
                    className={cn(
                      "py-2.5 px-2 rounded-xl cursor-pointer transition-colors flex items-start gap-3",
                      item.read ? "opacity-75 hover:bg-[#F8FAFC]" : "bg-[#F4F7FB]/80 hover:bg-[#EBF3FE]/50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        item.read ? "bg-transparent" : "bg-[#2F65F6]"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#101828] truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-[#94A3B8] mt-1 block">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill: Sullivan Owner */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-full border border-transparent hover:border-[#EBF0F7] hover:bg-[#F4F7FB] transition-all"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-[#101828] leading-tight">
                Sullivan
              </span>
              <span className="text-[10px] text-[#94A3B8] leading-tight">
                Owner
              </span>
            </div>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#2F65F6]/15 text-[#2F65F6] font-bold text-xs flex items-center justify-center border border-[#2F65F6]/25 shrink-0 overflow-hidden">
              <img
                src="/images/doctor_hero.jpg"
                alt="Sullivan"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            {/* Settings Gear Icon */}
            <div className="w-7 h-7 rounded-full bg-[#F4F7FB] flex items-center justify-center text-[#64748B]">
              <Settings className="w-3.5 h-3.5 stroke-[1.8]" />
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EBF0F7] popover-shadow p-2 z-50 animate-fade-in text-xs">
              <div className="px-3 py-2 border-b border-[#EBF0F7] mb-1">
                <p className="font-semibold text-[#101828]">Sullivan</p>
                <p className="text-[11px] text-[#64748B] truncate">sullivan.admin@medcare.io</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1E293B] hover:bg-[#F4F7FB] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Profile Settings</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1E293B] hover:bg-[#F4F7FB] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                <span>System Preferences</span>
              </Link>
              <div className="my-1 border-t border-[#EBF0F7]" />
              <Link
                href="/login"
                onClick={() => {
                  setShowProfileMenu(false);
                  showToast("Signed Out", "You have signed out.", "info");
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
