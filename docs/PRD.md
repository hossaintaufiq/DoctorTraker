# 🚀 Product Requirements Document (PRD)
## Product: Doctor Tracker — Healthcare SaaS Management System
**Client / Brand:** Care Guide BD  
**Product Lead:** Engineering & Product Team  
**Version:** 1.0.0  
**Target Release:** Q1 2026  

---

## 1. Executive Summary

Healthcare administrators frequently encounter operational bottlenecks caused by fragmented doctor rosters, manual patient registration workflows, and delayed clinical reporting. **Doctor Tracker** is designed to solve these friction points by providing a centralized, high-velocity administrative dashboard that connects physician capacity, patient intake classifications, clinical vitals tracking, and operational telemetry into a unified single-pane-of-glass interface.

---

## 2. Target Market & User Personas

| User Persona | Core Responsibilities | Pain Points Addressed |
|---|---|---|
| **Dr. Sullivan Robert** *(Chief Medical Officer)* | Clinical oversight, doctor workload distribution, hospital-wide revenue & arrival metrics | Lacks consolidated visual analytics and real-time physician patient load tracking |
| **Nurse Manager / Registrar** | Patient intake, triage condition classification, attending doctor assignment | Manual paper records, delayed doctor notifications, cumbersome search |
| **Hospital Administrator** | Staff rosters, department management, billing exports, compliance reporting | Slow reporting generation, lack of instant CSV exports, disjointed UI |

---

## 3. Product Goals & Business KPIs

### 3.1 Primary Goals
1. **Reduce Patient Intake Time**: Accelerate registration from 5+ minutes to `< 45 seconds` via streamlined modal workflows and automated ID generation.
2. **Eliminate Physician Overcapacity**: Provide real-time progress bars indicating physician patient count vs. max capacity.
3. **Instant Clinical Reporting**: Deliver 1-Click CSV record exports and interactive operational summary reports.
4. **Modernize Brand Identity**: Replace generic admin templates with a bespoke, royal blue healthcare design system.

### 3.2 Key Performance Indicators (KPIs)
- **Time to First Meaningful Paint (FMP)**: `< 0.8s`
- **Dashboard Data Freshness**: Real-time optimistic client updates with background REST sync.
- **Search Query Execution Time**: `< 10ms` for 10,000+ indexed patient records.
- **User Task Completion Rate**: `> 98%` on patient registration and doctor allocation tasks.

---

## 4. User Stories & Acceptance Criteria

### Epic 1: Medical Staff & Doctor Management
- **US-1.1**: *As an administrator, I want to create a new doctor profile with specialty, capacity, and contact info, so that our medical directory is always up to date.*
  - **Acceptance Criteria**: Form validates required fields, updates physician list instantly, and posts to `/api/doctors`.
- **US-1.2**: *As an administrator, I want to view a doctor's assigned patients on their dedicated profile page, so that I can inspect their patient load.*
  - **Acceptance Criteria**: Navigating to `/doctors/[id]` fetches physician bio, room location, and populated patient list.

### Epic 2: Patient Registration & Clinical Charting
- **US-2.1**: *As a receptionist, I want to register a patient and select an attending physician from a dropdown, so that the patient is immediately attached to a doctor's care queue.*
  - **Acceptance Criteria**: Auto-generates `#PT-XXXX` code, updates doctor's active patient counter, and displays success toast.
- **US-2.2**: *As a clinician, I want to view a patient's vitals (BP, Heart Rate, Temp, SpO2) and clinical timeline, so that I have complete context during consultations.*
  - **Acceptance Criteria**: `/patients/[id]` displays 4 vitals summary cards, medical assessment notes, and printing options.

### Epic 3: Analytics, Reporting & Exporting
- **US-3.1**: *As an executive, I want to export all filtered patient records to a CSV file, so that I can perform offline compliance audits.*
  - **Acceptance Criteria**: Clicking **"Export to CSV"** triggers a browser download with formatted columns.
- **US-3.2**: *As a medical director, I want to view monthly patient arrival curves, so that I can anticipate staffing requirements during peak seasons.*
  - **Acceptance Criteria**: Dual-layer SVG curve displays monthly arrival vs. follow-up trends with interactive tooltips.

---

## 5. Roadmap & Release Plan

```
Q1 2026 Milestone 1 (Current - V1.0.0):
├── Core Authentication (JWT + Bcrypt)
├── Medcare Royal Blue UI Design System
├── Full Doctor & Patient CRUD with Optimistic State
├── Standalone Node.js/Express API & MongoDB Schemas
├── All 18 Left Navigation Sub-routes
└── CSV Export & Generate Report Modals

Q2 2026 Milestone 2 (V1.1.0 Planned):
├── Real-time WebSocket Notifications for Critical Triage Alerts
├── Multi-Hospital Organization Switching
└── Advanced PDF Prescription Generator
```
