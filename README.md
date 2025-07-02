# PCMC Pediatric Blood Center - Medical Blood Donation Portal

A comprehensive blood donation management system built with Next.js 15, designed to streamline the entire blood donation lifecycle from donor registration to collection and distribution.

## 🚀 Features

-   **Multi-Role System**: Admin, Host (Agency), and Donor interfaces
-   **Event Management**: Blood drive creation, scheduling, and execution
-   **Donor Management**: Registration, verification, and appointment booking
-   **Real-time Tracking**: Live updates and status monitoring
-   **Physical Examination**: Pre-donation health screening
-   **Blood Collection**: Volume tracking and method recording
-   **Audit Trails**: Complete activity logging for compliance
-   **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

-   **Framework**: Next.js 15 with App Router
-   **Database**: MySQL with Sequelize ORM
-   **Authentication**: NextAuth.js with role-based access control
-   **UI**: Tailwind CSS + shadcn/ui + DaisyUI
-   **State Management**: TanStack Query (React Query)
-   **Forms**: React Hook Form with Zod validation
-   **Styling**: Tailwind CSS with custom theming

## 📋 Prerequisites

-   Node.js 18+
-   MySQL database
-   Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd blood-bank-portal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=mysql://username:password@localhost:3306/blood_donation_db

# NextAuth
AUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email (optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# OAuth Providers (optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Database Setup

```bash
# Run migrations
npm run sequelize db:migrate

# Seed initial data
npm run sequelize db:seed:all
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

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
└── docs/                      # Documentation

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

## 👥 User Roles

### **Admin**

-   System-wide oversight and analytics
-   User and agency approval workflows
-   Event approval and monitoring
-   Blood collection tracking
-   Comprehensive reporting

### **Host (Agency)**

-   Event creation and management
-   Donor approval workflows
-   Event participant tracking
-   Coordinator management
-   Agency profile management

### **Donor**

-   Profile management and blood type verification
-   Event calendar and appointment booking
-   Donation history tracking
-   Eligibility status monitoring
-   Physical examination scheduling

## 🔄 Main Workflows

### Donor Journey

1. **Registration** → Complete profile with blood type and medical info
2. **Verification** → Admin approval of donor information
3. **Appointment Booking** → Select time slots for blood donation events
4. **Physical Examination** → Pre-donation health screening
5. **Blood Collection** → Actual donation with volume tracking

### Event Management

1. **Event Creation** → Hosts create blood donation events
2. **Admin Approval** → Approval workflow with status tracking
3. **Time Scheduling** → Multiple time slots for donor convenience
4. **Donor Registration** → Appointment booking with eligibility checks
5. **Event Execution** → Real-time management and tracking

## 🚀 Available Scripts

-   `npm run dev` - Start development server with turbo mode
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run sequelize` - Run Sequelize CLI commands

## 📊 Database Schema

The application uses a well-structured relational database with key entities:

-   **Users**: Base user accounts with role associations
-   **Donors**: Extended donor profiles with medical information
-   **Agencies**: Partner organizations
-   **BloodDonationEvents**: Blood drive events
-   **DonorAppointments**: Appointment scheduling
-   **PhysicalExaminations**: Health screening records
-   **BloodDonationCollections**: Actual blood collection data
-   **AuditTrails**: Activity logging for compliance

## 🔧 Configuration

### Database Configuration

Edit `config/config.cjs` for database settings:

```javascript
module.exports = {
    development: {
        username: "root",
        password: "root",
        database: "blood_donation_db",
        host: "localhost",
        dialect: "mysql",
    },
    // ... production config
};
```

## 🐳 Docker Support

The project includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed for PCMC Pediatric Blood Center.

## 🆘 Support

For support and questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Maintainer**: PCMC Development Team
