# 🧪 Quality Assurance & Testing Strategy
## Project: Doctor Tracker — Healthcare Management Admin Portal
**QA Lead:** Test Engineering Team  
**Coverage Objective:** > 90% Code Coverage across critical clinical paths  

---

## 1. Testing Pyramid Overview

```
          / \
         /   \      E2E Tests (Playwright / Cypress) - User Flows
        /     \
       /-------\    Integration Tests (Supertest) - REST API & DB
      /         \
     /-----------\  Unit Tests (Jest / Vitest) - Utilities, Hooks & Models
```

---

## 2. Test Execution Levels

### 2.1 Unit Testing
- **Scope**: Model validations, JWT token generation, utility functions (`getInitials`, `formatDate`, `cn`).
- **Validation Criteria**:
  - `User.comparePassword()` correctly identifies valid vs invalid passwords.
  - `Patient` schema automatically generates `#PT-XXXX` codes if omitted.

### 2.2 Integration Testing (API Endpoints)
- **Tool**: Supertest + in-memory MongoDB.
- **Key Test Suites**:
  - `POST /api/auth/login`: Verifies JWT payload and bearer authorization.
  - `POST /api/doctors`: Verifies duplicate email rejection (`400 Bad Request`).
  - `POST /api/patients`: Verifies attending doctor capacity increment.
  - `DELETE /api/patients/:id`: Verifies doctor capacity decrement.

### 2.3 End-to-End (E2E) Workflow Testing
1. **User Authentication Journey**: User loads `/login` &rarr; Clicks 1-Click Demo Login &rarr; Redirects to `/dashboard`.
2. **Doctor Registration Flow**: User opens `/doctors` &rarr; Clicks "Add Doctor" &rarr; Submits modal &rarr; Verifies new doctor card appears.
3. **Patient Intake & Assignment**: User opens `/patients` &rarr; Registers "Sophia Chen" assigned to "Dr. Tanvir Hasan" &rarr; Navigates to `/doctors/[id]` &rarr; Verifies patient appears in doctor's roster.
4. **CSV Export Audit**: User clicks "Export to CSV" &rarr; File downloads with exact headers and record counts.

---

## 3. Automated Test Command Reference
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Verify production build compilation
npm run build
```
