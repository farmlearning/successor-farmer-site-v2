# SYSTEM_GUIDE.md

## 1. Project Overview

- **Goal**: Build a "Pre-registration based Authentication & Education Platform" for agricultural successors.
- **Legacy Site**: `www.후계농.com` -> Migration to Next.js 14 + Supabase.
- **Key Characteristics**:
  - **No Sign-up**: Users cannot sign up freely. Admin uploads the list, users verify themselves.
  - **Simple Login**: Name + Birthday + (Phone verification) -> Login.
  - **Admin-Centric**: Excel-based massive data processing is the core of administration.

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (globals.css variables for theme)
- **Database / Auth**: Supabase (PostgreSQL)
- **Deployment**: Vercel (Recommended) / Local

## 3. Architecture & Definitions

### 3.1 Authentication Logic

1. **Pre-registration (Phase 0)**: Admin uploads Excel (Name, Birth, Phone, Region, Type). DB `students` table populated with `is_verified=false`.
2. **User Verification (Step 3)**: User enters [Name, Birth, Phone]. System checks `students` table.
    - Match found: Update `is_verified=true`, Issue Session/Token.
    - Match failed: Reject.
3. **Login (Step 5)**: User enters [Name, Birth]. System checks `is_verified=true`.

### 3.2 Directory Structure

```
/src
  /app
    /(user)      # Public facing pages
      /page.tsx  # Landing
      /education # Application flow
    /(admin)     # Admin protected pages
      /admin     # Dashboard
  /components    # Reusable UI
  /utils         # Helpers (Supabase, Excel parser)
  /types         # TS Interfaces
```

## 4. Database Schema Rules

- **Students**: The source of truth. Uniqueness constraint on `(name, birth_date, phone)`.
- **Enrollments**: Links Student <-> Course.
- **Enrollment_Documents**: Stores file paths for uploaded user documents (Consent forms, etc.).

## 5. Security Guidelines

- **Rate Limiting**: Critical for the "Name+Birth" login to prevent brute-force guessing.
- **RLS (Row Level Security)**:
  - `students`: Select (User matching own info), Insert/Update (Admin only & User self-verification).
  - `admin`: Strict access control.

## 6. Migration Checklist

- [ ] Map legacy DB columns to Supabase schema.
- [ ] Preserve all "Notice" and "Q&A" data.
- [ ] Ensure "Certificate" generation logic is migrated.
