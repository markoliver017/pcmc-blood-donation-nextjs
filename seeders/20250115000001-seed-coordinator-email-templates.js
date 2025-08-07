// npx sequelize-cli db:seed --seed 20250115000001-seed-coordinator-email-templates.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Coordinator Registration Welcome",
            category: "AGENCY_COORDINATOR_REGISTRATION",
            subject:
                "👥 Welcome to PCMC Pediatric Blood Center - Your Coordinator Registration is Received",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">👥 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Coordinator Registration</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Thank you for registering as a <strong>Coordinator</strong> for <strong>{{agency_name}}</strong>. We are excited to welcome you to our team of dedicated coordinators who help organize and manage blood donation events.
            </p>
        </div>

        <!-- Status Information -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">📋 Application Status: Under Review</h3>
            <p style="color: #92400e; margin: 0; line-height: 1.5;">
                Your coordinator application is currently being reviewed by the <strong>{{agency_name}}</strong> administration team. 
                This process typically takes 1-2 business days. You will receive a confirmation email once your account is approved.
            </p>
        </div>

        <!-- Coordinator Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">👤 Your Coordinator Information</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Agency Name:</td>
                        <td style="padding: 8px 0; color: #374151;">{{agency_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Coordinator Name:</td>
                        <td style="padding: 8px 0; color: #374151;">{{user_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email Address:</td>
                        <td style="padding: 8px 0; color: #374151;">{{user_email}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Contact Number:</td>
                        <td style="padding: 8px 0; color: #374151;">+63 {{contact_number}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Registration Date:</td>
                        <td style="padding: 8px 0; color: #374151;">{{registration_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Role Description -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🎯 Your Role as Coordinator</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 15px;">
                    As a coordinator, you will be responsible for:
                </p>
                <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Event Management:</strong> Creating and organizing blood donation events</li>
                    <li><strong>Donor Coordination:</strong> Managing donor registrations and appointments</li>
                    <li><strong>Communication:</strong> Liaising between donors, agencies, and PCMC</li>
                    <li><strong>Reporting:</strong> Providing updates and reports on event progress</li>
                </ul>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 What Happens Next?</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Review Process:</strong> Your agency will review your application and verify your information.</li>
                    <li><strong>Account Approval:</strong> Once approved, your account will be activated and you'll have access to the portal.</li>
                    <li><strong>Event Creation:</strong> You'll be able to create and manage blood donation events for your agency.</li>
                </ol>
            </div>
        </div>

        <!-- Important Notes -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Notes:</h4>
            <ul style="color: #991b1b; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>You will not be able to log in or use the platform until your registration is approved by your agency.</li>
                <li>Please ensure all provided information is accurate and up-to-date.</li>
                <li>Keep this email for your records and future reference.</li>
                <li>Your access will be limited to events and activities for {{agency_name}} only.</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about your registration or need assistance, please contact:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Your Agency:</strong> {{agency_name}}<br>
                    <strong>PCMC Support:</strong> {{support_email}}<br>
                    <strong>Phone:</strong> {{support_contact}}<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #3b82f6; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for joining our mission to save lives through blood donation.<br>
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

Thank you for registering as a Coordinator for {{agency_name}}. We are excited to welcome you to our team of dedicated coordinators who help organize and manage blood donation events.

APPLICATION STATUS: UNDER REVIEW
Your coordinator application is currently being reviewed by the {{agency_name}} administration team. This process typically takes 1-2 business days. You will receive a confirmation email once your account is approved.

YOUR COORDINATOR INFORMATION:
- Agency Name: {{agency_name}}
- Coordinator Name: {{user_name}}
- Email Address: {{user_email}}
- Contact Number: {{contact_number}}
- Registration Date: {{registration_date}}

YOUR ROLE AS COORDINATOR:
As a coordinator, you will be responsible for:
- Event Management: Creating and organizing blood donation events
- Donor Coordination: Managing donor registrations and appointments
- Communication: Liaising between donors, agencies, and PCMC
- Reporting: Providing updates and reports on event progress

WHAT HAPPENS NEXT?
1. Review Process: Your agency will review your application and verify your information.
2. Account Approval: Once approved, your account will be activated and you'll have access to the portal.
3. Event Creation: You'll be able to create and manage blood donation events for your agency.

IMPORTANT NOTES:
- You will not be able to log in or use the platform until your registration is approved by your agency.
- Please ensure all provided information is accurate and up-to-date.
- Keep this email for your records and future reference.
- Your access will be limited to events and activities for {{agency_name}} only.

NEED HELP?
If you have any questions about your registration or need assistance, please contact:
- Your Agency: {{agency_name}}
- PCMC Support: {{support_email}}
- Phone: {{support_contact}}
- Portal: {{domain_url}}

Thank you for joining our mission to save lives through blood donation.

PCMC Pediatric Blood Center
Empowering communities, one donation at a time.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "user_name",
                "user_email",
                "user_first_name",
                "user_last_name",
                "agency_name",
                "contact_number",
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
            category: "AGENCY_COORDINATOR_REGISTRATION",
        },
        {}
    );
}
