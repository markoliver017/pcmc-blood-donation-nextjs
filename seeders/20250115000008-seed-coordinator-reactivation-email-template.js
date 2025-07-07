// npx sequelize-cli db:seed --seed 20250115000008-seed-coordinator-reactivation-email-template
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Coordinator Reactivation Notification",
            category: "COORDINATOR_REACTIVATION",
            subject: "✅ Your Coordinator Account Has Been Reactivated by {{agency_name}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #059669; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">✅ PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Coordinator Account Reactivated</p>
            </div>
        </div>
        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Good news! Your coordinator account for <strong>{{agency_name}}</strong> has been <span style="color: #059669; font-weight: bold;">reactivated</span> as of {{reactivation_date}}. You may now log in and resume your coordinator duties.
            </p>
        </div>
        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">What You Can Do Now</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>Log in to your coordinator portal and review your dashboard.</li>
                    <li>Resume managing blood donation events and donor coordination.</li>
                    <li>Contact your agency or PCMC support if you have any questions.</li>
                </ul>
            </div>
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
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #059669; text-decoration: none;">{{domain_url}}</a>
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
            text_content: `Dear {{user_name}},

Good news! Your coordinator account for {{agency_name}} has been REACTIVATED as of {{reactivation_date}}. You may now log in and resume your coordinator duties.

WHAT YOU CAN DO NOW:
- Log in to your coordinator portal and review your dashboard.
- Resume managing blood donation events and donor coordination.
- Contact your agency or PCMC support if you have any questions.

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
                "user_name",
                "agency_name",
                "user_email",
                "user_first_name",
                "user_last_name",
                "reactivation_date",
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
            category: "COORDINATOR_REACTIVATION",
        },
        {}
    );
} 