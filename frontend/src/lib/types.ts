export type DoctorSpecialty =
  | "Cardiology"
  | "Neurology"
  | "Pediatrics"
  | "Orthopedics"
  | "Dermatology"
  | "Oncology"
  | "General Medicine"
  | "Gynecology"
  | "Psychiatry";

export type DoctorStatus = "Active" | "In Surgery" | "On Leave" | "Off Duty";

export interface Doctor {
  id: string;
  name: string;
  avatar?: string;
  specialty: DoctorSpecialty;
  hospital: string;
  email: string;
  phone: string;
  roomNumber: string;
  patientCount: number;
  maxPatients: number;
  status: DoctorStatus;
  rating: number;
  experienceYears: number;
  joinedDate: string;
  biography?: string;
}

export type PatientCondition = "General" | "Chronic" | "Recovering" | "Follow-up" | "Critical";

export type PatientGender = "Male" | "Female" | "Other";

export interface Patient {
  id: string;
  name: string;
  patientCode: string; // e.g., PT-1042
  avatar?: string;
  age: number;
  gender: PatientGender;
  assignedDoctorId: string;
  assignedDoctorName: string;
  condition: PatientCondition;
  registrationDate: string;
  phone: string;
  email: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  lastVisit: string;
  notes?: string;
  status: "Admitted" | "Outpatient" | "Discharged";
}

export interface MetricSummary {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  iconName: "Stethoscope" | "Users" | "UserCheck" | "UserPlus";
  trendPercentage: number;
  trendDirection: "up" | "down";
  supportingText: string;
}

export interface PatientGrowthData {
  month: string;
  patients: number;
  admissions: number;
  discharges: number;
}

export interface DoctorPatientDistribution {
  name: string;
  specialty: string;
  patients: number;
  capacity: number;
  avatarColor?: string;
}

export interface ConditionDistribution {
  name: PatientCondition;
  value: number;
  percentage: number;
  color: string;
  bgLight: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "alert";
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "success" | "info" | "warning" | "error";
}
