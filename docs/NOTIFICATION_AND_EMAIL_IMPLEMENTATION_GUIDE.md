# Notification and Email Implementation Guide

## Overview

This document provides a comprehensive guide for implementing system notifications and email notifications in the PCMC Pediatric Blood Center portal. It follows the established patterns and ensures consistency across the application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Implementation Checklist](#implementation-checklist)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Code Examples](#code-examples)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before implementing any notification or email feature, ensure you have:

-   ✅ Access to the notification models (`NotificationModel.js`, `EmailTemplateModel.js`, `EmailNotificationModel.js`)
-   ✅ Understanding of the email template utilities (`emailTemplateUtils.js`)
-   ✅ Familiarity with the admin email template management interface (`page.jsx`, `EmailTemplateForm.jsx`)
-   ✅ Knowledge of the existing seeder patterns (`20250115000000-seed-email-templates.js`)

## Implementation Checklist

### Phase 1: Model Validation

-   [ ] Check if notification type exists in `NotificationModel.js`
-   [ ] Check if email template category exists in `EmailTemplateModel.js`
-   [ ] Verify dynamic fields, TEMPLATE_CATEGORIES, SAMPLE_DATA, getSampleDataForCategory(categoryData) are defined in `emailTemplateUtils.js`

### Phase 2: Template Creation

-   [ ] Create default email template in seeder if not exist for specific category type
-   [ ] Test template preview functionality
-   [ ] Verify dynamic field replacement

### Phase 3: Implementation

-   [ ] Implement notification logic in action file
-   [ ] Add email sending with template
-   [ ] Handle errors gracefully
-   [ ] Add audit trail logging

### Phase 4: Testing

-   [ ] Test notification creation
-   [ ] Test email sending
-   [ ] Verify template rendering
-   [ ] Check error handling

## Step-by-Step Implementation

### Step 1: Validate Models and Categories

#### 1.1 Check Notification Types

Review `lib/models/NotificationModel.js` and ensure your notification type exists:

```javascript
// Current notification types
"AGENCY_APPROVAL",
    "AGENCY_COORDINATOR_REGISTRATION",
    "AGENCY_COORDINATOR_APPROVAL",
    "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
    "AGENCY_DONOR_APPROVAL",
    "BLOOD_DRIVE_APPROVAL",
    "GENERAL",
    "APPOINTMENT",
    "COLLECTION",
    "SYSTEM";
```

**If your type doesn't exist, add it to the ENUM.**

#### 1.2 Check Email Template Categories

Review `lib/models/EmailTemplateModel.js` and ensure your category exists:

```javascript
// Current email template categories
"AGENCY_REGISTRATION",
    "AGENCY_COORDINATOR_REGISTRATION",
    "AGENCY_COORDINATOR_APPROVAL",
    "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
    "AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
    "AGENCY_APPROVAL",
    "DONOR_REGISTRATION",
    "DONOR_APPROVAL",
    "EVENT_CREATION",
    "APPOINTMENT_BOOKING",
    "BLOOD_COLLECTION",
    "SYSTEM_NOTIFICATION",
    "MBDT_NOTIFICATION",
    "GENERAL";
```

**If your category doesn't exist, add it to the ENUM.**

#### 1.3 Check Dynamic Fields

Review `lib/utils/emailTemplateUtils.js` and ensure your dynamic fields are defined:

```javascript
// Add your dynamic fields here if needed
export const DYNAMIC_FIELDS = {
    // Existing fields...
    your_new_field: "Description of your new field",
};
```

### Step 2: Create Email Template Seeder

#### 2.1 Create New Seeder File

Create a new seeder file following the pattern: `seeders/YYYYMMDDHHMMSS-seed-your-template-name.js`

#### 2.2 Template Structure

Follow the structure from `20250115000000-seed-email-templates.js`:

```javascript
{
    name: "Your Template Name",
    category: "YOUR_CATEGORY",
    subject: "Your Email Subject with {{dynamic_fields}}",
    html_content: `Your HTML template with {{dynamic_fields}}`,
    text_content: `Your plain text template with {{dynamic_fields}}`,
    dynamic_fields: JSON.stringify([
        "field1",
        "field2",
        // ... all dynamic fields used in template
    ]),
    is_active: true,
    created_by: null,
    updated_by: null,
    createdAt: new Date(),
    updatedAt: new Date(),
}
```

#### 2.3 Template Best Practices

-   Use consistent styling with PCMC branding
-   Include both HTML and text versions
-   Use semantic HTML structure
-   Include proper error handling placeholders
-   Add support contact information
-   Use emojis sparingly but effectively

### Step 3: Implement Notification Logic

#### 3.1 Standard Implementation Pattern

Follow the pattern from `agencyAction.js` lines 386-586:

```javascript
// 1. Main transaction for critical operations
const transaction = await sequelize.transaction();

try {
    // Critical operations (user creation, data saving)
    const newUser = await User.create(data, { transaction });
    await transaction.commit();

    // 2. Non-critical notifications (wrapped in async IIFE)
    (async () => {
        // User notification
        try {
            await sendNotificationAndEmail({
                userIds: newUser.id,
                notificationData: {
                    subject: "Your Notification Subject",
                    message: "Your notification message",
                    type: "YOUR_NOTIFICATION_TYPE",
                    reference_id: newUser.id,
                    created_by: newUser.id,
                },
            });
        } catch (err) {
            console.error("User notification failed:", err);
        }

        // Admin notifications
        try {
            const adminRole = await Role.findOne({
                where: { role_name: "Admin" },
            });
            if (adminRole) {
                const adminUsers = await User.findAll({
                    include: [
                        {
                            model: Role,
                            as: "roles",
                            where: { id: adminRole.id },
                            through: { attributes: [] },
                        },
                    ],
                });
                if (adminUsers.length > 0) {
                    await sendNotificationAndEmail({
                        userIds: adminUsers.map((a) => a.id),
                        notificationData: {
                            subject: "Admin Notification Subject",
                            message: "Admin notification message",
                            type: "YOUR_NOTIFICATION_TYPE",
                            reference_id: newUser.id,
                            created_by: newUser.id,
                        },
                    });
                }
            }
        } catch (err) {
            console.error("Admin notification failed:", err);
        }

        // Email sending with template
        try {
            await sendNotificationAndEmail({
                emailData: {
                    to: newUser.email,
                    templateCategory: "YOUR_TEMPLATE_CATEGORY",
                    templateData: {
                        // All dynamic fields for the template
                        user_name: `${newUser.first_name} ${newUser.last_name}`,
                        user_email: newUser.email,
                        // ... other fields
                    },
                },
            });
        } catch (err) {
            console.error("Email sending failed:", err);
        }

        // Audit trail
        try {
            await logAuditTrail({
                userId: newUser.id,
                controller: "your_controller",
                action: "CREATE",
                details: `Your audit trail message`,
            });
        } catch (err) {
            console.error("Audit trail failed:", err);
        }
    })();

    return { success: true, data, message: "Success message" };
} catch (err) {
    await transaction.rollback();
    return { success: false, message: extractErrorMessage(err) };
}
```

### Step 4: Testing and Validation

#### 4.1 Test Template Creation

1. Run the seeder: `npx sequelize-cli db:seed --seed your-seeder-file.js`
2. Verify template appears in admin interface
3. Test template preview functionality
4. Verify dynamic field replacement

#### 4.2 Test Notification Flow

1. Trigger the action that creates notifications
2. Check database for notification records
3. Verify email sending (check logs)
4. Test error scenarios

## Code Examples

### Example 1: Simple User Registration Notification

```javascript
// In your action file
export async function registerUser(formData) {
    const transaction = await sequelize.transaction();

    try {
        const newUser = await User.create(formData, { transaction });
        await transaction.commit();

        // Non-critical notifications
        (async () => {
            // User notification
            try {
                await sendNotificationAndEmail({
                    userIds: newUser.id,
                    notificationData: {
                        subject: "Welcome to PCMC Blood Center",
                        message: "Your account has been created successfully.",
                        type: "GENERAL",
                        reference_id: newUser.id,
                        created_by: newUser.id,
                    },
                });
            } catch (err) {
                console.error("User notification failed:", err);
            }

            // Welcome email
            try {
                await sendNotificationAndEmail({
                    emailData: {
                        to: newUser.email,
                        templateCategory: "USER_REGISTRATION",
                        templateData: {
                            user_name: `${newUser.first_name} ${newUser.last_name}`,
                            user_email: newUser.email,
                            registration_date: new Date().toLocaleDateString(),
                            system_name: "PCMC Pediatric Blood Center",
                            support_email: "support@pcmc.gov.ph",
                            domain_url: process.env.NEXT_PUBLIC_APP_URL,
                        },
                    },
                });
            } catch (err) {
                console.error("Welcome email failed:", err);
            }
        })();

        return { success: true, data: newUser };
    } catch (err) {
        await transaction.rollback();
        return { success: false, message: extractErrorMessage(err) };
    }
}
```

### Example 2: Event Creation Notification

```javascript
// In your event action file
export async function createEvent(formData) {
    const session = await auth();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const transaction = await sequelize.transaction();

    try {
        const newEvent = await Event.create(formData, { transaction });
        await transaction.commit();

        // Notifications
        (async () => {
            // Notify event creator
            try {
                await sendNotificationAndEmail({
                    userIds: session.user.id,
                    notificationData: {
                        subject: "Event Created Successfully",
                        message: `Your event "${newEvent.name}" has been created.`,
                        type: "EVENT_CREATION",
                        reference_id: newEvent.id,
                        created_by: session.user.id,
                    },
                });
            } catch (err) {
                console.error("Event creator notification failed:", err);
            }

            // Email confirmation
            try {
                await sendNotificationAndEmail({
                    emailData: {
                        to: session.user.email,
                        templateCategory: "EVENT_CREATION",
                        templateData: {
                            user_name: `${session.user.first_name} ${session.user.last_name}`,
                            event_name: newEvent.name,
                            event_date: newEvent.date,
                            event_location: newEvent.location,
                            system_name: "PCMC Pediatric Blood Center",
                            support_email: "support@pcmc.gov.ph",
                        },
                    },
                });
            } catch (err) {
                console.error("Event creation email failed:", err);
            }
        })();

        return { success: true, data: newEvent };
    } catch (err) {
        await transaction.rollback();
        return { success: false, message: extractErrorMessage(err) };
    }
}
```

## Best Practices

### 1. Error Handling

-   Always wrap notifications in try-catch blocks

### 2. Blood Type Handling

-   Blood type is optional for donors
-   Pass "Not specified" string when blood type is not provided
-   No special verification required from agency administrators
-   Standard approval process applies regardless of blood type status
-   Use non-blocking async operations for notifications
-   Log errors but don't fail the main operation
-   Provide meaningful error messages

### 2. Transaction Management

-   Keep critical operations in transactions
-   Commit transactions before sending notifications
-   Rollback on critical failures
-   Use async IIFE for non-critical operations

### 3. Template Design

-   Use consistent branding and styling
-   Include both HTML and text versions
-   Test with various email clients
-   Use semantic HTML structure
-   Include proper fallbacks

### 4. Performance

-   Use bulk operations for multiple notifications
-   Implement rate limiting if needed
-   Cache frequently used templates
-   Monitor email delivery rates

### 5. Security

-   Validate all dynamic field inputs
-   Sanitize HTML content
-   Use environment variables for sensitive data
-   Implement proper access controls

## Troubleshooting

### Common Issues

#### 1. Template Not Found

**Problem**: Email template category doesn't exist
**Solution**: Add category to `EmailTemplateModel.js` ENUM

#### 2. Dynamic Fields Not Replaced

**Problem**: Template shows `{{field_name}}` instead of actual values
**Solution**: Ensure field is included in `templateData` object

#### 3. Notification Type Error

**Problem**: Invalid notification type
**Solution**: Add type to `NotificationModel.js` ENUM

#### 4. Email Not Sending

**Problem**: Emails not being delivered
**Solution**: Check email configuration and logs

#### 5. Template Preview Issues

**Problem**: Preview not working in admin interface
**Solution**: Verify template structure and dynamic fields

### Debug Checklist

-   [ ] Check database for notification records
-   [ ] Verify email template exists in database
-   [ ] Check email server configuration
-   [ ] Review application logs
-   [ ] Test template preview functionality
-   [ ] Verify dynamic field mapping

## Maintenance

### Regular Tasks

1. Monitor email delivery rates
2. Review and update templates
3. Clean up old notifications
4. Update dynamic fields as needed
5. Test notification flows

### Updates

1. Update this guide when adding new notification types
2. Document new template categories
3. Update seeder examples
4. Review and improve error handling

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintainer**: PCMC Development Team

For questions or updates to this guide, please contact the development team.
