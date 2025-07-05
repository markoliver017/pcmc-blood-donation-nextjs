# Notification & Email Quick Reference

## 🚀 Quick Implementation Checklist

### Before You Start

-   [ ] **Check Models**: Verify notification type exists in `NotificationModel.js`
-   [ ] **Check Categories**: Verify email template category exists in `EmailTemplateModel.js`
-   [ ] **Check Fields**: Verify dynamic fields are defined in `emailTemplateUtils.js`

### Implementation Steps

1. [ ] **Create Seeder**: Add default email template to seeder file
2. [ ] **Run Seeder**: `npx sequelize-cli db:seed --seed your-seeder-file.js`
3. [ ] **Test Template**: Verify template appears in admin interface
4. [ ] **Implement Logic**: Add notification code to action file
5. [ ] **Test Flow**: Trigger action and verify notifications/emails

## 📋 Required Files to Check

### Models

-   `lib/models/NotificationModel.js` - Check notification types
-   `lib/models/EmailTemplateModel.js` - Check template categories
-   `lib/models/EmailNotificationModel.js` - Email notification structure

### Utilities

-   `lib/utils/emailTemplateUtils.js` - Dynamic fields and sample data

### Admin Interface

-   `app/(pages)/portal/(role_based)/admin/email-notifications/page.jsx` - Template management
-   `components/admin/email-templates/EmailTemplateForm.jsx` - Template creation

### Seeders

-   `seeders/20250115000000-seed-email-templates.js` - Template examples

## 🔧 Standard Implementation Pattern

```javascript
// 1. Critical operations in transaction
const transaction = await sequelize.transaction();
try {
    const newRecord = await Model.create(data, { transaction });
    await transaction.commit();

    // 2. Non-critical notifications (async IIFE)
    (async () => {
        // User notification
        try {
            await sendNotificationAndEmail({
                userIds: newRecord.id,
                notificationData: {
                    subject: "Your Subject",
                    message: "Your message",
                    type: "YOUR_TYPE",
                    reference_id: newRecord.id,
                    created_by: newRecord.id,
                },
            });
        } catch (err) {
            console.error("User notification failed:", err);
        }

        // Email with template
        try {
            await sendNotificationAndEmail({
                emailData: {
                    to: newRecord.email,
                    templateCategory: "YOUR_CATEGORY",
                    templateData: {
                        // All dynamic fields
                        user_name: `${newRecord.first_name} ${newRecord.last_name}`,
                        // ... other fields
                    },
                },
            });
        } catch (err) {
            console.error("Email failed:", err);
        }

        // Audit trail
        try {
            await logAuditTrail({
                userId: newRecord.id,
                controller: "your_controller",
                action: "CREATE",
                details: "Your audit message",
            });
        } catch (err) {
            console.error("Audit failed:", err);
        }
    })();

    return { success: true, data: newRecord };
} catch (err) {
    await transaction.rollback();
    return { success: false, message: extractErrorMessage(err) };
}
```

## 📧 Email Template Structure

```javascript
{
    name: "Template Name",
    category: "YOUR_CATEGORY",
    subject: "Subject with {{dynamic_field}}",
    html_content: `<div>HTML template with {{dynamic_field}}</div>`,
    text_content: `Plain text with {{dynamic_field}}`,
    dynamic_fields: JSON.stringify([
        "field1",
        "field2",
        // ... all fields used
    ]),
    is_active: true,
    created_by: null,
    updated_by: null,
    createdAt: new Date(),
    updatedAt: new Date(),
}
```

## 🎯 Common Notification Types

### System Notifications

-   `AGENCY_APPROVAL` - Agency approval workflows
-   `AGENCY_COORDINATOR_REGISTRATION` - Coordinator registration
-   `AGENCY_COORDINATOR_APPROVAL` - Coordinator approval
-   `AGENCY_DONOR_APPROVAL` - Agency donor approval workflows
-   `BLOOD_DRIVE_APPROVAL` - Event approval
-   `GENERAL` - General notifications
-   `APPOINTMENT` - Appointment related
-   `COLLECTION` - Blood collection
-   `SYSTEM` - System notifications

### Email Template Categories

-   `AGENCY_REGISTRATION` - Agency registration emails
-   `AGENCY_APPROVAL` - Agency approval emails
-   `AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY` - Agency coordinator notification emails
-   `AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY` - Agency donor notification emails (blood type optional)
-   `DONOR_REGISTRATION` - Donor registration emails
-   `EVENT_CREATION` - Event creation emails
-   `APPOINTMENT_BOOKING` - Appointment emails
-   `BLOOD_COLLECTION` - Collection emails
-   `MBDT_NOTIFICATION` - Admin notifications
-   `GENERAL` - General emails

## 🔍 Testing Checklist

### Template Testing

-   [ ] Template appears in admin interface
-   [ ] Preview functionality works
-   [ ] Dynamic fields are replaced correctly
-   [ ] Both HTML and text versions render properly

### Notification Testing

-   [ ] Notification records created in database
-   [ ] Emails are sent successfully
-   [ ] Error handling works properly
-   [ ] Audit trails are logged

## 🚨 Common Issues & Solutions

| Issue                       | Solution                                     |
| --------------------------- | -------------------------------------------- |
| Template not found          | Add category to `EmailTemplateModel.js` ENUM |
| Dynamic fields not replaced | Include field in `templateData` object       |
| Notification type error     | Add type to `NotificationModel.js` ENUM      |
| Email not sending           | Check email configuration and logs           |
| Preview not working         | Verify template structure and fields         |

## 📞 Support

-   **Full Guide**: See `NOTIFICATION_AND_EMAIL_IMPLEMENTATION_GUIDE.md`
-   **Code Examples**: Check `agencyAction.js` lines 386-586
-   **Template Examples**: Check seeder files
-   **Admin Interface**: `/portal/admin/email-notifications`

---

**Quick Reference v1.0** - January 2025
