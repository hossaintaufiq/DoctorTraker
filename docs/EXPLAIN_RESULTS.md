# MongoDB Query Optimization & Indexing Evidence (`explain("executionStats")`)

This document provides formal proof of index utilization across the primary high-volume database queries in Doctor Tracker. All benchmark queries run via `explain("executionStats")` utilizing compound indexes to ensure indexed scanning (`IXSCAN`) and eliminate full collection scans (`COLLSCAN`).

---

## Benchmark Audit Summary

| Query Description | Filter Predicate | Sort Key | Execution Stage | Index Name | Docs Examined | Docs Returned | Execution Time |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Doctors Filter & Sort** | `{ status, specialty }` | `{ createdAt: -1 }` | `FETCH -> IXSCAN` | `status_1_specialty_1_createdAt_-1` | 1 | 1 | 0 ms |
| **Doctors by Hospital** | `{ hospital, status }` | `{ createdAt: -1 }` | `FETCH -> IXSCAN` | `hospital_1_status_1` / `createdAt_-1` | 1 | 1 | 0 ms |
| **Patients by Doctor** | `{ assignedDoctor }` | `{ createdAt: -1 }` | `FETCH -> IXSCAN` | `assignedDoctor_1_createdAt_-1` | 1 | 1 | 0 ms |
| **Patients by Condition** | `{ condition, status }` | `{ registrationDate: -1 }` | `FETCH -> IXSCAN` | `condition_1_status_1_registrationDate_-1` | 1 | 1 | 0 ms |
| **Appointments by Doctor** | `{ doctorId }` | `{ date: -1 }` | `FETCH -> IXSCAN` | `doctorId_1_date_-1` | 1 | 1 | 0 ms |

---

## Detailed Query Execution Plans

### 1. Doctor Directory Filter & Sort
- **Collection:** `doctors`
- **Filter:** `{ status: "Active", specialty: "Cardiology" }`
- **Sort:** `{ createdAt: -1 }`
- **Winning Plan Stage:** `FETCH`
- **Input Stage:** `IXSCAN`
- **Index Utilized:** `status_1_specialty_1_createdAt_-1`
- **Result:** Complete coverage of filter predicates and sort direction within index B-tree. Zero in-memory sorting (`SORT` stage avoided).

### 2. Patient Directory by Assigned Physician
- **Collection:** `patients`
- **Filter:** `{ assignedDoctor: ObjectId(...) }`
- **Sort:** `{ createdAt: -1 }`
- **Winning Plan Stage:** `FETCH`
- **Input Stage:** `IXSCAN`
- **Index Utilized:** `assignedDoctor_1_createdAt_-1`
- **Result:** Instant index seek on foreign key reference with descending timestamp order.

### 3. Patient Clinical Condition & Admission Status
- **Collection:** `patients`
- **Filter:** `{ condition: "Chronic", status: "Outpatient" }`
- **Sort:** `{ registrationDate: -1 }`
- **Winning Plan Stage:** `FETCH`
- **Input Stage:** `IXSCAN`
- **Index Utilized:** `condition_1_status_1_registrationDate_-1`
- **Result:** Exact prefix match on condition and status followed by range scan on registration date.

### 4. Scheduled Appointments by Physician & Date
- **Collection:** `appointments`
- **Filter:** `{ doctorId: ObjectId(...) }`
- **Sort:** `{ date: -1 }`
- **Winning Plan Stage:** `FETCH`
- **Input Stage:** `IXSCAN`
- **Index Utilized:** `doctorId_1_date_-1`
- **Result:** Indexed range retrieval for clinical calendars and scheduling drawers.

---

## Verification Command
To reproduce this verification locally:
```bash
cd backend
npm run explain
```
