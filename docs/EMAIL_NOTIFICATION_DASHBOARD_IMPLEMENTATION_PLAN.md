# 📧 Email Notification Dashboard Implementation Plan

## 🎯 Overview

This plan outlines the step-by-step implementation of an email notification dashboard for the PCMC Pediatric Blood Center portal. The dashboard will allow admins to create, edit, and manage email notification templates with dynamic fields using the existing Tiptap editor.

## 🏗️ Architecture Overview

### Core Components

1. **Email Template Management** - CRUD operations for email templates
2. **Dynamic Field System** - Placeholder system for dynamic content
3. **Tiptap Integration** - Rich text editor for template creation
4. **Template Categories** - Organization by notification type
5. **Preview System** - Real-time template preview with sample data

## 📋 Dependencies & Plugins Required

### Existing Dependencies (Already Available)

-   ✅ Next.js 15 with App Router
-   ✅ MySQL with Sequelize ORM
-   ✅ Tailwind CSS + shadcn/ui + DaisyUI
-   ✅ React Hook Form with Zod validation
-   ✅ Tiptap editor (already implemented)

### New Dependencies to Install

```bash
npm install @tiptap/extension-placeholder
npm install @tiptap/extension-highlight
npm install @tiptap/extension-text-align
npm install @tiptap/extension-link
npm install @tiptap/extension-image
npm install @tiptap/extension-table
npm install @tiptap/extension-table-row
npm install @tiptap/extension-table-cell
npm install @tiptap/extension-table-header
```

## 🗄️ Database Schema

### Email Template Model

```javascript
// lib/models/EmailTemplateModel.js
const EmailTemplateModel = (sequelize, DataTypes) => {
    const EmailTemplate = sequelize.define(
        "EmailTemplate",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            category: {
                type: DataTypes.ENUM(
                    "AGENCY_REGISTRATION",
                    "AGENCY_APPROVAL",
                    "DONOR_REGISTRATION",
                    "DONOR_APPROVAL",
                    "EVENT_CREATION",
                    "APPOINTMENT_BOOKING",
                    "BLOOD_COLLECTION",
                    "SYSTEM_NOTIFICATION",
                    "GENERAL"
                ),
                allowNull: false,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            html_content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            text_content: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            dynamic_fields: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: "Array of available dynamic fields for this template",
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "email_templates" }
    );

    EmailTemplate.associate = (models) => {
        EmailTemplate.belongsTo(models.User, {
            foreignKey: "created_by",
            onDelete: "SET NULL",
        });
        EmailTemplate.belongsTo(models.User, {
            foreignKey: "updated_by",
            onDelete: "SET NULL",
        });
    };

    return EmailTemplate;
};
```

## 📝 Implementation Steps

### Phase 1: Backend Foundation ✅

-   [x] **Step 1.1**: Review existing email utilities and templates
-   [x] **Step 1.2**: Create base email template system
-   [x] **Step 1.3**: Create EmailTemplateModel and migration
-   [x] **Step 1.4**: Create email template actions (CRUD operations)
-   [x] **Step 1.5**: Create API routes for template management

### Phase 2: Frontend Components

-   [x] **Step 2.1**: Create email template list component
-   [x] **Step 2.2**: Create email template form component with Tiptap
-   [x] **Step 2.3**: Create dynamic field selector component (integrated in form)
-   [x] **Step 2.4**: Create template preview component
-   [x] **Step 2.5**: Create template category filter component (integrated in list)

### Phase 3: Dashboard Integration ✅

-   [x] **Step 3.1**: Implement main dashboard page layout
-   [x] **Step 3.2**: Integrate all components into dashboard
-   [x] **Step 3.3**: Add template management functionality
-   [x] **Step 3.4**: Add preview and testing functionality

### Phase 4: Dynamic Field System

-   [ ] **Step 4.1**: Define dynamic field schema
-   [ ] **Step 4.2**: Create field placeholder system
-   [ ] **Step 4.3**: Implement field validation
-   [ ] **Step 4.4**: Create field preview with sample data

### Phase 5: Testing & Optimization

-   [ ] **Step 5.1**: Test template creation and editing
-   [ ] **Step 5.2**: Test dynamic field replacement
-   [ ] **Step 5.3**: Test email sending with templates
-   [ ] **Step 5.4**: Performance optimization

## 🎨 UI/UX Design

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Email Notification Templates                               │
├─────────────────────────────────────────────────────────────┤
│ [Category Filter] [Search] [Create New Template]         │
├─────────────────────────────────────────────────────────────┤
│ Template List (Table/Grid)                                │
│ ┌─────────┬─────────┬─────────┬─────────┬─────────────┐   │
│ │ Name    │ Category│ Subject │ Status  │ Actions     │   │
│ ├─────────┼─────────┼─────────┼─────────┼─────────────┤   │
│ │ Template│ Agency  │ Welcome │ Active  │ [Edit][Del] │   │
│ │ Name    │ Reg     │ Email   │         │             │   │
│ └─────────┴─────────┴─────────┴─────────┴─────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Template Editor Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Edit Email Template                                        │
├─────────────────────────────────────────────────────────────┤
│ Template Name: [________________] Category: [Dropdown]     │
│ Subject: [________________________________]               │
├─────────────────────────────────────────────────────────────┤
│ Dynamic Fields: [Field Selector] [Add Field]             │
│ Available: {{user_name}}, {{agency_name}}, {{event_date}} │
├─────────────────────────────────────────────────────────────┤
│ Tiptap Editor (Rich Text)                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Toolbar: Bold, Italic, Font Size, etc.]              │ │
│ │                                                         │ │
│ │ [Rich text content with dynamic fields]                │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [Preview] [Save Draft] [Save Template] [Cancel]          │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Dynamic Field System

### Available Dynamic Fields

```javascript
const DYNAMIC_FIELDS = {
    // User-related fields
    user_name: "Full name of the user",
    user_email: "User's email address",
    user_first_name: "User's first name",
    user_last_name: "User's last name",

    // Agency-related fields
    agency_name: "Name of the agency",
    agency_address: "Agency address",
    agency_contact: "Agency contact number",

    // Event-related fields
    event_name: "Name of the blood donation event",
    event_date: "Event date",
    event_time: "Event time",
    event_location: "Event location",

    // Appointment-related fields
    appointment_date: "Appointment date",
    appointment_time: "Appointment time",
    appointment_status: "Appointment status",

    // System fields
    system_name: "System name (PCMC Pediatric Blood Center)",
    support_email: "Support email address",
    domain_url: "Portal domain URL",

    // Blood collection fields
    blood_type: "Donor's blood type",
    collection_date: "Blood collection date",
    collection_volume: "Blood collection volume",

    // Approval fields
    approval_status: "Approval status (Approved/Rejected)",
    approval_date: "Date of approval/rejection",
    approval_reason: "Reason for approval/rejection",
};
```

## 📋 Template Categories

1. **AGENCY_REGISTRATION** - New agency registration notifications
2. **AGENCY_APPROVAL** - Agency approval/rejection notifications
3. **DONOR_REGISTRATION** - New donor registration notifications
4. **DONOR_APPROVAL** - Donor approval/rejection notifications
5. **EVENT_CREATION** - Blood drive event notifications
6. **APPOINTMENT_BOOKING** - Appointment booking notifications
7. **BLOOD_COLLECTION** - Blood collection notifications
8. **SYSTEM_NOTIFICATION** - System-wide notifications
9. **GENERAL** - General purpose notifications

## 🚀 Next Steps

### Immediate Actions Required:

1. **Install new Tiptap extensions** for enhanced editing capabilities
2. **Create EmailTemplateModel** and database migration
3. **Create server actions** for template CRUD operations
4. **Build the main dashboard page** with template management

### Success Criteria:

-   ✅ Admins can create and edit email templates
-   ✅ Dynamic fields are properly integrated and validated
-   ✅ Templates can be previewed with sample data
-   ✅ Templates are organized by category
-   ✅ Rich text editing with Tiptap works seamlessly
-   ✅ Email sending with templates works correctly

## 📊 Progress Tracking

-   [x] **Phase 1**: Backend Foundation (5/5 steps) ✅
-   [x] **Phase 2**: Frontend Components (5/5 steps) ✅
-   [x] **Phase 3**: Dashboard Integration (4/4 steps) ✅
-   [ ] **Phase 4**: Dynamic Field System (0/4 steps)
-   [ ] **Phase 5**: Testing & Optimization (0/4 steps)

**Overall Progress**: 60% Complete (Dashboard Integration Complete)

---

**Created**: January 2025  
**Last Updated**: January 2025  
**Status**: Planning Phase  
**Priority**: High
