# Email Template Setup Guide for Agency Registration

## Overview

This guide explains how to set up and use the email templates for agency registration in the PCMC Pediatric Blood Center Blood Donation Portal.

## 🎯 What We've Created

### 1. Email Template Form Enhancement

-   **File**: `components/admin/email-templates/EmailTemplateForm.jsx`
-   **Feature**: Auto-loads a professional agency registration template when creating a new template for the "AGENCY_REGISTRATION" category

### 2. Database Seeder

-   **File**: `seeders/20250115000000-seed-email-templates.js`
-   **Purpose**: Creates default email templates in the database

### 3. Professional Email Templates

#### Agency Registration Welcome Email

-   **Category**: `AGENCY_REGISTRATION`
-   **Subject**: "🩸 Welcome to PCMC Pediatric Blood Center - Your Agency Registration is Received"
-   **Features**:
    -   Professional PCMC branding with blood drop emoji
    -   Clear application status (Under Review)
    -   Agency information summary
    -   Next steps explanation
    -   Important notes and warnings
    -   Contact information
    -   Both HTML and plain text versions

#### Agency Approval Notification

-   **Category**: `AGENCY_APPROVAL`
-   **Subject**: "🎉 Congratulations! Your Agency Registration Has Been Approved"
-   **Features**:
    -   Celebration-themed design
    -   Clear approval status
    -   Getting started guide
    -   Portal access instructions

## 🚀 Setup Instructions

### Option 1: Run the Seeder (Recommended)

```bash
# Run the specific seeder
npx sequelize-cli db:seed --seed 20250115000000-seed-email-templates.js

# Or run all seeders
npx sequelize-cli db:seed:all
```

### Option 2: Use the Email Template Form

1. Navigate to Admin → Email Notifications
2. Click "Create Template"
3. Select "Agency Registration" category
4. The form will automatically load the professional template
5. Review and customize as needed
6. Save the template

## 📧 Dynamic Fields Available

The templates use these dynamic fields that get replaced with actual data:

| Field                   | Description           | Example                            |
| ----------------------- | --------------------- | ---------------------------------- |
| `{{user_name}}`         | Full name of the user | "John Doe"                         |
| `{{user_email}}`        | User's email address  | "john.doe@agency.com"              |
| `{{user_first_name}}`   | User's first name     | "John"                             |
| `{{user_last_name}}`    | User's last name      | "Doe"                              |
| `{{agency_name}}`       | Name of the agency    | "ABC Blood Bank"                   |
| `{{agency_address}}`    | Agency address        | "123 Main St, City"                |
| `{{registration_date}}` | Registration date     | "1/15/2025"                        |
| `{{system_name}}`       | System name           | "Blood Donation Management System" |
| `{{support_email}}`     | Support email         | "support@pcmc.gov.ph"              |
| `{{domain_url}}`        | Portal URL            | "https://portal.pcmc.gov.ph"       |

## 🔄 Integration with Agency Registration

The email template is automatically used in the `storeAgency` function in `app/action/agencyAction.js`:

```javascript
// 3. Send email to the registering user (template only)
try {
    await sendNotificationAndEmail({
        emailData: {
            to: newUser.email,
            templateCategory: "AGENCY_REGISTRATION",
            templateData: {
                user_first_name: newUser.first_name,
                user_last_name: newUser.last_name,
                user_email: newUser.email,
                user_name: `${newUser.first_name} ${newUser.last_name}`,
                agency_name: newAgency.name,
                agency_address: newAgency.address,
                system_name: "Blood Donation Management System",
                registration_date: new Date().toLocaleDateString(),
            },
        },
    });
} catch (err) {
    console.error("User email failed:", err);
}
```

## 🎨 Template Features

### Professional Design

-   **Branding**: PCMC Pediatric Blood Center with blood drop emoji
-   **Color Scheme**: Red (#dc2626) for headers, professional grays for content
-   **Layout**: Responsive design that works on all devices
-   **Typography**: Clean, readable fonts with proper hierarchy

### Content Structure

1. **Header**: PCMC branding and system name
2. **Greeting**: Personalized welcome message
3. **Status Section**: Clear application status with visual indicators
4. **Agency Details**: Organized information table
5. **Next Steps**: Numbered list of what happens next
6. **Important Notes**: Warning section with key information
7. **Contact Information**: Support details
8. **Footer**: Professional closing with tagline

### Accessibility

-   **Plain Text Version**: Included for email clients that don't support HTML
-   **High Contrast**: Good color contrast for readability
-   **Clear Structure**: Logical information hierarchy
-   **Alt Text Ready**: Images and icons have text alternatives

## 🧪 Testing

### Test the Template

1. Go to Admin → Email Notifications → Test
2. Select "AGENCY_REGISTRATION" category
3. Enter a test email address
4. Click "Send Test Email"
5. Check the recipient's inbox

### Test with Real Registration

1. Register a new agency through the portal
2. Check that the email is sent automatically
3. Verify all dynamic fields are replaced correctly
4. Test on different email clients (Gmail, Outlook, etc.)

## 🔧 Customization

### Modify the Template

1. Go to Admin → Email Notifications
2. Find the "Agency Registration Welcome" template
3. Click "Edit"
4. Modify the content as needed
5. Save changes

### Add New Templates

1. Create a new template with category "AGENCY_REGISTRATION"
2. The form will auto-load the default template
3. Customize for your specific needs
4. Set as active template

## 📋 Best Practices

### Content Guidelines

-   Keep the tone professional but welcoming
-   Use clear, simple language
-   Include all necessary information
-   Provide clear next steps
-   Include contact information

### Technical Guidelines

-   Test templates on multiple email clients
-   Keep HTML simple and compatible
-   Always include a plain text version
-   Use inline CSS for email compatibility
-   Test dynamic field replacement

### Branding Guidelines

-   Use PCMC colors consistently
-   Include the blood drop emoji (🩸) for recognition
-   Maintain professional appearance
-   Include the tagline "Empowering communities, one donation at a time"

## 🆘 Troubleshooting

### Common Issues

1. **Template not found**: Ensure the seeder has been run
2. **Dynamic fields not replaced**: Check field names match exactly
3. **Email not sending**: Verify email configuration
4. **Formatting issues**: Test in different email clients

### Debug Steps

1. Check the email template is active in the database
2. Verify the template category matches exactly
3. Test with the email test page
4. Check server logs for errors

## 📞 Support

For issues with email templates:

-   Check the email notifications dashboard
-   Review server logs for errors
-   Test with the provided test pages
-   Contact the development team if needed

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintainer**: PCMC Development Team
