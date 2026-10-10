# 📋 Software Requirements Specification (SRS)
## Project: Doctor Tracker — Healthcare Management Admin Portal
**Organization:** Care Guide BD  
**Version:** 1.0.0  
**Status:** Approved / Production-Ready  
**Date:** October 2026  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document details the complete functional and non-functional requirements for the **Doctor Tracker** administrative portal. The document is intended for healthcare software engineers, system architects, clinical administrators, and quality assurance teams.

### 1.2 Scope of the System
**Doctor Tracker** is a secure, HIPAA-aligned healthcare administrative application enabling hospital administrators to oversee medical staff rosters, manage patient intake and clinical registries, track departmental physician capacity, and visualize real-time patient arrival telemetry and revenue metrics.

### 1.3 Definitions, Acronyms, and Abbreviations
- **EHR**: Electronic Health Record
- **HIPAA**: Health Insurance Portability and Accountability Act
- **JWT**: JSON Web Token
- **ODM**: Object Data Modeling (Mongoose)
- **RBAC**: Role-Based Access Control
- **REST**: Representational State Transfer
- **SaaS**: Software as a Service
- **UI/UX**: User Interface / User Experience

---

## 2. Overall Description

### 2.1 Product Perspective
Doctor Tracker operates as a full-stack web application consisting of:
1. **Frontend Client**: Next.js 16 (React 19 + TypeScript + Tailwind CSS v4) delivering a Medcare design pattern.
2. **Backend Server**: Standalone Node.js + Express REST API handling authentication, CRUD operations, and telemetry queries.
3. **Database**: MongoDB storing structured collections for Users, Doctors, and Patients with compound text indexing and aggregation pipelines.

### 2.2 User Personas & Classes
1. **Hospital Administrator (Primary User)**:
   - Full access to doctor rosters, patient records, staff schedules, departmental billing, and system settings.
2. **Attending Physician**:
   - Access to assigned patient charts, clinical timeline records, vitals telemetry, and consultation schedules.
3. **Clinical Receptionist / Staff**:
   - Patient registration, appointment scheduling, and basic demographic record updates.

### 2.3 Operating Environment
- **Client Platforms**: Modern web browsers (Chrome 120+, Edge 120+, Firefox 120+, Safari 17+) on Desktop, Tablet, and Mobile.
- **Server Platform**: Node.js v20.x runtime on Linux / Windows Server / Containerized Docker.
- **Database Engine**: MongoDB v7.x+.

---

## 3. Specific Functional Requirements

### 3.1 Module 1: Authentication & Access Control
- **FR-AUTH-001**: The system shall provide a secure email/password authentication portal (`/login`).
- **FR-AUTH-002**: Passwords shall be cryptographically hashed using `bcryptjs` with a minimum salt factor of 10.
- **FR-AUTH-003**: Authenticated sessions shall generate a signed JSON Web Token (JWT) valid for 7 days.
- **FR-AUTH-004**: All administrative endpoints shall be protected by token verification middleware.
- **FR-AUTH-005**: The login interface shall provide a 1-Click quick demonstration authenticator for authorized evaluation.

### 3.2 Module 2: Doctor Management
- **FR-DOC-001**: Admin shall be capable of creating a physician record with:
  - Doctor Name (with honorific formatting)
  - Specialization (*Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, Oncology, etc.*)
  - Hospital Facility Affiliation
  - Phone Number and Work Email
  - Consultation Room / Wing Number
  - Max Patient Capacity (default: 300)
  - Years of Clinical Experience
  - Initial Duty Status (*Active, In Surgery, On Leave, Off Duty*)
  - Professional Summary / Biography
- **FR-DOC-002**: The system shall display a searchable, filterable, and paginated directory of all doctors.
- **FR-DOC-003**: The system shall support real-time searching across doctor names, specializations, emails, and consultation rooms.
- **FR-DOC-004**: Doctor profiles shall display their current active patient load against their maximum capacity threshold.
- **FR-DOC-005**: The doctor profile page (`/doctors/[id]`) shall list all corresponding assigned patients.
- **FR-DOC-006**: Users shall be able to add or delete patients directly under a selected doctor's roster.

### 3.3 Module 3: Patient Management
- **FR-PAT-001**: Admin shall be capable of registering a patient with:
  - Full Name, Age, Gender
  - Assigned Primary Physician
  - Clinical Condition (*General, Chronic, Recovering, Follow-up, Critical*)
  - Care Status (*Outpatient, Admitted, Discharged*)
  - Blood Group (*A+, A-, B+, B-, AB+, AB-, O+, O-*)
  - Contact Phone & Email
  - Initial Assessment Notes
- **FR-PAT-002**: The system shall automatically generate unique patient identifiers formatted as `#PT-XXXX`.
- **FR-PAT-003**: The patient directory (`/patients`) shall support multi-criteria filtering by Condition Category, Care Status, and search terms.
- **FR-PAT-004**: The patient chart view (`/patients/[id]`) shall render 4 vital indicators (Blood Pressure, Heart Rate, Body Temp, SpO2), clinical timeline, and attending doctor details.
- **FR-PAT-005**: The system shall support 1-Click CSV export of patient records.
- **FR-PAT-006**: The system shall support clinical summary printing and record deletion with automatic physician load adjustment.

### 3.4 Module 4: Dashboard & Data Visualization
- **FR-DASH-001**: The main dashboard shall display top-level metrics:
  - Total Patients (with +24% growth wave indicator)
  - Today's Appointments (with +14% pillar marker)
  - Pending Reports (with 3-segment progress indicator)
  - Total Monthly Revenue estimate ($32,450)
- **FR-DASH-002**: The dashboard shall render a dual-layer SVG patient arrival curve with month-by-month tooltips.
- **FR-DASH-003**: The dashboard shall feature an interactive date carousel strip (Days 1–23) with appointment statuses.
- **FR-DASH-004**: The dashboard shall provide an interactive **"Generate Report"** modal with operational summaries, print triggers, and PDF download options.
- **FR-DASH-005**: The dashboard shall include a period selector dropdown (*Today, This week, This month, This year*).

---

## 4. Non-Functional Requirements

### 4.1 Performance & Scalability
- **NFR-PERF-001**: Client route transitions shall render within `< 150ms`.
- **NFR-PERF-002**: Backend REST API queries shall execute and return within `< 50ms` under normal load.
- **NFR-PERF-003**: MongoDB queries shall utilize compound text indexes to prevent full-collection scans.
- **NFR-PERF-004**: Database connections shall employ persistent connection pooling via Mongoose.

### 4.2 Security & HIPAA Compliance
- **NFR-SEC-001**: All client-server communications shall occur over HTTPS in production.
- **NFR-SEC-002**: Passwords shall never be returned in API response bodies (`select: false`).
- **NFR-SEC-003**: API endpoints shall be protected against CORS exploits with strict origin whitelisting.
- **NFR-SEC-004**: All input payloads shall be sanitized against NoSQL injection and XSS vulnerabilities.

### 4.3 Usability & Design Standard
- **NFR-UI-001**: The UI shall strictly follow the Medcare royal blue design system (`#2F65F6`, `#EBF3FE`, `#F4F7FB`, `rounded-3xl` cards).
- **NFR-UI-002**: The application layout shall be fully responsive across mobile (320px+), tablet (768px+), and desktop (1280px+).
- **NFR-UI-003**: Interactive buttons and actions shall provide immediate visual feedback (toast notifications, optimistic state updates).

---

## 5. Verification & Acceptance Criteria
- 100% TypeScript compilation with 0 errors across frontend and backend.
- Next.js production build (`npm run build`) generates all 18 routes cleanly.
- Database seeder (`npm run seed`) populates valid clinical data without validation errors.
- End-to-end user journeys (login &rarr; doctor creation &rarr; patient assignment &rarr; CSV export) succeed without errors.
