// npx sequelize-cli db:seed --seed 20250115000003-seed-mbdt-email-templates.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "MBDT Agency Registration Notification",
            category: "MBDT_NOTIFICATION",
            subject:
                "📋 New Agency Registration Requires Review - {{agency_name}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">📋 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Mobile Blood Donation Team (MBDT)</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear MBDT Team,</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                A new agency registration has been submitted and requires your review. Please review the application details below and take appropriate action.
            </p>
        </div>

        <!-- Action Required -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">⚠️ Action Required: Agency Review</h3>
            <p style="color: #92400e; margin: 0; line-height: 1.5;">
                A new partner agency has registered and is awaiting your review and approval. Please log in to the admin portal to review the application.
            </p>
        </div>

        <!-- Agency Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🏢 Agency Information</h3>
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
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Contact Number:</td>
                        <td style="padding: 8px 0; color: #374151;">+63 {{agency_contact}}</td>
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

        <!-- Review Process -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 Review Process</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Verify Information:</strong> Review all provided agency details for accuracy</li>
                    <li><strong>Check Requirements:</strong> Ensure all required documents and information are complete</li>
                    <li><strong>Background Check:</strong> Conduct necessary background verification</li>
                    <li><strong>Make Decision:</strong> Approve or reject the application with appropriate comments</li>
                    <li><strong>Notify Agency:</strong> Send approval or rejection notification to the agency</li>
                </ol>
            </div>
        </div>

        <!-- Quick Actions -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">⚡ Quick Actions</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 15px;">
                    You can take the following actions directly from the admin portal:
                </p>
                <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>View Full Application:</strong> Access complete agency registration details</li>
                    <li><strong>Approve Agency:</strong> Grant approval and activate the agency account</li>
                    <li><strong>Request Additional Info:</strong> Ask for more information if needed</li>
                    <li><strong>Reject Application:</strong> Reject with detailed reason if requirements not met</li>
                </ul>
            </div>
        </div>

        <!-- Important Notes -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Notes:</h4>
            <ul style="color: #991b1b; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Please review applications within 2-3 business days to maintain service quality</li>
                <li>Ensure all verification steps are completed before approval</li>
                <li>Provide clear feedback if additional information is required</li>
                <li>Document all decisions and reasons in the system</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Assistance?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you need help with the review process or have questions, please contact:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Admin Portal:</strong> <a href="{{domain_url}}" style="color: #1e40af; text-decoration: none;">{{domain_url}}</a><br>
                    <strong>Support Email:</strong> {{support_email}}<br>
                    <strong>Phone:</strong> {{support_contact}}
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for your dedication to maintaining quality partnerships.<br>
                <strong>PCMC Pediatric Blood Center</strong><br>
                <em>Mobile Blood Donation Team</em>
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
            text_content: `Dear MBDT Team,

A new agency registration has been submitted and requires your review. Please review the application details below and take appropriate action.

ACTION REQUIRED: AGENCY REVIEW
A new partner agency has registered and is awaiting your review and approval. Please log in to the admin portal to review the application.

AGENCY INFORMATION:
- Agency Name: {{agency_name}}
- Contact Person: {{user_name}}
- Email Address: {{user_email}}
- Contact Number: +63 {{agency_contact}}
- Address: {{agency_address}}
- Registration Date: {{registration_date}}

REVIEW PROCESS:
1. Verify Information: Review all provided agency details for accuracy
2. Check Requirements: Ensure all required documents and information are complete
3. Background Check: Conduct necessary background verification
4. Make Decision: Approve or reject the application with appropriate comments
5. Notify Agency: Send approval or rejection notification to the agency

QUICK ACTIONS:
You can take the following actions directly from the admin portal:
- View Full Application: Access complete agency registration details
- Approve Agency: Grant approval and activate the agency account
- Request Additional Info: Ask for more information if needed
- Reject Application: Reject with detailed reason if requirements not met

IMPORTANT NOTES:
- Please review applications within 2-3 business days to maintain service quality
- Ensure all verification steps are completed before approval
- Provide clear feedback if additional information is required
- Document all decisions and reasons in the system

NEED ASSISTANCE?
If you need help with the review process or have questions, please contact:
- Admin Portal: {{domain_url}}
- Support Email: {{support_email}}
- Phone: {{support_contact}}

Thank you for your dedication to maintaining quality partnerships.

PCMC Pediatric Blood Center
Mobile Blood Donation Team

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "agency_name",
                "user_name",
                "user_email",
                "user_first_name",
                "user_last_name",
                "agency_address",
                "agency_contact",
                "registration_date",
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
            category: "MBDT_NOTIFICATION",
        },
        {}
    );
}
