// npx sequelize-cli db:seed --seed 20250115000003-seed-agency-donor-notification-template.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Agency Donor Registration Notification",
            category: "AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
            subject:
                "🩸 New Donor Registration - {{donor_name}} has registered with {{agency_name}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">New Donor Registration Notification</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear Agency Administrator,</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                A new donor has registered with <strong>{{agency_name}}</strong> and is awaiting your approval. Please review their information and take appropriate action.
            </p>
        </div>

        <!-- Donor Information -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 Donor Information</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Donor Name:</td>
                        <td style="padding: 8px 0; color: #374151;">{{donor_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email Address:</td>
                        <td style="padding: 8px 0; color: #374151;">{{donor_email}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Contact Number:</td>
                        <td style="padding: 8px 0; color: #374151;">+63 {{contact_number}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Blood Type:</td>
                        <td style="padding: 8px 0; color: #374151;">{{blood_type}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Registration Date:</td>
                        <td style="padding: 8px 0; color: #374151;">{{registration_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Action Required -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">⚠️ Action Required</h3>
            <p style="color: #92400e; margin: 0; line-height: 1.5;">
                Please log in to your agency portal to review and approve this donor registration. 
                The donor will not be able to participate in blood donation events until their account is approved.
            </p>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 What You Need to Do</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Review Donor Information:</strong> Check the donor's profile and verify all provided information.</li>
                    <li><strong>Approve or Reject:</strong> Make a decision based on your agency's criteria.</li>
                    <li><strong>Notify Donor:</strong> The system will automatically notify the donor of your decision.</li>
                </ol>
            </div>
        </div>

        <!-- Portal Access -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🔗 Access Your Portal</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                Click the button below to access your agency portal and manage donor registrations:
            </p>
            <a href="{{domain_url}}/portal/hosts" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Access Agency Portal
            </a>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about donor management or need assistance, please contact us:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Email:</strong> {{support_email}}<br>
                    <strong>Phone:</strong> {{support_contact}}<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #dc2626; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for your continued partnership in our blood donation initiative.<br>
                <strong>PCMC Pediatric Blood Center</strong><br>
                <em>Together, we save lives.</em>
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
            text_content: `Dear Agency Administrator,

A new donor has registered with {{agency_name}} and is awaiting your approval. Please review their information and take appropriate action.

DONOR INFORMATION:
- Donor Name: {{donor_name}}
- Email Address: {{donor_email}}
- Contact Number: +63 {{contact_number}}
- Blood Type: {{blood_type}}
- Registration Date: {{registration_date}}

ACTION REQUIRED:
Please log in to your agency portal to review and approve this donor registration. The donor will not be able to participate in blood donation events until their account is approved.

WHAT YOU NEED TO DO:
1. Review Donor Information: Check the donor's profile and verify all provided information.
2. Approve or Reject: Make a decision based on your agency's criteria.
3. Notify Donor: The system will automatically notify the donor of your decision.

ACCESS YOUR PORTAL:
Visit {{domain_url}}/portal/hosts to manage donor registrations.

NEED HELP?
If you have any questions about donor management or need assistance, please contact us:
- Email: {{support_email}}
- Phone: {{support_contact}}
- Portal: {{domain_url}}

Thank you for your continued partnership in our blood donation initiative.

PCMC Pediatric Blood Center
Together, we save lives.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "agency_name",
                "donor_name",
                "donor_email",
                "contact_number",
                "blood_type",
                "registration_date",
                "system_name",
                "support_email",
                "support_contact",
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
            category: ["AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY"],
        },
        {}
    );
}
