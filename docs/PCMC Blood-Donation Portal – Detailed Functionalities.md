# PCMC Blood-Donation Portal – Detailed Functionalities

## 1. Cross-Cutting

-   AuthN/AuthZ – NextAuth roles, JWT sessions, server-side `auth()` helper
-   Global Layout – responsive sidebar + top-bar ([layout.jsx](cci:7://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/portal/%28role_based%29/hosts/layout.jsx:0:0-0:0))
-   Notification Center – email & in-app (ShadCN toasts, `action/notify*`, `email-notifications/`)
-   Audit Trail – DB model + `/admin/audit-trails` UI
-   Error & “not-found” routes – graceful fallback pages
-   Optimistic data fetching – TANStack Query providers, React Suspense
-   Form Framework – RHF + Zod + custom `<FormField>` components
-   Full i18n ready – date/number format utils

## 2. Admin Role

| Module             | Path                                                                                                                                                                                                                                                         | Core Features                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Dashboard          | [admin/page.js](cci:7://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/portal/%28role_based%29/admin/page.js:0:0-0:0), [Dashboard.jsx](cci:7://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/portal/%28role_based%29/hosts/Dashboard.jsx:0:0-0:0) | KPI cards (donors, units, events), charts    |
| Donor Registry     | [(admin-donors)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                                                                                                                                      | Search, eligibility toggle, CSV export       |
| Blood Collections  | [(admin-blood-collection)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                                                                                                                            | Volume entry, method (WB/APH), examiner link |
| Appointments       | [(admin-appointments)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                                                                                                                                | Calendar + list view, status update          |
| Events             | [(admin-events)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                                                                                                                                      | CRUD, approval workflow, slot management     |
| Agencies           | [(agencies)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                                                                                                                                          | On-boarding approval, profile view           |
| Coordinators       | [(coordinators)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                                                                                                                                      | Assign/remove coordinators to agencies       |
| Users              | [(users)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                                                                                                                                             | Global user/role CRUD, lock/activate         |
| Audit Trails       | `audit-trails`                                                                                                                                                                                                                                               | Filter by date/user/action, export           |
| Emergency Requests | `emergency-requests`                                                                                                                                                                                                                                         | List + fulfil blood type requests            |
| Announcements      | `announcements`                                                                                                                                                                                                                                              | Compose & schedule broadcast                 |
| Reports (Phase-1)  | `reports`                                                                                                                                                                                                                                                    | Tab scaffold; filters via `ReportContext`    |
| Profile            | `profile`                                                                                                                                                                                                                                                    | Password reset, avatar upload                |

## 3. Host / Agency Role

| Module              | Path                                                                                                                                   | Core Features                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Dashboard           | [hosts/Dashboard.jsx](cci:7://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/portal/%28role_based%29/hosts/Dashboard.jsx:0:0-0:0) | Event status, units collected                 |
| Events              | [(hosts-events)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                | Create, update, cancel events; time-slot grid |
| Donors at Event     | [(hosts-donors)](cci:1://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/organizers/coordinators/page.jsx:3:0-11:1)                | Check-in table, eligibility indicator         |
| Manage Coordinators | `manage-coordinators`                                                                                                                  | Invite, role assignment                       |
| Emergency Requests  | `emergency-requests`                                                                                                                   | Raise urgent blood requests                   |
| Announcements       | `announcements`                                                                                                                        | View admin broadcasts                         |
| Profile             | `profile`                                                                                                                              | Agency info & logo upload                     |

## 4. Donor Role

| Module           | Path                                                                                                                                     | Core Features                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Dashboard        | [donors/Dashboard.jsx](cci:7://file:///c:/nextJs/blood-bank-portal/app/%28pages%29/portal/%28role_based%29/donors/Dashboard.jsx:0:0-0:0) | Next appointment, eligibility status      |
| Events           | `donors/events`                                                                                                                          | Browse upcoming drives, slot availability |
| Appointments     | `donors/appointments`                                                                                                                    | Book / cancel / reschedule, QR code       |
| Profile          | `donors/profile`                                                                                                                         | Blood type upload, medical questionnaire  |
| Donation History | dashboard widgets                                                                                                                        | Timeline & PDF certificate                |
| Notifications    | global                                                                                                                                   | Email + in-app updates                    |

## 5. Registration Workflows

1. **Agency Administrator** — `/organizers/register` → `NewOrganizerForm`

    - Creates Agency + admin user record → email verification → admin approval.

2. **Coordinator** — `/organizers/coordinators` list → Drawer → `NewUserForm`

    - Tied to selected agency → agency-admin approval.

3. **Donor** — `/organizers/register/donors`
    - Creates donor profile → email verification → visible to Admins for eligibility review.

---

_Compiled 25 Jul 2025 – source of truth: README + `app/(pages)` structure._
