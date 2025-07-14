# Event Donor Invitation Implementation

## Overview

This document outlines the implementation of system notifications and email notifications for blood donation event invitations to donors.

## Implementation Summary

### 1. Model Updates

#### NotificationModel.js

-   Added `NEW_EVENT` notification type to the ENUM
-   Used for system notifications when new blood donation events are available

#### EmailTemplateModel.js

-   Added `EVENT_DONOR_INVITATION` email template category to the ENUM
-   Used for email invitations to donors for blood donation events

#### emailTemplateUtils.js

-   Added new dynamic fields: `event_title`, `event_description`, `event_organizer`
-   Updated `TEMPLATE_CATEGORIES` array to include `EVENT_DONOR_INVITATION`
-   Added sample data for `EVENT_DONOR_INVITATION` category
-   Added color styling for the new category

### 2. Email Template

#### Seeder File: `20250115000014-seed-event-donor-invitation-email-template.js`

-   Created comprehensive email template with:
    -   Professional PCMC branding
    -   Event details section
    -   Call-to-action button
    -   Preparation tips
    -   Eligibility requirements
    -   Contact information
-   Includes both HTML and text versions
-   Uses dynamic fields for personalization

### 3. Server Action Updates

#### donorAction.js - `notifyRegistrationOpen` function

-   **Enhanced Parameters**: Now accepts `eventData` parameter
-   **System Notification**: Sends `NEW_EVENT` type notification to donor
-   **Email Notification**: Sends `EVENT_DONOR_INVITATION` template email
-   **Error Handling**: Comprehensive try-catch blocks for each operation
-   **Audit Trail**: Logs notification activities
-   **Authentication**: Validates user session before sending

### 4. Component Updates

#### NotifyEventRegistration.jsx

-   **Enhanced Props**: Now accepts `eventData` prop
-   **Updated Function Calls**: Passes event data to server action
-   **Maintains Existing Functionality**: Toast notifications and retry logic

#### eventColumns.js

-   **Updated Usage**: Passes event data to NotifyEventRegistration component
-   **Context**: Used in approved events dropdown menu

## Dynamic Fields Used

The email template uses the following dynamic fields:

-   `event_name`: Name of the blood donation event
-   `event_date`: Event date (formatted)
-   `event_time`: Event time range
-   `event_location`: Event location
-   `event_organizer`: Name of the event organizer
-   `system_name`: PCMC Pediatric Blood Center
-   `support_email`: Support email address
-   `domain_url`: Portal domain URL

## Notification Flow

1. **User Action**: Host clicks "Notify Donors" button for an approved event
2. **System Notification**: Donor receives in-app notification (type: NEW_EVENT)
3. **Email Notification**: Donor receives detailed email invitation
4. **Audit Trail**: System logs the notification activity
5. **Error Handling**: Failed notifications are tracked and can be retried

## Testing Checklist

-   [ ] Run email template seeder: `npx sequelize-cli db:seed --seed 20250115000014-seed-event-donor-invitation-email-template.js`
-   [ ] Verify template appears in admin email template management
-   [ ] Test template preview functionality
-   [ ] Verify dynamic field replacement
-   [ ] Test notification sending from approved events
-   [ ] Check system notification creation
-   [ ] Verify email delivery
-   [ ] Test error handling scenarios
-   [ ] Verify audit trail logging

## Usage

The notification system is automatically triggered when:

1. An event is approved and available for donor registration
2. Host clicks "Notify Donors" button in the events list
3. System sends both in-app notification and email to all eligible donors

## Error Handling

-   Individual notification failures don't stop the entire process
-   Failed notifications are tracked and can be retried
-   Comprehensive error logging for debugging
-   Graceful degradation if email or notification services fail

## Security

-   Session validation before sending notifications
-   Proper authentication checks
-   Audit trail for all notification activities
-   No sensitive data exposed in notifications

## Maintenance

-   Monitor email delivery rates
-   Review notification effectiveness
-   Update template content as needed
-   Monitor system performance impact

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintainer**: PCMC Development Team
