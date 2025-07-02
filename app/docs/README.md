# PCMC Pediatric Blood Center - Medical Blood Donation Portal

## Application Overview

This is a comprehensive **PCMC Pediatric Blood Center - Medical Blood Donation** portal that manages the entire blood donation lifecycle from donor registration to blood collection and distribution. The application provides a complete ecosystem for blood donation management, ensuring proper tracking, compliance, and efficient blood collection operations.

## Core Architecture

-   **Framework**: Next.js 15 with App Router
-   **Database**: MySQL with Sequelize ORM
-   **Authentication**: NextAuth.js with role-based access control
-   **UI**: Tailwind CSS with shadcn/ui components
-   **State Management**: React Query for server state
-   **Data Querying/Mutation**: TanStack Query
-   **Form**: REACT HOOK FORM
-   **Form Validation**: Zod schema validation
-   **Styling**: DaisyUI components with custom theming

## User Roles & Access Control

The application implements a sophisticated role-based system with three main user types:

### 1. **Admin** - System Administrators

-   Full system access and oversight
-   User and agency approval workflows
-   Event approval and monitoring
-   Blood collection tracking
-   Comprehensive reporting and analytics
-   System-wide dashboard with real-time metrics

### 2. **Hosts** - Agency Coordinators

-   Agency profile management
-   Blood drive event creation and management
-   Donor approval workflows
-   Event participant tracking
-   Coordinator management
-   Event scheduling and time slot management

### 3. **Donors** - Blood Donors

-   Profile management and blood type verification
-   Event calendar viewing and appointment booking
-   Donation history tracking
-   Eligibility status monitoring
-   Real-time appointment status updates

## Main Workflow & Functionality

### 1. User Authentication & Role Selection

```
Login → Role Selection → Role-Based Dashboard → Role-Specific Features
```

**Features:**

-   Multi-provider authentication (GitHub, Google, Credentials)
-   Role-based session management
-   Dynamic role selection interface
-   URL-based access control for different user types
-   Session timeout and security management

### 2. Donor Management Workflow

```
Registration → Verification → Profile Management → Appointment Booking → Physical Exam → Blood Collection
```

**Key Features:**

-   **Donor Registration**: Complete profile creation with blood type, personal info, and medical history
-   **Eligibility Tracking**: 90-day donation interval enforcement
-   **Blood Type Verification**: Admin verification of donor blood types
-   **Appointment System**: Time-slot booking for blood donation events
-   **Physical Examination**: Pre-donation health screening with detailed medical checks
-   **Blood Collection**: Volume tracking and collection method recording (whole blood/apheresis)

### 3. Blood Drive Event Management

```
Event Creation → Admin Approval → Time Scheduling → Donor Registration → Event Execution → Collection Tracking
```

**Event Lifecycle:**

-   **Creation**: Hosts create blood donation events with detailed information
-   **Approval**: Admin approval workflow with status tracking
-   **Scheduling**: Multiple time slots per event for donor convenience
-   **Registration**: Donor appointment booking with eligibility checks
-   **Execution**: Real-time event management and participant tracking
-   **Collection**: Blood volume and method tracking with detailed records

### 4. Agency & Coordinator Management

-   **Agency Registration**: Partner organizations registration with verification
-   **Coordinator Management**: Agency staff management and role assignment
-   **Approval Workflows**: Admin approval for agencies and coordinators
-   **Event Hosting**: Agencies can host blood donation events
-   **Profile Management**: Agency information and contact details

### 5. Administrative Functions

-   **Dashboard Analytics**: Real-time metrics and statistics
-   **User Management**: Complete user lifecycle management
-   **Event Oversight**: Approval and monitoring of blood drives
-   **Collection Tracking**: Blood donation volume and method tracking
-   **Audit Trails**: Complete activity logging for compliance
-   **Reporting**: Comprehensive reporting capabilities

## Database Schema

The application uses a well-structured relational database with key entities:

### Core Entities:

-   **Users**: Base user accounts with role associations
-   **Donors**: Extended donor profiles with medical information
-   **Agencies**: Partner organizations
-   **BloodDonationEvents**: Blood drive events
-   **DonorAppointments**: Appointment scheduling
-   **PhysicalExaminations**: Health screening records
-   **BloodDonationCollections**: Actual blood collection data
-   **AuditTrails**: Activity logging for compliance

### Key Relationships:

-   Users can have multiple roles (Admin, Host, Donor)
-   Donors belong to agencies
-   Events are hosted by agencies
-   Appointments link donors to events
-   Collections track actual blood donations

## Key Features by Role

### For Donors:

-   Profile management and blood type verification
-   Event calendar and appointment booking
-   Donation history tracking
-   Eligibility status monitoring
-   Real-time appointment status
-   Physical examination scheduling
-   Blood collection tracking

### For Hosts (Agencies):

-   Event creation and management
-   Donor approval workflows
-   Event participant tracking
-   Coordinator management
-   Agency profile management
-   Time slot scheduling
-   Event status monitoring

### For Admins:

-   System-wide oversight and analytics
-   User and agency approval workflows
-   Event approval and monitoring
-   Blood collection tracking
-   Comprehensive reporting
-   Audit trail management
-   System configuration

## Technical Highlights

### 1. **Real-time Updates**

-   React Query for live data synchronization
-   Optimistic updates for better UX
-   Background data refetching

### 2. **Form Validation**

-   Zod schema validation throughout
-   Client and server-side validation
-   Comprehensive error handling

### 3. **Error Handling**

-   Comprehensive error management
-   User-friendly error messages
-   Graceful fallbacks

### 4. **Responsive Design**

-   Mobile-friendly interface
-   Adaptive layouts
-   Touch-optimized interactions

### 5. **Security**

-   Role-based access control
-   Session management
-   Audit trails
-   Input validation and sanitization

### 6. **Performance**

-   Optimized queries
-   Caching strategies
-   Lazy loading
-   Code splitting

## Application Structure

```
app/
├── (pages)/                    # Main application pages
│   ├── (main)/                # Public landing pages
│   ├── auth/                  # Authentication pages
│   ├── portal/                # Main portal interface
│   │   └── (role_based)/      # Role-specific pages
│   │       ├── admin/         # Admin dashboard and features
│   │       ├── donors/        # Donor interface
│   │       └── hosts/         # Host/Agency interface
│   └── organizers/            # Organizer management
├── action/                    # Server actions
├── api/                       # API routes
├── store/                     # Client state management
└── styles/                    # Global styles

components/                    # Reusable UI components
├── admin/                     # Admin-specific components
├── donors/                    # Donor-specific components
├── events/                    # Event management components
├── form/                      # Form components
├── layout/                    # Layout components
├── ui/                        # Base UI components
└── reusable_components/       # Shared components

lib/                          # Core libraries and utilities
├── models/                    # Database models
├── utils/                     # Utility functions
├── zod/                       # Validation schemas
└── auth.js                    # Authentication configuration
```

## Workflow Summary

The application creates a complete ecosystem where:

1. **Agencies** register and get approved to host blood drives
2. **Donors** register, get verified, and book appointments
3. **Events** are created, approved, and executed
4. **Blood collections** are tracked and managed
5. **Admins** oversee the entire process with comprehensive analytics

This creates a streamlined blood donation management system that ensures:

-   **Proper tracking** of all donations and participants
-   **Compliance** with medical and regulatory requirements
-   **Efficient blood collection** operations
-   **Transparency** in the donation process
-   **Quality assurance** through verification workflows

## Getting Started

### Prerequisites

-   Node.js 18+
-   MySQL database
-   Next.js 14
-   Required environment variables

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations
5. Start the development server: `npm run dev`

### Environment Variables

-   Database connection strings
-   NextAuth configuration
-   API keys for external services
-   Email service configuration

## Contributing

Please refer to the project's contribution guidelines for development standards and procedures.

## License

This project is proprietary software developed for PCMC Pediatric Blood Center.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
