# ⚙️ Doctor Tracker — Backend REST Service (Node.js & Express)

> **Clinical Operations API, JWT Authentication & MongoDB Persistence Engine**  
> *Architected with TypeScript, Express 4.21, Mongoose 8.9, Strict RBAC, and Zod Request Validation.*

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](../LICENSE)

---

## ⚡ Evaluator Quick Access

| Resource | Value / Link | Details |
| :--- | :--- | :--- |
<<<<<<< HEAD
| **Local API Base** | `http://localhost:5000/api` | Standalone Express server |
| **Health Check** | `http://localhost:5000/api/health` | Public connectivity & uptime verification |
| **Demo Administrator** | `admin@doctortracker.com` | Pre-configured evaluation account |
| **Demo Password** | `password123` | Salted `bcryptjs` credential verified on MongoDB |
=======
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
>>>>>>> 1a17247c3e9b896b68655f61b5038f643a0977e5

---

## 📡 REST API Endpoints Specification

### 🔐 Authentication & Session (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate credentials; returns access token, sets rotated refresh cookie | Public (20 req / 15 min) |
| `POST` | `/api/auth/refresh` | Issue new access token and rotate refresh token cookie | Public (via secure cookie) |
| `POST` | `/api/auth/logout` | Invalidate refresh token and clear cookie | Public |
| `GET` | `/api/auth/me` | Fetch active user session profile | Yes (Bearer) |
| `POST` | `/api/auth/register` | Register healthcare user account | Admin only |

### 👨‍⚕️ Doctor Management (`/api/doctors`)
| Method | Endpoint | Description | Auth Required | Role |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/doctors` | List paginated physicians with search, specialty, status, date filters | Yes (Bearer) | All |
| `GET` | `/api/doctors/:id` | Fetch physician details with populated patient roster | Yes (Bearer) | All |
| `POST` | `/api/doctors` | Create new physician record (Zod validated) | Yes (Bearer) | Admin |
| `PUT` | `/api/doctors/:id` | Update physician profile or maximum patient quota | Yes (Bearer) | Admin |
| `DELETE` | `/api/doctors/:id` | Delete physician record | Yes (Bearer) | Admin |
| `GET` | `/api/doctors/:id/patients` | Paginated patients list under this doctor | Yes (Bearer) | All |
| `POST` | `/api/doctors/:id/patients` | Add a patient directly under doctor's care | Yes (Bearer) | Admin, Doctor |
| `DELETE` | `/api/doctors/:id/patients/:patientId` | Remove patient from doctor's roster | Yes (Bearer) | Admin, Doctor |

### 🏥 Patient Management (`/api/patients`)
| Method | Endpoint | Description | Auth Required | Role |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/patients` | List paginated patient charts with condition, status, date filters | Yes (Bearer) | All |
| `GET` | `/api/patients/:id` | Retrieve patient chart and attending physician details | Yes (Bearer) | All |
| `POST` | `/api/patients` | Register a new patient (increments doctor patientCount atomically) | Yes (Bearer) | Admin, Doctor |
| `PUT` | `/api/patients/:id` | Update patient record (reassigns doctor patient counts atomically) | Yes (Bearer) | Admin, Doctor |
| `DELETE` | `/api/patients/:id` | Delete patient (decrements doctor patientCount atomically) | Yes (Bearer) | Admin |

### 📊 Analytics & System Control
| Method | Endpoint | Description | Auth Required | Role |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/analytics/dashboard` | Real aggregated KPIs, arrival trends, and condition breakdowns | Yes (Bearer) | All |
| `POST` | `/api/system/reset-database` | Full database wipe and reseed; requires non-prod, ALLOW_DB_RESET=true | Yes (Bearer) | Admin |
| `GET` | `/api/logs` | Query audit log of operations | Yes (Bearer) | All |
| `GET` | `/api/health` | Microservice health check | Public | All |

---

## 🚀 Setup & Execution

```bash
# 1. Install dependencies
npm install

# 2. Seed database
npm run seed

# 3. Run query explain benchmarks
npm run explain

# 4. Run Vitest test suite
npm test

# 5. Build and run in production
npm run build
npm start
```
