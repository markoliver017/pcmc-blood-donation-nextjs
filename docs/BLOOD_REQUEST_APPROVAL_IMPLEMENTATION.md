# Blood Request Approval Notification Implementation

## Overview

This document outlines the implementation of system notifications and email notifications for blood request status updates in the PCMC Pediatric Blood Center portal.

## Implementation Summary

### 1. Model Updates

#### NotificationModel.js

-   Added `BLOOD_REQUEST_APPROVAL` notification type to the ENUM
-   Used for system notifications when blood request status is updated

#### EmailTemplateModel.js

-   Added `BLOOD_REQUEST_APPROVAL` email template category to the ENUM
-   Used for email notifications about blood request status changes

#### emailTemplateUtils.js

-   Added new dynamic fields for blood request notifications:
    -   `blood_request_id`: Blood request ID
    -   `blood_component`: Blood component type
    -   `patient_name`: Patient name
    -   `patient_gender`: Patient gender
    -   `patient_date_of_birth`: Patient date of birth
    -   `blood_type`: Blood type
    -   `no_of_units`: Number of units requested
    -   `diagnosis`: Patient diagnosis
    -   `hospital_name`: Hospital name
    -   `request_date`: Blood request date
    -   `request_status`: Blood request status
    -   `status_update_date`: Date of status update
    -   `status_remarks`: Remarks for status update
-   Updated `TEMPLATE_CATEGORIES` array to include `BLOOD_REQUEST_APPROVAL`
-   Added sample data for `BLOOD_REQUEST_APPROVAL` category
-   Added color styling for the new category

### 2. Email Template

#### Seeder File: `20250115000015-seed-blood-request-approval-email-template.js`

-   Created comprehensive email template with:
    -   Professional PCMC branding
    -   Status update section
    -   Blood request details
    -   Status-specific information (fulfilled, expired, cancelled, pending)
    -   Next steps guidance
    -   Contact information
-   Includes both HTML and text versions
-   Uses dynamic fields for personalization
-   Conditional content based on request status

### 3. Server Action Updates

#### bloodRequestAction.js - `updateBloodRequestStatus` function

-   **Enhanced Query**: Now includes user and blood type data for notifications
-   **System Notification**: Sends `BLOOD_REQUEST_APPROVAL` type notification to request user
-   **Email Notification**: Sends `BLOOD_REQUEST_APPROVAL` template email
-   **Error Handling**: Comprehensive try-catch blocks for each operation
-   **Audit Trail**: Logs notification activities
-   **Authentication**: Validates user session before sending
-   **Non-blocking**: Notifications sent asynchronously after transaction commit

## Dynamic Fields Used

The email template uses the following dynamic fields:

-   `user_name`: Full name of the blood request user
-   `user_email`: Email address of the blood request user
-   `blood_request_id`: Blood request ID
-   `blood_component`: Type of blood component requested
-   `patient_name`: Name of the patient
-   `patient_gender`: Patient's gender
-   `patient_date_of_birth`: Patient's date of birth
-   `blood_type`: Required blood type
-   `no_of_units`: Number of units requested
-   `diagnosis`: Patient's diagnosis
-   `hospital_name`: Hospital name
-   `request_date`: Date of the blood request
-   `request_status`: Current status of the request
-   `status_update_date`: Date when status was updated
-   `status_remarks`: Remarks provided with the status update
-   `system_name`: PCMC Pediatric Blood Center
-   `support_email`: Support email address
-   `domain_url`: Portal domain URL

## Notification Flow

1. **User Action**: Admin updates blood request status
2. **Database Update**: Status is updated in the database
3. **System Notification**: Request user receives in-app notification (type: BLOOD_REQUEST_APPROVAL)
4. **Email Notification**: Request user receives detailed email with status update
5. **Audit Trail**: System logs the status update activity
6. **Error Handling**: Failed notifications are logged but don't affect the main operation

## Status-Specific Email Content

The email template includes conditional content based on the request status:

-   **Fulfilled**: Green success message with fulfillment confirmation
-   **Expired**: Red warning message with expiration notice
-   **Cancelled**: Red error message with cancellation notice
-   **Pending**: Yellow warning message with pending status information

## Testing Checklist

-   [ ] Run email template seeder: `npx sequelize-cli db:seed --seed 20250115000015-seed-blood-request-approval-email-template.js`
-   [ ] Verify template appears in admin email template management
-   [ ] Test template preview functionality
-   [ ] Verify dynamic field replacement
-   [ ] Test status update from admin interface
-   [ ] Check system notification creation
-   [ ] Verify email delivery
-   [ ] Test error handling scenarios
-   [ ] Verify audit trail logging
-   [ ] Test all status types (fulfilled, expired, cancelled, pending)

## Usage

The notification system is automatically triggered when:

1. An admin updates a blood request status
2. The status change is saved to the database
3. System sends both in-app notification and email to the request user
4. Notifications include all relevant request details and status information

## Error Handling

-   Individual notification failures don't stop the main status update operation
-   Failed notifications are logged for debugging
-   Comprehensive error logging for each notification type
-   Graceful degradation if email or notification services fail

## Security

-   Session validation before processing status updates
-   Proper authentication checks for admin users
-   Audit trail for all status update activities
-   No sensitive patient data exposed in notifications (only necessary information)

## Maintenance

-   Monitor email delivery rates for blood request notifications
-   Review notification effectiveness and user feedback
-   Update template content as needed
-   Monitor system performance impact
-   Regular review of status update workflows

## Blood Request Status Types

The system supports the following status types:

-   **pending**: Initial status when request is created
-   **fulfilled**: Request has been completed and blood units allocated
-   **expired**: Request has expired and is no longer valid
-   **cancelled**: Request has been cancelled by admin or user

Each status change triggers appropriate notifications with status-specific messaging.

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintainer**: PCMC Development Team
