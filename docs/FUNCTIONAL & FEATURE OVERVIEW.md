==================================================
Functional & Feature Overview
==================================================
Core pillars (taken from
README.md
, code structure under app/, and role-based pages):

A. Cross-Cutting Platform Features

Role-based access (Admin, Host/Agency, Donor) via NextAuth & RLS middleware
Global navigation with contextual sidebars per role
Audit Trail logging (admin/audit-trails)
Email / in-app notifications (email-notifications)
Responsive UI (Tailwind, shadcn/ui, DaisyUI)
TANStack Query data-fetching with optimistic updates
Form handling with RHF + Zod validation
Sequelize ORM over MySQL, fully-typed API layer (api/)
B. Admin Portal

Dashboard analytics widgets (
admin/page.js
)
User / role management (admin/(users))
Agency onboarding & approval (admin/(agencies))
Donor registry & eligibility status (admin/(admin-donors))
Event oversight & approval (admin/(admin-events))
Appointment calendar (admin/(admin-appointments))
Blood-collection tracker (admin/(admin-blood-collection))
Emergency blood requests (admin/emergency-requests)
Announcements broadcast (admin/announcements)
Reporting module scaffold (admin/reports) – Phase-1 in progress
C. Host (Agency) Portal

Agency profile management
Event creation, editing, scheduling
Coordinator sub-accounts
Donor appointment list / check-in sheet
Real-time event dashboard
D. Donor Portal

Self-registration & profile, blood type upload
Calendar view of upcoming events
Appointment booking / cancellation
Pre-screening questionnaire
Donation history & eligibility timeline
E. Public (Unauthenticated)

Landing pages, FAQ, contact form with email notifications (implemented)
