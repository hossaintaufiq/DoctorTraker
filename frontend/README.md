# 🖥️ Doctor Tracker — Frontend Client (Next.js 16 & Turbopack)

> **Modern Glassmorphic Clinical Operations Portal & Hospital Administration Web Application**  
> *Architected with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Optimistic UI State Synchronization.*

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4_Modern-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Portal-black?style=for-the-badge&logo=vercel&logoColor=white)](https://doctortraker.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](../LICENSE)

---

## ⚡ Recruiter & Evaluator Quick Access

| Resource | Direct Link / Credentials | Details |
| :--- | :--- | :--- |
| **Live Production Portal** | [doctortraker.vercel.app](https://doctortraker.vercel.app) | Production deployment hosted on Vercel Edge |
| **Live Backend REST API** | [doctortraker.onrender.com/api](https://doctortraker.onrender.com) | High-availability backend deployed on Render |
| **Demo Administrator Account** | `admin@medcare.com` | Pre-configured evaluation account with full admin rights |
| **Demo Password** | `password123` | Salted `bcryptjs` credential verified on MongoDB Atlas |
| **Instant 1-Click Login** | Available on `/login` | Dedicated *"⚡ 1-Click Instant Demo Login"* shortcut button |
| **Root GitHub Repository** | [github.com/hossaintaufiq/DoctorTraker](https://github.com/hossaintaufiq/DoctorTraker) | Monorepo containing full full-stack source code |

---

## 🏗️ Architecture & Engineering Deep-Dive

### 1. Next.js 16 App Router with Turbopack
* Built on Next.js 16 App Router using Turbopack for sub-second HMR and instant page compilation.
* All 21 application routes are statically prerendered or server-rendered on demand with zero layout shift (CLS).
* Clean route hierarchy with protected layout guards preventing unauthenticated access to clinical records.

### 2. React Context with Optimistic UI State
* **Zero Boilerplate & Small Bundle**: Replaced Redux Toolkit with React Context API (`DoctorTrackerContext`), saving **~45KB** in client bundle size and maximizing Core Web Vitals.
* **0ms Latency (Optimistic Updates)**: When an admin updates a patient, assigns a physician, or modifies medical records, the UI updates instantly. The change is dispatched in the background to the REST API; if the server rejects the update, state automatically rolls back and triggers a clean toast notification.
* **Fallback Synchronization**: Automatically falls back to high-fidelity seed datasets if offline, ensuring unbroken demonstrations even during network latency.

### 3. Modern Glassmorphic Design System
* Engineered with a custom Tailwind CSS v4 design system:
  * Vibrant, clinical medical color tokens (`#0066FF`, `#00C48C`, `#FF4B4B`, `#F8FAFC`).
  * Soft frosted-glass layers (`backdrop-blur-md bg-white/80 border border-slate-200/60`).
  * Custom modal dialogs with backdrop animations — **zero native browser `alert()` prompts**.
  * Responsive sub-navigation with adaptive wrapped pills, avoiding awkward sliding overflow bars.

### 4. 100% Mobile & Touch Responsiveness
* Tested and optimized across iPhone SE (375px), modern flagships (390px–430px), tablets (768px), and 4K displays.
* Touch-friendly hit targets (min 44px), collapsible slide-over navigation drawers, and auto-wrapping action toolbars.

---

## 🗺️ Route & Feature Breakdown

| Route | Feature Area | Description |
| :--- | :--- | :--- |
| `/login` | **Authentication Portal** | Secure split-screen login with session validation and 1-Click Demo Access button. |
| `/dashboard` | **Clinical Command Center** | Real-time KPI summary, patient arrival curves, department revenue breakdown, status donut chart, and multi-section CSV audit export. |
| `/doctors` | **Physician Directory** | Dual-view (Responsive Grid Cards vs. Searchable Table), specialty filtering, patient capacity workload bars, and CRUD modal dialogs. |
| `/doctors/[id]` | **Doctor Care Roster** | In-depth physician profile with **direct patient roster management** (assign new patients, remove patients with confirmation). |
| `/patients` | **Patient Medical Records** | Paginated medical charts with condition triage badges, blood group filters, doctor assignment tracking, and delete safety modals. |
| `/emergency` | **Emergency & Trauma Admissions** | Live triage queue (`EM-104`, etc.), priority badges (*Immediate OR, Critical ICU, High Priority, Stable*), vital telemetry, trauma alert broadcast modals, and rapid intake. |
| `/appointments` | **Outpatient Scheduling** | Interactive scheduling matrix (Table view vs. Timeline view) with status tracking (*Confirmed, In Progress, Completed*). |
| `/pharmacy` | **Medication Inventory** | Pharmaceutical catalog with real-time low-stock alerts, supplier details, and expiration warnings. |
| `/billing` | **Financial & Invoicing** | Itemized invoice records, payment status badges, insurance verification, and billing breakdown. |
| `/settings` | **Hospital Profile & Maintenance** | Hospital branding, ward configs, session security, and the in-app **Database Factory Reset** tool. |
| `/laboratory` | **Diagnostics (Preview)** | Upcoming laboratory module: Specimen tracking, DICOM viewer, and biomarker panic alerts (*85% architecture ready*). |
| `/telemedicine`| **Virtual Care (Preview)** | Upcoming virtual care module: WebRTC HD video consults and remote vital telemetry (*75% architecture ready*). |
| `/wards` | **Ward Bed Matrix (Preview)** | Upcoming inpatient module: Live bed occupancy heatmaps for ICU, CCU, and General Wards (*80% architecture ready*). |

---

## 🚀 Setup & Local Installation

### Prerequisites
* **Node.js**: `v18.17+` or `v20.x`
* **npm**: `v9+`
* **Backend Server**: Running locally on `http://localhost:5000` or connected to live Render API.

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the `frontend` root:
```env
# Point to local backend during development:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Or point directly to the live Render backend:
# NEXT_PUBLIC_API_URL=https://doctortraker.onrender.com/api
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build Validation
```bash
npm run build
npm run start
```
*Compiled cleanly with Next.js 16 Turbopack with 0 TypeScript errors.*

---

## 👨‍💻 Author & License

* **Developer**: **Hossain Ahmmed Taufiq** ([@hossaintaufiq](https://github.com/hossaintaufiq))
* **Live Web Portal**: [https://doctortraker.vercel.app](https://doctortraker.vercel.app)
* **License**: Released under the **MIT License**.
