// npx sequelize-cli db:seed --seed 20250115000007-seed-coordinator-deactivation-email-template
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Coordinator Deactivation Notification",
            category: "COORDINATOR_DEACTIVATION",
            subject: "⚠️ Your Coordinator Account Has Been Deactivated by {{agency_name}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">⚠️ PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Coordinator Account Deactivated</p>
            </div>
        </div>
        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                We regret to inform you that your coordinator account for <strong>{{agency_name}}</strong> has been <span style="color: #dc2626; font-weight: bold;">deactivated</span> as of {{deactivation_date}}.
            </p>
        </div>
        <!-- Reason -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #991b1b; margin-bottom: 10px;">Reason for Deactivation</h3>
            <p style="color: #991b1b;">{{deactivation_reason}}</p>
        </div>
        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">What Happens Next?</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>If you believe this was a mistake, please contact your agency or PCMC support.</li>
                    <li>You will not be able to access the coordinator portal until your account is reactivated.</li>
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
            text_content: `Dear {{user_name}},

We regret to inform you that your coordinator account for {{agency_name}} has been DEACTIVATED as of {{deactivation_date}}.

REASON FOR DEACTIVATION:
{{deactivation_reason}}

WHAT HAPPENS NEXT:
- If you believe this was a mistake, please contact your agency or PCMC support.
- You will not be able to access the coordinator portal until your account is reactivated.

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
                "deactivation_date",
                "deactivation_reason",
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
            category: "COORDINATOR_DEACTIVATION",
        },
        {}
    );
} 