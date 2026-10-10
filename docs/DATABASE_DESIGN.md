# 🗄️ Database Design & Optimization Guide
## Project: Doctor Tracker — Healthcare Management Admin Portal
**Database Engine:** MongoDB (via Mongoose ODM)  
**Target Performance:** Sub-10ms query execution across 50,000+ records  

---

## 1. Schema Architecture & Collections

### 1.1 `users` Collection
Stores administrative and medical personnel credentials with security hashing.
```typescript
{
  _id: ObjectId,
  name: String (required, trim),
  email: String (required, unique, lowercase, index: true),
  password: String (required, minlength: 6, select: false),
  role: String (enum: ["admin", "doctor", "staff"], default: "admin"),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 1.2 `doctors` Collection
Stores licensed medical specialists, consulting room locations, and capacity thresholds.
```typescript
{
  _id: ObjectId,
  name: String (required, trim, index: true),
  specialty: String (required, trim, index: true),
  email: String (required, unique, lowercase, trim),
  phone: String (required, trim),
  roomNumber: String (required, trim),
  hospital: String (default: "Care Guide BD Medical Center"),
  patientCount: Number (default: 0, min: 0),
  maxPatients: Number (default: 300),
  experienceYears: Number (default: 5),
  status: String (enum: ["Active", "In Surgery", "On Leave", "Off Duty"], default: "Active", index: true),
  biography: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 1.3 `patients` Collection
Stores clinical patient intake records, condition triage classifications, vitals, and physician references.
```typescript
{
  _id: ObjectId,
  patientCode: String (unique, index: true), // e.g., "PT-1042"
  name: String (required, trim, index: true),
  age: Number (required, min: 0, max: 130),
  gender: String (enum: ["Male", "Female", "Other"], required: true),
  assignedDoctor: ObjectId (ref: "Doctor", required: true, index: true),
  assignedDoctorName: String,
  condition: String (enum: ["General", "Chronic", "Recovering", "Follow-up", "Critical"], default: "General", index: true),
  status: String (enum: ["Admitted", "Outpatient", "Discharged"], default: "Outpatient", index: true),
  bloodGroup: String (enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], default: "O+"),
  phone: String (required, trim),
  email: String (lowercase, trim),
  notes: String,
  lastVisit: Date (default: Date.now),
  registrationDate: Date (default: Date.now, index: true),
  vitals: {
    bloodPressure: String (default: "120/80"),
    heartRate: Number (default: 72),
    temperature: Number (default: 98.6),
    spO2: Number (default: 99)
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. Indexing Strategy

To guarantee sub-second queries under high concurrency, compound and text indexes are created:

| Collection | Index Fields | Index Type | Purpose |
|---|---|---|---|
| **`doctors`** | `{ name: "text", specialty: "text", email: "text", hospital: "text" }` | Compound Text | Ultra-fast multi-criteria keyword search |
| **`doctors`** | `{ specialty: 1, status: 1 }` | Compound | Fast filtered queries on specialty & availability |
| **`patients`** | `{ name: "text", patientCode: "text", phone: "text", email: "text" }` | Compound Text | Instant patient lookup by code, phone, or name |
| **`patients`** | `{ assignedDoctor: 1, condition: 1 }` | Compound | Fetching doctor's specific patient sub-list |
| **`patients`** | `{ registrationDate: -1 }` | Single Descending | Date-based sorting and pagination |

---

## 3. High-Performance Aggregation Pipelines

### Single-Pass Dashboard Aggregation Pipeline
```javascript
// Calculate patient load distribution per physician
Patient.aggregate([
  {
    $group: {
      _id: "$assignedDoctor",
      doctorName: { $first: "$assignedDoctorName" },
      count: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "doctors",
      localField: "_id",
      foreignField: "_id",
      as: "doctorDetails"
    }
  },
  { $unwind: { path: "$doctorDetails", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      doctorId: "$_id",
      doctorName: { $ifNull: ["$doctorName", "$doctorDetails.name"] },
      specialty: "$doctorDetails.specialty",
      patientCount: "$count",
      maxPatients: { $ifNull: ["$doctorDetails.maxPatients", 300] }
    }
  },
  { $sort: { patientCount: -1 } }
]);
```
