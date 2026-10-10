"use client";

import React, { Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { MobileSidebar } from "./MobileSidebar";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbTitle?: string;
  parentPath?: string;
  parentLabel?: string;
}

function AppShellContent({
  children,
  breadcrumbTitle,
  parentPath,
  parentLabel,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex text-[#243247]">
      {/* Persistent Left Sidebar (256px) */}
      <Sidebar />

      {/* Mobile Slide-over Drawer */}
      <MobileSidebar />

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F7F9FC]">
        <TopNavbar
          breadcrumbTitle={breadcrumbTitle}
          parentPath={parentPath}
          parentLabel={parentLabel}
        />

        {/* Content Container precisely calibrated for 1440px healthcare dashboard */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9FC]" />}>
      <AppShellContent {...props} />
    </Suspense>
  );
}
