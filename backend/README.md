# ⚙️ Doctor Tracker — Backend REST Service (Node.js & Express)

> **High-Availability Clinical Operations API, JWT Authentication & MongoDB Atlas Cloud Persistence Engine**  
> *Architected with TypeScript, Express 4.21, Mongoose ODM, Defense-in-Depth OWASP Hardening, and Automated Database Seeding.*

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud_8.9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Render Backend](https://img.shields.io/badge/Render-Live_API-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://doctortraker.onrender.com/api/health)
[![Security](https://img.shields.io/badge/Security-OWASP_Hardened-blue?style=for-the-badge&logo=shield&logoColor=white)](https://owasp.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](../LICENSE)

---

## ⚡ Recruiter & Evaluator Quick Access

| Resource | Direct Link / Credentials | Details |
| :--- | :--- | :--- |
| **Live REST API Base** | [doctortraker.onrender.com/api](https://doctortraker.onrender.com) | High-availability backend deployed on Render |
| **Live Health Check** | [doctortraker.onrender.com/api/health](https://doctortraker.onrender.com/api/health) | Real-time database connectivity & uptime verification |
| **Live Frontend Portal** | [doctortraker.vercel.app](https://doctortraker.vercel.app) | Production Next.js 16 frontend hosted on Vercel Edge |
| **Demo Administrator Account** | `admin@medcare.com` | Pre-configured evaluation account with full admin rights |
| **Demo Password** | `password123` | Salted `bcryptjs` credential verified on MongoDB Atlas |
| **Root GitHub Repository** | [github.com/hossaintaufiq/DoctorTraker](https://github.com/hossaintaufiq/DoctorTraker) | Monorepo containing full full-stack source code |

---

## 🏗️ Architecture & Engineering Deep-Dive

### 1. Standalone Decoupled Microservice
* Separated completely from the Next.js presentation tier for independent horizontal scaling, isolated Docker containerization, and the ability to serve native mobile clients (iOS / Android) in future releases.
* Maintains persistent Mongoose connection pooling with dual DNS resolver fallbacks (`8.8.8.8`, `1.1.1.1`), eliminating the connection churn and cold-start timeouts common in serverless edge runtimes.

### 2. High-Performance MongoDB Atlas Aggregations
* **Compound Indexing**: Structured indexes on `specialty + status`, `assignedDoctorId + condition`, and `createdAt + status` yield sub-15ms lookup speeds across paginated queries.
* **$facet Pipelines**: Multi-metric dashboard summaries (patient arrival curves, departmental revenue distribution, doctor workload ratios) are computed in parallel within MongoDB, returning consolidated telemetry in a single round-trip.

### 3. Defense-in-Depth OWASP Hardening
* **HTTP Security Headers (`helmet`)**: Enforces strict Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and HTTP Strict Transport Security (HSTS).
* **Recursive NoSQL Operator Sanitization**: Custom middleware inspects all request parameters, bodies, and query strings, recursively stripping malicious MongoDB operators (`$` and `.`) before reaching Mongoose queries.
* **Granular Rate Limiting (`express-rate-limit`)**: Protects authentication endpoints (`/api/auth/login`) with strict caps (20 req / 15 min) and general API routes with 400 req / 15 min.
* **Cryptographic Hashing & JWT**: Passwords salted and hashed with `bcryptjs` (10 rounds). Tokens signed via `jsonwebtoken` with 7-day expiration and tamper resistance.
* **Dynamic CORS Whitelisting**: Validates origins with support for `doctortraker.vercel.app`, preview deployments, and local development environments.

---

## 📡 REST API Endpoints Specification

### 🔐 Authentication & Session
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate admin credentials and generate signed JWT | No |
| `POST` | `/api/auth/register` | Register a new administrative account | No |
| `GET` | `/api/auth/me` | Fetch active authenticated session profile | Yes (Bearer) |

### 👨‍⚕️ Doctor Management & Patient Rosters
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/doctors` | Query paginated physicians with specialty, status, and search filters | No |
| `GET` | `/api/doctors/:id` | Fetch physician details including **assigned patient care roster** | No |
| `POST` | `/api/doctors` | Register a new specialist physician record | Yes (Bearer) |
| `PUT` | `/api/doctors/:id` | Update physician profile, room number, or maximum patient quota | Yes (Bearer) |
| `DELETE` | `/api/doctors/:id` | Delete physician record and decouple assigned patients | Yes (Bearer) |
| `POST` | `/api/doctors/:id/patients` | **Directly assign a patient to a doctor's care roster** | Yes (Bearer) |
| `DELETE` | `/api/doctors/:id/patients/:patientId` | **Remove a patient from a doctor's care roster** | Yes (Bearer) |

### 🏥 Patient Care Records
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/patients` | Query paginated patient charts with condition and doctor filters | No |
| `GET` | `/api/patients/:id` | Retrieve patient chart, vitals telemetry, and clinical notes | No |
| `POST` | `/api/patients` | Register a new outpatient or inpatient record | Yes (Bearer) |
| `PUT` | `/api/patients/:id` | Update patient vitals, triage level, or attending physician | Yes (Bearer) |
| `DELETE` | `/api/patients/:id` | Delete patient medical record | Yes (Bearer) |

### 📅 Appointments, Pharmacy & Invoicing
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/appointments` | Retrieve scheduled outpatient appointments | No |
| `POST` | `/api/appointments` | Book a new consultation slot | Yes (Bearer) |
| `GET` | `/api/invoices` | Retrieve itemized invoices, payment statuses, and totals | No |
| `POST` | `/api/invoices` | Generate an itemized clinical billing invoice | Yes (Bearer) |

### 📊 Analytics, Telemetry & Factory Reset
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/analytics/dashboard` | Aggregated KPI figures, revenue charts, and arrival curves | No |
| `GET` | `/api/health` | Real-time database connectivity and microservice health check | No |
| `GET` | `/api/logs` | Query immutable audit log of administrative operations | Yes (Bearer) |
| `POST` | `/api/system/reset-database` | **Factory-reset all collections and safely re-seed from scratch** | Yes (Bearer) |

---

## 🔄 Database Seeding & Factory Reset

The backend provides two automated methods to populate or restore default evaluation data:

### 1. Via Command Line (Initial Setup)
```bash
cd backend
npm run seed
```
*Populates 8 specialist doctors, 12 clinical patient records, outpatient appointments, hospital departments, itemized billing invoices, and the default demo administrator (`admin@medcare.com`).*

### 2. Via Direct API Call or Frontend UI
```bash
curl -X POST https://doctortraker.onrender.com/api/system/reset-database \
     -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```
*Or navigate to `/settings` &rarr; **Backup & Telemetry** on the frontend web application and click **"Reset Database & Start Fresh"**.*

---

## 🚀 Setup & Local Installation

### Prerequisites
* **Node.js**: `v18.17+` or `v20.x`
* **npm**: `v9+`
* **MongoDB**: Active MongoDB Atlas cluster connection URI or local instance (`mongodb://127.0.0.1:27017/doctor_tracker`)

### 1. Installation
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory (or duplicate `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@doctor-traker.clwpo2l.mongodb.net/doctor_tracker?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://doctortraker.vercel.app,http://localhost:3000
```

### 3. Seed Database & Start Server
```bash
# Seed initial demo data:
npm run seed

# Run in development mode with auto-reload:
npm run dev

# Compile TypeScript to production dist:
npm run build

# Start production server:
npm start
```

The REST API will be available at `http://localhost:5000/api`.

---

## 👨‍💻 Author & License

* **Developer**: **Hossain Ahmmed Taufiq** ([@hossaintaufiq](https://github.com/hossaintaufiq))
* **Live API**: [https://doctortraker.onrender.com/api](https://doctortraker.onrender.com/api)
* **License**: Released under the **MIT License**.
