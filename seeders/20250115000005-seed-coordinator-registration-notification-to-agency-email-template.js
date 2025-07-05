// npx sequelize-cli db:seed --seed 20250115000005-seed-coordinator-registration-notification-to-agency-email-template.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Coordinator Registration Notification to Agency",
            category: "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
            subject:
                "🩸 New Coordinator Registration: {{coordinator_name}} is Awaiting Your Approval",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Coordinator Registration Notification</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Hello {{agency_name}} Administrator,</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                A new coordinator has registered under your agency and is now awaiting your review and approval. Please review the details below and take the appropriate action in your agency portal.
            </p>
        </div>

        <!-- Coordinator Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">👤 Coordinator Registration Details</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 150px;">Coordinator Name:</td>
                        <td style="padding: 8px 0; color: #374151;">{{coordinator_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email Address:</td>
                        <td style="padding: 8px 0; color: #374151;">{{coordinator_email}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Contact Number:</td>
                        <td style="padding: 8px 0; color: #374151;">+63 {{coordinator_contact}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Registration Date:</td>
                        <td style="padding: 8px 0; color: #374151;">{{registration_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🚦 What Should You Do?</h3>
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #f59e0b;">
                <ol style="color: #92400e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Log in</strong> to your agency portal: <a href="{{domain_url}}" style="color: #dc2626; text-decoration: underline;">{{domain_url}}</a></li>
                    <li><strong>Review</strong> the coordinator's registration details</li>
                    <li><strong>Approve or Reject</strong> the application as appropriate</li>
                    <li><strong>Contact</strong> the coordinator if you need more information</li>
                </ol>
            </div>
        </div>

        <!-- Important Notes -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important:</h4>
            <ul style="color: #991b1b; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Only approve coordinators who are authorized to represent your agency</li>
                <li>Ensure the coordinator's contact information is correct</li>
                <li>Contact PCMC support for any issues or questions</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                For assistance, please contact:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>PCMC Support:</strong> {{support_email}}<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #dc2626; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                <strong>PCMC Pediatric Blood Center</strong><br>
                <em>Empowering communities, one donation at a time.</em>
            </p>
        </div>
    </div>
    
    <!-- Footer Note -->
    <div style="text-align: center; margin-top: 20px;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This is an automated message. Please do not reply to this email.<br>
            For support, contact us at {{support_email}}
        </p>
    </div>
</div>`,
            text_content: `Hello {{agency_name}} Administrator,

A new coordinator has registered under your agency and is now awaiting your review and approval. Please review the details below and take the appropriate action in your agency portal.

COORDINATOR REGISTRATION DETAILS:
- Coordinator Name: {{coordinator_name}}
- Email Address: {{coordinator_email}}
- Contact Number: +63 {{coordinator_contact}}
- Registration Date: {{registration_date}}

WHAT SHOULD YOU DO?
1. Log in to your agency portal: {{domain_url}}
2. Review the coordinator's registration details
3. Approve or Reject the application as appropriate
4. Contact the coordinator if you need more information

IMPORTANT:
- Only approve coordinators who are authorized to represent your agency
- Ensure the coordinator's contact information is correct
- Contact PCMC support for any issues or questions

NEED HELP?
For assistance, please contact:
- PCMC Support: {{support_email}}
- Portal: {{domain_url}}

PCMC Pediatric Blood Center
Empowering communities, one donation at a time.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "agency_name",
                "coordinator_name",
                "coordinator_email",
                "coordinator_contact",
                "registration_date",
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
            category: "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
        },
        {}
    );
}
