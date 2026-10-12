"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Mail,
  Bell,
  Settings,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Sparkles,
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
    unreadMessageCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsMobileSidebarOpen,
    setIsMessagesModalOpen,
    setIsLogsModalOpen,
    user,
    logout,
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
    <header className="h-[72px] bg-white/65 backdrop-blur-2xl border-b border-white/60 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Left side: Search bar & mobile toggle */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 text-[#64748B] hover:text-[#1E293B] bg-white/60 backdrop-blur-md hover:bg-white/90 rounded-2xl border border-white/80 shadow-2xs transition-all"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Wide Glass Pill Search Input */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <input
            type="text"
            placeholder="Search patients, doctors, appointments..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-white/50 backdrop-blur-md border border-white/80 rounded-full pl-4 pr-10 py-2.5 text-xs text-[#1E293B] placeholder-[#94A3B8] focus:bg-white/95 focus:outline-none focus:border-[#2F65F6]/50 focus:ring-2 focus:ring-[#2F65F6]/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right side: Mail, Bell, Profile with frosted glass styles (No theme toggle button) */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* System Activity & Security Logs Button */}
        <button
          type="button"
          onClick={() => setIsLogsModalOpen(true)}
          className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center text-[#64748B] hover:bg-white/90 hover:text-[#2F65F6] shadow-2xs hover:shadow-xs transition-all"
          title="Security & System Activity Logs"
          aria-label="Activity Logs"
        >
          <Sparkles className="w-4 h-4 stroke-[1.8]" />
        </button>

        {/* Mail / Messaging Button */}
        <button
          type="button"
          onClick={() => setIsMessagesModalOpen(true)}
          className="relative w-9 h-9 rounded-full bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center text-[#64748B] hover:bg-white/90 hover:text-[#2F65F6] shadow-2xs hover:shadow-xs transition-all"
          title="Clinical Messages (Upcoming Feature)"
          aria-label="Messages"
        >
          <Mail className="w-4 h-4 stroke-[1.8]" />
          {unreadMessageCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#2F65F6] rounded-full ring-2 ring-white shadow-xs animate-pulse" />
          )}
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
              "relative w-9 h-9 rounded-full bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center text-[#64748B] hover:bg-white/90 hover:text-[#2F65F6] shadow-2xs hover:shadow-xs transition-all",
              showNotifications && "bg-white text-[#2F65F6] border-[#2F65F6]/40 shadow-xs"
            )}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-tr from-[#EF4444] to-[#F87171] rounded-full ring-2 ring-white shadow-xs animate-pulse" />
            )}
          </button>

          {/* Frosted Glass Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white/95 backdrop-blur-3xl rounded-3xl border border-white/95 popover-shadow p-4 z-50 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#101828]">Notifications</h4>
                  {unreadNotificationCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#2F65F6]/10 text-[#2F65F6] border border-[#2F65F6]/20">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-semibold text-[#2F65F6] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100/80 mt-2 -mx-1 px-1">
                {notifications.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationAsRead(item.id)}
                    className={cn(
                      "py-2.5 px-2.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3 my-1",
                      (item.isRead || item.read)
                        ? "opacity-75 hover:bg-white/60"
                        : "bg-white/80 hover:bg-white border border-white/90 shadow-2xs"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        item.read ? "bg-transparent" : "bg-[#2F65F6] ring-2 ring-[#2F65F6]/20"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#101828] truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">
                        {item.message}
                      </p>
                      <span className="text-[10px] font-medium text-[#94A3B8] mt-1 block">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill: Authenticated User */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-full bg-white/50 backdrop-blur-md border border-white/80 hover:border-white hover:bg-white/80 transition-all shadow-2xs hover:shadow-xs"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-[#101828] leading-tight">
                {user?.name?.split(" ")[0] || "User"}
              </span>
              <span className="text-[10px] font-medium text-[#94A3B8] leading-tight capitalize">
                {user?.role || "Staff"}
              </span>
            </div>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2F65F6]/20 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-xs flex items-center justify-center border border-white/80 shrink-0 overflow-hidden shadow-2xs">
              <img
                src="/images/doctor_hero.jpg"
                alt="Administrator"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            {/* Settings Gear Icon */}
            <div className="w-7 h-7 rounded-full bg-white/80 border border-white/60 flex items-center justify-center text-[#64748B] shadow-2xs">
              <Settings className="w-3.5 h-3.5 stroke-[1.8]" />
            </div>
          </button>

          {/* Profile Dropdown Glass Card */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-3xl rounded-3xl border border-white/95 popover-shadow p-2.5 z-50 animate-fade-in text-xs shadow-2xl">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="font-bold text-[#101828]">{user?.name || "Administrator"}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user?.email || "admin@doctortracker.com"}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1E293B] hover:bg-white/80 transition-colors font-medium"
              >
                <User className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Profile Settings</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1E293B] hover:bg-white/80 transition-colors font-medium"
              >
                <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                <span>System Preferences</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setIsLogsModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1E293B] hover:bg-white/80 transition-colors font-medium text-left cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2F65F6]" />
                <span>System Audit Logs</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#EF4444] hover:bg-[#FEF2F2]/80 transition-colors font-medium text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
