// npx sequelize-cli db:seed --seed 20250115000004-seed-coordinator-approval-email-templates.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Coordinator Approval Notification",
            category: "AGENCY_COORDINATOR_APPROVAL",
            subject:
                "🎉 Congratulations! Your Coordinator Registration Has Been Approved by {{agency_name}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #059669; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🎉 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Coordinator Registration Approved</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Great news! Your coordinator registration has been approved by <strong>{{agency_name}}</strong>. You are now officially a coordinator and can start helping organize blood donation events for your agency.
            </p>
        </div>

        <!-- Approval Status -->
        <div style="background-color: #d1fae5; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">✅ Account Status: Approved by {{agency_name}}</h3>
            <p style="color: #065f46; margin: 0; line-height: 1.5;">
                Your coordinator account has been successfully activated by your partner agency. You can now log in to the portal and start managing blood donation events.
            </p>
        </div>

        <!-- Coordinator Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">👤 Your Approved Coordinator Information</h3>
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
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Approval Date:</td>
                        <td style="padding: 8px 0; color: #374151;">{{approval_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- What You Can Do Now -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🚀 What You Can Do Now</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Create Events:</strong> Organize blood donation events for your agency</li>
                    <li><strong>Manage Donors:</strong> Handle donor registrations and appointments</li>
                    <li><strong>Track Progress:</strong> Monitor event participation and donation statistics</li>
                    <li><strong>Communicate:</strong> Liaise between donors, agencies, and PCMC</li>
                </ul>
            </div>
        </div>

        <!-- Coordinator Responsibilities -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🎯 Your Role as Coordinator</h3>
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #f59e0b;">
                <p style="color: #92400e; line-height: 1.6; margin-bottom: 15px;">
                    As a coordinator, you will be responsible for:
                </p>
                <ul style="color: #92400e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Event Planning:</strong> Schedule and organize blood donation events</li>
                    <li><strong>Donor Management:</strong> Assist donors with registration and appointments</li>
                    <li><strong>Communication:</strong> Keep all parties informed about event details</li>
                    <li><strong>Quality Assurance:</strong> Ensure smooth event operations and donor satisfaction</li>
                    <li><strong>Documentation:</strong> Maintain accurate records and reports</li>
                </ul>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🎯 Ready to Start Coordinating?</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Log In:</strong> Access your coordinator portal using your registered credentials</li>
                    <li><strong>Review Dashboard:</strong> Familiarize yourself with the coordinator interface</li>
                    <li><strong>Create Your First Event:</strong> Start planning a blood donation event</li>
                    <li><strong>Set Up Communication:</strong> Prepare event announcements and donor communications</li>
                    <li><strong>Begin Coordination:</strong> Start managing your first blood donation event!</li>
                </ol>
            </div>
        </div>

        <!-- Important Notes -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Notes:</h4>
            <ul style="color: #991b1b; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Your access is limited to events and activities for {{agency_name}} only</li>
                <li>Please ensure all event information is accurate and up-to-date</li>
                <li>Maintain professional communication with donors and agency staff</li>
                <li>Follow PCMC guidelines for blood donation events</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about your coordinator role or need assistance, please contact:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Your Agency:</strong> {{agency_name}}<br>
                    <strong>PCMC Support:</strong> {{support_email}}<br>
                    <strong>Phone:</strong> {{support_contact}}<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #059669; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Welcome to our team of dedicated coordinators!<br>
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

Great news! Your coordinator registration has been approved by {{agency_name}}. You are now officially a coordinator and can start helping organize blood donation events for your agency.

ACCOUNT STATUS: APPROVED BY {{agency_name}}
Your coordinator account has been successfully activated by your partner agency. You can now log in to the portal and start managing blood donation events.

YOUR APPROVED COORDINATOR INFORMATION:
- Agency Name: {{agency_name}}
- Coordinator Name: {{user_name}}
- Email Address: {{user_email}}
- Contact Number: +63 {{contact_number}}
- Approval Date: {{approval_date}}

WHAT YOU CAN DO NOW:
- Create Events: Organize blood donation events for your agency
- Manage Donors: Handle donor registrations and appointments
- Track Progress: Monitor event participation and donation statistics
- Communicate: Liaise between donors, agencies, and PCMC
- Generate Reports: Create reports on event outcomes and donor data

YOUR ROLE AS COORDINATOR:
As a coordinator, you will be responsible for:
- Event Planning: Schedule and organize blood donation events
- Donor Management: Assist donors with registration and appointments
- Communication: Keep all parties informed about event details
- Quality Assurance: Ensure smooth event operations and donor satisfaction
- Documentation: Maintain accurate records and reports

READY TO START COORDINATING?
1. Log In: Access your coordinator portal using your registered credentials
2. Review Dashboard: Familiarize yourself with the coordinator interface
3. Create Your First Event: Start planning a blood donation event
4. Set Up Communication: Prepare event announcements and donor communications
5. Begin Coordination: Start managing your first blood donation event!

IMPORTANT NOTES:
- Your access is limited to events and activities for {{agency_name}} only
- Please ensure all event information is accurate and up-to-date
- Maintain professional communication with donors and agency staff
- Follow PCMC guidelines for blood donation events

NEED HELP?
If you have any questions about your coordinator role or need assistance, please contact:
- Your Agency: {{agency_name}}
- PCMC Support: {{support_email}}
- Phone: {{support_contact}}
- Portal: {{domain_url}}

Welcome to our team of dedicated coordinators!

PCMC Pediatric Blood Center
Empowering communities, one donation at a time.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "agency_name",
                "user_name",
                "user_email",
                "user_first_name",
                "user_last_name",
                "contact_number",
                "approval_date",
                "system_name",
                "support_email",
                "domain_url",
                "support_contact",
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
            category: "AGENCY_COORDINATOR_APPROVAL",
        },
        {}
    );
}
