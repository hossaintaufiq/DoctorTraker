import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { DoctorTrackerProvider } from "@/context/DoctorTrackerContext";
import { ToastContainer } from "@/components/common/ToastContainer";
import { AddDoctorModal } from "@/components/modals/AddDoctorModal";
import { EditDoctorModal } from "@/components/modals/EditDoctorModal";
import { AddPatientModal } from "@/components/modals/AddPatientModal";
import { EditPatientModal } from "@/components/modals/EditPatientModal";
import { MessagesModal } from "@/components/modals/MessagesModal";
import { ActivityLogsModal } from "@/components/modals/ActivityLogsModal";
import { BookAppointmentModal } from "@/components/modals/BookAppointmentModal";
import { GenerateInvoiceModal } from "@/components/modals/GenerateInvoiceModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Doctor Tracker | Healthcare Management Admin Dashboard",
  description: "Modern healthcare operations and staff administration dashboard by Care Guide BD.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-[#F7F9FC] text-[#243247] antialiased">
        <DoctorTrackerProvider>
          {children}
          <AddDoctorModal />
          <EditDoctorModal />
          <AddPatientModal />
          <EditPatientModal />
          <MessagesModal />
          <ActivityLogsModal />
          <BookAppointmentModal />
          <GenerateInvoiceModal />
          <ToastContainer />
        </DoctorTrackerProvider>
      </body>
    </html>
  );
}
