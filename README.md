# BillFlow — SaaS Invoicing for Independent Studios & Creators

BillFlow is a full-stack, production-grade SaaS invoicing application built for freelancers, independent contractors, and small creative studios.

---

## ⚡ Quick Demo Credentials

| Role | Email | Password | Pre-configured Data |
| :--- | :--- | :--- | :--- |
| **Studio Owner** | `demo@billflow.app` | `password123` | 4 realistic clients, 11 invoices across all statuses (`PAID`, `SENT`, `OVERDUE`, `DRAFT`), 6-month revenue analytics |

> **1-Click Login**: On `/login`, click the **"1-Click Demo Account Login"** button to automatically populate credentials and jump straight into the studio dashboard.

---

## 🏛 System Architecture: Strict 5-Layer Hierarchy

BillFlow strictly adheres to an enterprise 5-layer architecture. No route handler ever executes business logic or queries the database directly:

```
[ Client Request / Browser ]
             │
             ▼
[ 1. Route Handler ]  --> Thin Next.js App Router handler (src/app/api/v1/*)
             │
             ▼
[ 2. Controller ]     --> Plain async functions (src/controllers/*)
             │            Wraps in try/catch, uses utils/error-codes.ts
             │            Always returns standard envelope: { data, success, message, err }
             ▼
[ 3. Service ]        --> Domain classes (src/services/*)
             │            Extends CrudService base class
             │            Holds business logic (totals math, numbering, overdue logic, auth checks)
             ▼
[ 4. Repository ]     --> Domain persistence classes (src/repository/*)
             │            Extends CrudRepository base class
             │            User data scoping on every single query (`where: { userId }`)
             ▼
[ 5. Database Layer ] --> Single Prisma Client singleton (src/config/db.ts)
                          PostgreSQL database (`User`, `Client`, `Invoice`, `LineItem`)
```

### Response Envelope Standard

Every API route returns the exact same envelope for both success and failure states:

```json
{
  "data": { ... } | null,
  "success": true | false,
  "message": "Human-readable status description",
  "err": null | "Error description"
}
```

---

## 💾 Database Schema & Key Architectural Decisions

```mermaid
erDiagram
    USER ||--o{ CLIENT : owns
    USER ||--o{ INVOICE : owns
    CLIENT ||--o{ INVOICE : receives
    INVOICE ||--|{ LINE_ITEM : contains

    USER {
        string id PK
        string email UK
        string name
        string businessName
        string currency
        string invoicePrefix
    }
    CLIENT {
        string id PK
        string userId FK
        string name
        string email
        string company
        string address
        string phone
    }
    INVOICE {
        string id PK
        string userId FK
        string clientId FK
        string invoiceNumber
        string status
        datetime issueDate
        datetime dueDate
        decimal taxPercent
        decimal discountPercent
        string publicToken UK
        datetime paidAt
    }
    LINE_ITEM {
        string id PK
        string invoiceId FK
        string description
        decimal quantity
        decimal rate
        int sortOrder
    }
```

### 1. Computed `OVERDUE` Status (Never Persisted)
In accordance with accounting domain standards, `OVERDUE` is **never stored** in the database. Instead, it is computed dynamically:
$$\text{isOverdue} = (\text{status} = \text{SENT}) \land (\text{dueDate} < \text{today})$$
This prevents stale database states when invoices pass midnight without cron jobs.

### 2. Transactional Invoice Numbering
Invoice numbers follow the format `{invoicePrefix}-{YYYY}-{4-digit sequence}` (e.g., `INV-2026-0007`). Sequences are calculated transactionally per-user and per-calendar-year.

### 3. Shared Totals Math
A single mathematical formula is used identically on the server and client:
1. $\text{subtotal} = \sum (\text{quantity} \times \text{rate})$
2. $\text{discountAmount} = \text{subtotal} \times (\text{discountPercent} / 100)$
3. $\text{taxableAmount} = \max(0, \text{subtotal} - \text{discountAmount})$
4. $\text{taxAmount} = \text{taxableAmount} \times (\text{taxPercent} / 100)$
5. $\text{total} = \text{taxableAmount} + \text{taxAmount}$

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- PostgreSQL database running locally or remotely

### Environment Variables
Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/billflow"
NEXTAUTH_SECRET="billflow-super-secure-production-ready-nextauth-secret-key-32chars"
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Setup Commands
```bash
# 1. Install dependencies
npm install

# 2. Push schema to database
npx prisma db push

# 3. Seed demo account, clients, and 11 realistic invoices
npx prisma db seed

# 4. Start Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference (`/api/v1/`)

| Method | Endpoint | Auth | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Public | Register new user account | 201, 400, 409 |
| `POST` | `/api/auth/[...nextauth]` | Public | NextAuth sign-in / session | 200, 401 |
| `GET` | `/api/v1/clients` | Bearer/Cookie | List user clients (optional `?search=`) | 200, 401 |
| `POST` | `/api/v1/clients` | Bearer/Cookie | Create client | 201, 400, 401 |
| `GET` | `/api/v1/clients/:id` | Bearer/Cookie | Get client details & invoices | 200, 401, 404 |
| `PATCH` | `/api/v1/clients/:id` | Bearer/Cookie | Update client contact details | 200, 401, 404 |
| `DELETE` | `/api/v1/clients/:id` | Bearer/Cookie | Delete client (blocked if invoices exist) | 200, 400, 401, 404 |
| `GET` | `/api/v1/invoices` | Bearer/Cookie | Filtered invoices (search, status, client, page) | 200, 401 |
| `POST` | `/api/v1/invoices` | Bearer/Cookie | Create invoice with dynamic line items | 201, 400, 401 |
| `GET` | `/api/v1/invoices/:id` | Bearer/Cookie | Get full invoice document & line items | 200, 401, 404 |
| `PATCH` | `/api/v1/invoices/:id` | Bearer/Cookie | Update existing invoice | 200, 400, 401, 404 |
| `DELETE` | `/api/v1/invoices/:id` | Bearer/Cookie | Delete invoice | 200, 401, 404 |
| `POST` | `/api/v1/invoices/:id/send` | Bearer/Cookie | Mark invoice as SENT and activate public token | 200, 400, 401 |
| `POST` | `/api/v1/invoices/:id/pay` | Bearer/Cookie | Owner manual override to mark invoice as PAID | 200, 401, 404 |
| `GET` | `/api/v1/invoices/public/:token` | **Public** | Client portal view of invoice document | 200, 404 |
| `POST` | `/api/v1/invoices/public/:token/pay` | **Public** | Simulated client online checkout payment | 200, 404 |
| `GET` | `/api/v1/dashboard` | Bearer/Cookie | Totals, Recharts 6-month revenue, recent invoices | 200, 401 |
| `GET` | `/api/v1/settings` | Bearer/Cookie | Studio settings, currency, prefix, logo | 200, 401 |
| `PATCH` | `/api/v1/settings` | Bearer/Cookie | Update studio settings | 200, 401 |
| `POST` | `/api/v1/upload/logo` | Bearer/Cookie | Upload studio logo (PNG, JPG, SVG, max 2MB) | 200, 400, 401 |

---

## 🎨 Design System & Visual Tokens

The application employs a warm organic palette engineered for zero eye fatigue and an editorial aesthetic:
- **Canvas Base**: `#EAE7DC` (Bone White / Eggshell)
- **Surfaces & Cards**: `#FAF8F5` with `#D8C3A5` (Warm Sand) structural borders
- **Primary CTA & Accents**: `#E85A4F` (Rust Coral) and `#E98074` (Muted Coral)
- **High-Contrast Text**: `#2B2824` (Warm Charcoal)
- **Semantic Status Badges**:
  - `DRAFT`: Slate / Warm Sand (`bg-[#D8C3A5]/40 text-[#2B2824]`)
  - `SENT`: Coral (`bg-[#E98074]/15 text-[#E85A4F]`)
  - `PAID`: Emerald (`bg-emerald-100 text-emerald-800`)
  - `OVERDUE`: Rust (`bg-[#E85A4F]/20 text-[#E85A4F]`)
- **Print Styles**: Dedicated print stylesheets hide navigation, headers, and action buttons for clean, single-page client document PDFs.
