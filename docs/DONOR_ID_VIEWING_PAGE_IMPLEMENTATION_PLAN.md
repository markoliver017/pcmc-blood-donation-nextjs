# Donor ID Viewing Page — Detailed Implementation Plan

Below is a concise, actionable plan tailored to your codebase, models, and global rules. I'll reference exact paths and model fields.

## Objectives

-   Create a protected page for logged-in donors to view their Donor ID.
-   Show key identity details from `Donor` and related models (`User`, `BloodType`, `Agency`).
-   Support print/download (print CSS first; optional PDF).
-   Optional QR code encoded with `donor_reference_id`.

## Data Model Mapping

From `lib/models/DonorModel.js`:

-   donor_reference_id (auto: "DN000001")
-   blood_type_id → association `as: "blood_type"` → `BloodType.blood_type`
-   user_id → association `as: "user"`
-   date_of_birth
-   address, barangay, city_municipality, province → virtual `full_address`
-   contact_number
-   status: "for approval" | "activated" | "deactivated" | "rejected"
-   is_data_verified, is_bloodtype_verified, verified_by
-   agency_id → association `as: "agency"`
-   optional: id_url (can be shown on back as additional ID link if used)

From `lib/models/UserModel.js`:

-   first_name, middle_name, last_name, full_name (virtual), gender, email, image

From `lib/models/BloodTypeModel.js`:

-   blood_type

## Page Routing and Access

-   Path: `app/(pages)/portal/(role_based)/donors/id-card/page.jsx`
-   Server component to enforce authentication and role-based access.
-   Authorization rules:
    -   Must be logged-in.
    -   Must have donor role or have an associated `Donor` record.
    -   Query donor by `user_id` = session user id. If none, show clear guidance to complete donor registration.

Align with global rules:

-   App Router
-   ES Modules
-   Use path aliases where applicable
-   Use Sequelize models within server component or server action

## Data Fetching

-   Use a server-side fetch in the page to load the donor and associations:
    -   Include: `user`, `blood_type`, optional `agency`.
-   Use your `@lib/models/index.js` exported `sequelize`/`db` to perform:
    -   `db.Donor.findOne({ where: { user_id: session.user.id }, include: [ { model: db.User, as: "user" }, { model: db.BloodType, as: "blood_type" }, { model: db.Agency, as: "agency", required: false } ] })`
-   Handle missing fields gracefully:
    -   No blood type → show "Pending" with `is_bloodtype_verified` badge.
    -   `status` not activated → show a visible status badge/watermark.

## UI/UX Design

-   A4 card-like layout with front and back sections:
    -   Front:
        -   Donor reference ID (large, top)
        -   Full name (`user.full_name`) and photo (`user.image`)
        -   Blood type (`blood_type.blood_type`) with verification badge
        -   Gender, Birthdate
        -   Contact number
        -   Status badges: `status`, `is_data_verified`, `is_bloodtype_verified`
        -   Agency (if any)
    -   Back:
        -   Address (`donor.full_address`)
        -   QR code with `donor_reference_id` (optional initially)
        -   Instructions/Note and emergency contact line (if applicable)
-   Buttons:
    -   Print ID
    -   Optional: Download as PDF (phase 2)
-   Components:
    -   Use `shadcn/ui` Card, Badge, Button, Separator, Avatar/Image.
-   Tailwind for print CSS:
    -   `@media print` rules to optimize margins, hide buttons, ensure high contrast.

## Print/PDF Strategy

-   Phase 1: Native browser print with print-styled component.
-   Phase 2 (optional): Integrate with `app/api/generate-pdf/` if compatible, or create a dedicated endpoint using your existing `lib/pdf-html-template/getPdfHtmlTemplate.js`. Keep content parity with the print layout.

## QR Code (Optional)

-   Use a lightweight QR package client-side only on the card section, or server-render an SVG:
    -   Example library: `qrcode.react` or `qr-code-styling` (ensure compatibility with Next.js App Router).
-   Encode: `donor_reference_id`; optionally a deep link to the donor portal route.

## Error and Empty States

-   Not logged in → redirect to login.
-   Logged in but no donor record → CTA to register as donor.
-   Donor exists but `status !== 'activated'`:
    -   Show badge and optional watermark text on card.
-   No blood type or unverified → "Pending Verification" badge.

## Performance and Security

-   Query minimal fields.
-   Avoid leaking PII to the query string or QR code beyond what's necessary.
-   Ensure page is not indexed (if applicable): set appropriate meta or rely on internal route.

## Testing

-   Scenarios:
    -   Activated donor with complete data.
    -   Donor awaiting approval.
    -   Donor without blood type.
    -   User without donor record.
-   Visual test: Print preview looks correct and hides controls.
-   Access control test: Non-donor cannot access.

## Implementation Steps and File Changes

1. Create page

    - File: `app/(pages)/portal/(role_based)/donors/id-card/page.jsx`
    - Server component that:
        - Gets session (NextAuth).
        - Loads donor by `user_id` with `user`, `blood_type`, `agency`.
        - Renders `DonorIdCard` component, passes data.

2. Create UI component

    - File: `components/donors/DonorIdCard.jsx`
    - Client component for:
        - Presentation layout (front/back).
        - Print button handler (`window.print()`).
        - Optional QR rendering.
        - Accepts a typed prop object with mapped fields.

3. Print styles

    - Scoped styles using Tailwind and a small CSS module or `<style jsx global>` in the page as needed.
    - Hide buttons and margins in print.

4. Optional QR

    - If used, add dependency and lazy-load QR component in `DonorIdCard.jsx`.

5. Link entry points

    - Add button/link to the donors Dashboard or Profile:
        - `app/(pages)/portal/(role_based)/donors/page.js` or `.../profile/page.jsx`
        - Label: "View Donor ID"
        - Path: `/portal/(role_based)/donors/id-card`

6. Optional PDF
    - If desired, wire a "Download PDF" button to call your `generate-pdf` flow with the same HTML (or a simplified template).
    - Ensure server action returns a file stream and initiates download on client.

## Acceptance Criteria

-   Donor can navigate to `/portal/(role_based)/donors/id-card` and see:
    -   Donor Reference ID, Name, Gender, DOB, Contact, Address, Blood Type (+ badge).
    -   Status badges based on `status`, `is_data_verified`, `is_bloodtype_verified`.
    -   Print button works and produces a clean ID layout.
-   Access restricted to the authenticated donor owner.
-   Graceful states for missing fields and non-activated status.

## Estimated Effort

-   Core page + UI + print: 4–6 hours
-   QR + PDF integration: +2–4 hours
-   Testing and polish: 1–2 hours

## Current TODO Status

-   Design the Donor ID page UX and data fields based on Donor and User models — completed
-   Define routing structure under donors (e.g., /donors/id-card) and ensure auth-protected access — pending
-   Create server-side data fetcher using session to load current donor with associations — pending
-   Build Donor ID UI component with print/download capability and responsive layout — pending
-   Add optional QR code generation for donor_reference_id — pending
-   Integrate PDF/print flow (via print CSS or existing generate-pdf API) — pending
-   Add tests/checks: access only for donors, handle missing fields gracefully — pending
-   Document usage and link from donors dashboard/profile — pending
