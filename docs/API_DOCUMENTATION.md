# 📡 REST API Specification & Endpoint Reference
## Project: Doctor Tracker — Healthcare Management Admin Portal
**Base URL:** `http://localhost:5000/api`  
**Content-Type:** `application/json`  
**Authentication Scheme:** `Authorization: Bearer <JWT_TOKEN>`  

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Endpoint:** `POST /auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Dr. Sullivan Robert",
  "email": "admin@medcare.com",
  "password": "password123",
  "role": "admin"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Medical user account registered successfully.",
  "data": {
    "id": "67301abc8912ef3456789012",
    "name": "Dr. Sullivan Robert",
    "email": "admin@medcare.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Login User
- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "admin@medcare.com",
  "password": "password123"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Authenticated successfully to Doctor Tracker portal.",
  "data": {
    "id": "67301abc8912ef3456789012",
    "name": "Dr. Sullivan Robert",
    "email": "admin@medcare.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. Doctor Management Endpoints

### 2.1 Get All Doctors
- **Endpoint:** `GET /doctors`
- **Access:** Public or Protected
- **Query Parameters:**
  - `search` *(string)*: Search across name, specialty, email, room, hospital.
  - `specialty` *(string)*: e.g., `Cardiology`, `Neurology`, `Pediatrics`.
  - `status` *(string)*: `Active`, `In Surgery`, `On Leave`, `Off Duty`.
  - `page` *(number)*: Default `1`.
  - `limit` *(number)*: Default `10`.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 6,
  "total": 6,
  "totalPages": 1,
  "currentPage": 1,
  "data": [
    {
      "_id": "67301a111111111111111101",
      "name": "Dr. Sarah Ahmed",
      "specialty": "Cardiology",
      "email": "sarah.ahmed@medcare.com",
      "phone": "+880 1711-234567",
      "roomNumber": "Room 304 - Wing B",
      "hospital": "Care Guide BD Medical Center",
      "patientCount": 42,
      "maxPatients": 300,
      "experienceYears": 12,
      "status": "Active",
      "biography": "Lead Cardiologist specializing in ischemic heart disease.",
      "createdAt": "2026-01-10T08:00:00.000Z"
    }
  ]
}
```

---

### 2.2 Get Doctor Profile by ID
- **Endpoint:** `GET /doctors/:id`
- **Access:** Public or Protected
- **Response (`200 OK`):** Returns doctor profile with populated `patients` sub-array.

---

### 2.3 Create Doctor Profile
- **Endpoint:** `POST /doctors`
- **Access:** Protected (Admin)
- **Request Body:**
```json
{
  "name": "Dr. Ariful Haque",
  "specialty": "Neurology",
  "email": "ariful.haque@medcare.com",
  "phone": "+880 1712-334455",
  "roomNumber": "Room 205 - Wing A",
  "hospital": "Care Guide BD Medical Center",
  "maxPatients": 250,
  "experienceYears": 8,
  "status": "Active",
  "biography": "Clinical neurologist specializing in cognitive disorders."
}
```

---

### 2.4 Add Patient Under Specific Doctor
- **Endpoint:** `POST /doctors/:id/patients`
- **Access:** Protected
- **Request Body:**
```json
{
  "name": "David Miller",
  "age": 45,
  "gender": "Male",
  "condition": "General",
  "bloodGroup": "O+",
  "phone": "+880 1812-998877",
  "email": "david.m@example.com",
  "notes": "Routine physical examination."
}
```

---

## 3. Patient Management Endpoints

### 3.1 Get All Patients
- **Endpoint:** `GET /patients`
- **Access:** Public or Protected
- **Query Parameters:**
  - `search` *(string)*: Name, code, phone, doctor name.
  - `condition` *(string)*: `General`, `Chronic`, `Recovering`, `Follow-up`, `Critical`.
  - `status` *(string)*: `Outpatient`, `Admitted`, `Discharged`.
  - `bloodGroup` *(string)*: `A+`, `O+`, `B-`, etc.
  - `doctorId` *(string)*: Filter by assigned physician ID.
  - `page` *(number)*, `limit` *(number)*.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "totalPages": 1,
  "currentPage": 1,
  "data": [
    {
      "_id": "67301b222222222222222201",
      "patientCode": "PT-1042",
      "name": "Olivia Bennett",
      "age": 34,
      "gender": "Female",
      "assignedDoctor": {
        "_id": "67301a111111111111111101",
        "name": "Dr. Sarah Ahmed",
        "specialty": "Cardiology"
      },
      "assignedDoctorName": "Dr. Sarah Ahmed",
      "condition": "Chronic",
      "status": "Outpatient",
      "bloodGroup": "A+",
      "phone": "+880 1812-345678",
      "email": "olivia.bennett@example.com",
      "vitals": {
        "bloodPressure": "120/80",
        "heartRate": 72,
        "temperature": 98.6,
        "spO2": 99
      },
      "registrationDate": "2026-01-15T09:30:00.000Z"
    }
  ]
}
```

---

### 3.2 Update Patient Chart
- **Endpoint:** `PUT /patients/:id`
- **Access:** Protected
- **Description:** Updates patient demographics, clinical notes, condition, or reassigns attending physician with automatic load re-balancing.

---

### 3.3 Delete Patient Record
- **Endpoint:** `DELETE /patients/:id`
- **Access:** Protected
- **Description:** Deletes patient document and automatically decrements the attending physician's `patientCount`.

---

## 4. Analytics Endpoints

### 4.1 Get Dashboard Analytics
- **Endpoint:** `GET /analytics/dashboard`
- **Access:** Public or Protected
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalDoctors": 6,
      "totalPatients": 5,
      "activeDoctorsCount": 4,
      "admittedPatientsCount": 1,
      "criticalPatientsCount": 1,
      "avgPatientsPerDoctor": 0.8,
      "estimatedMonthlyRevenue": 32450,
      "appointmentsToday": 24
    },
    "patientsPerDoctor": [
      {
        "doctorId": "67301a111111111111111101",
        "doctorName": "Dr. Sarah Ahmed",
        "specialty": "Cardiology",
        "patientCount": 2,
        "maxPatients": 300
      }
    ],
    "conditionBreakdown": [
      { "_id": "Chronic", "count": 1 },
      { "_id": "Follow-up", "count": 1 },
      { "_id": "Recovering", "count": 1 },
      { "_id": "Critical", "count": 1 },
      { "_id": "General", "count": 1 }
    ],
    "arrivalTrends": [
      { "month": "Jan", "arrivals": 1200, "followups": 420 },
      { "month": "Dec", "arrivals": 5642, "followups": 2180 }
    ]
  }
}
```
