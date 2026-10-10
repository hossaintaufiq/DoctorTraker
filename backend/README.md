# Doctor Tracker — Backend Service

Backend services and API layer for **Doctor Tracker by Care Guide BD**.

## Planned Architecture
- **Framework**: Node.js / Express / NestJS / FastAPI or Next.js API route handlers
- **Database**: PostgreSQL / MongoDB with Prisma or Drizzle ORM
- **Authentication**: JWT / Session / OAuth2 role-based access control (Admin, Doctor, Staff)
- **Clinical Endpoints**:
  - `/api/doctors` — CRUD operations, department filters, patient capacity management
  - `/api/patients` — Registration, medical history, vitals telemetry, physician assignment
  - `/api/analytics` — Hospital operational metrics, patient growth curves, department loads
  - `/api/notifications` — Real-time event notifications and staff triage alerts

## Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── services/
└── README.md
```
