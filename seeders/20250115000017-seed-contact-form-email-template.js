// npx sequelize-cli db:seed --seed 20250115000017-seed-contact-form-email-template.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Contact Form Submission Notification",
            category: "CONTACT_FORM",
            subject: "🔔 New Contact Form Submission - {{contact_subject}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 {{system_name}}</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Contact Form Notification</p>
            </div>
        </div>

        <!-- Alert -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">🔔 New Contact Form Submission</h3>
            <p style="color: #92400e; margin: 0; line-height: 1.5;">
                A new contact form has been submitted through the portal. Please review and respond accordingly.
            </p>
        </div>

        <!-- Submission Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 Submission Details</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 140px;">Reference ID:</td>
                        <td style="padding: 8px 0; color: #374151;">{{reference_id}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 140px;">Submitted By:</td>
                        <td style="padding: 8px 0; color: #374151;">{{contact_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                        <td style="padding: 8px 0; color: #374151;">{{contact_email}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                        <td style="padding: 8px 0; color: #374151;">{{contact_phone}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject:</td>
                        <td style="padding: 8px 0; color: #374151;">{{contact_subject}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Submission Date:</td>
                        <td style="padding: 8px 0; color: #374151;">{{submission_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Message Content -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">💬 Message</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">{{contact_message}}</p>
            </div>
        </div>

        <!-- Action Required -->
        <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">⚡ Action Required</h3>
            <p style="color: #1e40af; margin: 0; line-height: 1.5;">
                Please log in to the admin portal to review this submission and respond to the user within 24-48 hours.
            </p>
        </div>

        <!-- Portal Access -->
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{domain_url}}/portal" style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                🔗 Access Admin Portal
            </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                This is an automated notification from {{system_name}}<br>
                For technical support, contact: <a href="mailto:{{support_email}}" style="color: #dc2626;">{{support_email}}</a>
            </p>
        </div>
    </div>
</div>`,
            text_content: `New Contact Form Submission - {{contact_subject}}

A new contact form has been submitted through the {{system_name}} portal.

Submission Details:
- Submitted By: {{contact_name}}
- Email: {{contact_email}}
- Phone: {{contact_phone}}
- Subject: {{contact_subject}}
- Submission Date: {{submission_date}}

Message:
{{contact_message}}

Action Required:
Please log in to the admin portal to review this submission and respond to the user within 24-48 hours.

Portal Access: {{domain_url}}/portal

---
This is an automated notification from {{system_name}}
For technical support, contact: {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "contact_name",
                "contact_email",
                "contact_phone",
                "contact_subject",
                "contact_message",
                "submission_date",
                "system_name",
                "support_email",
                "domain_url",
            ]),
            is_active: true,
            created_by: null,
            updated_by: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    await queryInterface.bulkInsert("email_templates", emailTemplates, {});
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete(
        "email_templates",
        {
            category: "CONTACT_FORM",
        },
        {}
    );
}
