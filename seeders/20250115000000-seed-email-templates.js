// npx sequelize-cli db:seed --seed 20250115000000-seed-email-templates.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Agency Registration Welcome",
            category: "AGENCY_REGISTRATION",
            subject:
                "🩸 Welcome to PCMC Pediatric Blood Center - Your Agency Registration is Received",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Blood Donation Management System</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Thank you for registering <strong>{{agency_name}}</strong> as a partner agency in our blood donation initiative. We are excited to welcome you to our network of organizations dedicated to saving lives through blood donation.
            </p>
        </div>

        <!-- Status Information -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">📋 Application Status: Under Review</h3>
            <p style="color: #92400e; margin: 0; line-height: 1.5;">
                Your application is currently being reviewed by our <strong>Mobile Blood Donation Team (MBDT)</strong>. 
                This process typically takes 2-3 business days. You will receive a confirmation email once your account is approved.
            </p>
        </div>

        <!-- Agency Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🏢 Your Agency Information</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Agency Name:</td>
                        <td style="padding: 8px 0; color: #374151;">{{agency_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Contact Person:</td>
                        <td style="padding: 8px 0; color: #374151;">{{user_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email Address:</td>
                        <td style="padding: 8px 0; color: #374151;">{{user_email}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Address:</td>
                        <td style="padding: 8px 0; color: #374151;">{{agency_address}}</td>
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
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 What Happens Next?</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Review Process:</strong> Our MBDT will review your application and verify the provided information.</li>
                    <li><strong>Account Approval:</strong> Once approved, your account will be activated and you'll have access to the portal.</li>
                    <li><strong>Training & Onboarding:</strong> We'll provide training materials and guidance for using the system.</li>
                    <li><strong>Event Creation:</strong> You'll be able to create and manage blood donation events.</li>
                </ol>
            </div>
        </div>

        <!-- Important Notes -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Notes:</h4>
            <ul style="color: #991b1b; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>You will not be able to log in or use the platform until your registration is approved.</li>
                <li>Please ensure all provided information is accurate and up-to-date.</li>
                <li>Keep this email for your records and future reference.</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about your registration or need assistance, please don't hesitate to contact us:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Email:</strong> {{support_email}}<br>
                    <strong>Phone:</strong> +63 2 8XXX XXXX<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #dc2626; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for partnering with us in our mission to save lives through blood donation.<br>
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

Thank you for registering {{agency_name}} as a partner agency in our blood donation initiative. We are excited to welcome you to our network of organizations dedicated to saving lives through blood donation.

APPLICATION STATUS: UNDER REVIEW
Your application is currently being reviewed by our Mobile Blood Donation Team (MBDT). This process typically takes 2-3 business days. You will receive a confirmation email once your account is approved.

YOUR AGENCY INFORMATION:
- Agency Name: {{agency_name}}
- Contact Person: {{user_name}}
- Email Address: {{user_email}}
- Address: {{agency_address}}
- Registration Date: {{registration_date}}

WHAT HAPPENS NEXT?
1. Review Process: Our MBDT will review your application and verify the provided information.
2. Account Approval: Once approved, your account will be activated and you'll have access to the portal.
3. Training & Onboarding: We'll provide training materials and guidance for using the system.
4. Event Creation: You'll be able to create and manage blood donation events.

IMPORTANT NOTES:
- You will not be able to log in or use the platform until your registration is approved.
- Please ensure all provided information is accurate and up-to-date.
- Keep this email for your records and future reference.

NEED HELP?
If you have any questions about your registration or need assistance, please contact us:
- Email: {{support_email}}
- Phone: +63 2 8XXX XXXX
- Portal: {{domain_url}}

Thank you for partnering with us in our mission to save lives through blood donation.

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
                "agency_address",
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
        {
            name: "Agency Approval Notification",
            category: "AGENCY_APPROVAL",
            subject:
                "🎉 Congratulations! Your Agency Registration Has Been Approved",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #059669; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🎉 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Agency Registration Approved</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Great news! Your agency registration for <strong>{{agency_name}}</strong> has been approved by our Mobile Blood Donation Team (MBDT). You are now officially a partner agency in our blood donation initiative.
            </p>
        </div>

        <!-- Approval Status -->
        <div style="background-color: #d1fae5; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">✅ Approval Status: Approved</h3>
            <p style="color: #065f46; margin: 0; line-height: 1.5;">
                Your account has been activated and you can now access the PCMC Pediatric Blood Center portal to create and manage blood donation events.
            </p>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🚀 Getting Started</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Access Your Portal:</strong> Visit {{domain_url}} and log in with your registered email.</li>
                    <li><strong>Complete Your Profile:</strong> Update your agency information and contact details.</li>
                    <li><strong>Create Events:</strong> Start creating blood donation events for your organization.</li>
                    <li><strong>Manage Donors:</strong> Coordinate with donors and track participation.</li>
                </ol>
            </div>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you need assistance with the portal or have any questions, please contact us:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Email:</strong> {{support_email}}<br>
                    <strong>Phone:</strong> +63 2 8XXX XXXX<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #dc2626; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Welcome to our community of life-saving partners!<br>
                <strong>PCMC Pediatric Blood Center</strong><br>
                <em>Together, we make a difference.</em>
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

Great news! Your agency registration for {{agency_name}} has been approved by our Mobile Blood Donation Team (MBDT). You are now officially a partner agency in our blood donation initiative.

APPROVAL STATUS: APPROVED
Your account has been activated and you can now access the PCMC Pediatric Blood Center portal to create and manage blood donation events.

GETTING STARTED:
1. Access Your Portal: Visit {{domain_url}} and log in with your registered email.
2. Complete Your Profile: Update your agency information and contact details.
3. Create Events: Start creating blood donation events for your organization.
4. Manage Donors: Coordinate with donors and track participation.

NEED HELP?
If you need assistance with the portal or have any questions, please contact us:
- Email: {{support_email}}
- Phone: +63 2 8XXX XXXX
- Portal: {{domain_url}}

Welcome to our community of life-saving partners!

PCMC Pediatric Blood Center
Together, we make a difference.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "user_name",
                "user_email",
                "agency_name",
                "approval_status",
                "approval_date",
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
            category: ["AGENCY_REGISTRATION", "AGENCY_APPROVAL"],
        },
        {}
    );
}
