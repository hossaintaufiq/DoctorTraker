export type DoctorSpecialty =
  | "Cardiology"
  | "Neurology"
  | "Pediatrics"
  | "Orthopedics"
  | "Dermatology"
  | "Oncology"
  | "General Medicine"
  | "Gynecology"
  | "Psychiatry"
  | "Emergency & Trauma"
  | "Radiology & Imaging"
  | "Gastroenterology"
  | "Nephrology"
  | "Ophthalmology"
  | "Anesthesiology";

export type DoctorStatus = "Active" | "In Surgery" | "On Leave" | "Off Duty";

export interface Doctor {
  id: string;
  name: string;
  avatar?: string;
  specialty: DoctorSpecialty;
  specialization?: string;
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

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  category: "Clinical" | "Billing" | "Staff" | "Security" | "Patient";
  user: string;
  action: string;
  ipAddress: string;
  status: "Success" | "Warning" | "Error" | "Info";
  details?: string;
}

export interface ChatMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "Admin" | "Doctor" | "Patient" | "Staff";
  avatar?: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  attachments?: string[];
}

export interface ConversationItem {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

export interface AppointmentItem {
  id: string;
  appointmentCode: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  roomNumber: string;
  date: string;
  timeSlot: string;
  type: "General Checkup" | "Follow-up" | "Consultation" | "Emergency" | "Surgery Review";
  status: "Confirmed" | "In-Consultation" | "Completed" | "Cancelled" | "Pending";
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceCode: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  doctorId: string;
  doctorName: string;
  issueDate: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Processing";
  paymentMethod: "Insurance" | "Credit Card" | "Cash" | "Bank Transfer" | "Mobile Pay";
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: {
    description: string;
    department: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headName: string;
  headDoctorId?: string;
  specialistsCount: number;
  activeCasesCount: number;
  totalBeds: number;
  occupiedBeds: number;
  occupancyPercentage: number;
  floor: string;
  emergencyReady: boolean;
  topServices: string[];
  equipmentSummary: string;
  rating: number;
  colorTheme: string;
}
