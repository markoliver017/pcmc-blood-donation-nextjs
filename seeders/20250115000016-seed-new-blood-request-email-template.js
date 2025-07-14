// npx sequelize-cli db:seed --seed 20250115000016-seed-new-blood-request-email-template.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "New Blood Request Submitted",
            category: "NEW_BLOOD_REQUEST",
            subject: "🩸 New Blood Request Submitted - {{blood_request_id}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">New Blood Request Submitted</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear Admin,</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                A new blood request has been submitted by <strong>{{requested_by}}</strong>. Please review the details below and take the necessary action.
            </p>
        </div>

        <!-- Request Details -->
        <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0c4a6e; margin: 0 0 20px 0; font-size: 20px; text-align: center;">📋 Blood Request Details</h3>
            <div style="background-color: white; padding: 20px; border-radius: 6px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; width: 140px; vertical-align: top;">Request ID:</td>
                        <td style="padding: 12px 0; color: #0c4a6e; font-weight: 600;">{{blood_request_id}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Requested By:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{requested_by}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Blood Component:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{blood_component}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Blood Type:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{blood_type}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Units Required:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{no_of_units}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Patient Name:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{patient_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Patient Gender:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{patient_gender}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Date of Birth:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{patient_date_of_birth}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Diagnosis:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{diagnosis}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Hospital:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{hospital_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Request Date:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{request_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 Next Steps</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Review Request:</strong> Log in to the admin portal to review and process the new blood request.</li>
                    <li><strong>Contact Requestor:</strong> If you need more information, contact the requestor directly.</li>
                    <li><strong>Documentation:</strong> Keep this notification for your records.</li>
                </ul>
            </div>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about this blood request or need assistance, please contact us:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Email:</strong> {{support_email}}<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #dc2626; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for your attention to this urgent request.<br>
                <strong>{{system_name}}</strong><br>
                <em>Supporting healthcare through efficient blood management.</em>
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
            text_content: `Dear Admin,

A new blood request has been submitted by {{requested_by}}. Please review the details below and take the necessary action.

BLOOD REQUEST DETAILS:
- Request ID: {{blood_request_id}}
- Requested By: {{requested_by}}
- Blood Component: {{blood_component}}
- Blood Type: {{blood_type}}
- Units Required: {{no_of_units}}
- Patient Name: {{patient_name}}
- Patient Gender: {{patient_gender}}
- Date of Birth: {{patient_date_of_birth}}
- Diagnosis: {{diagnosis}}
- Hospital: {{hospital_name}}
- Request Date: {{request_date}}

NEXT STEPS:
- Review Request: Log in to the admin portal to review and process the new blood request.
- Contact Requestor: If you need more information, contact the requestor directly.
- Documentation: Keep this notification for your records.

NEED HELP?
If you have any questions about this blood request or need assistance, please contact us:
- Email: {{support_email}}
- Portal: {{domain_url}}

Thank you for your attention to this urgent request.

{{system_name}}
Supporting healthcare through efficient blood management.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "blood_request_id",
                "blood_component",
                "patient_name",
                "patient_gender",
                "patient_date_of_birth",
                "blood_type",
                "no_of_units",
                "diagnosis",
                "hospital_name",
                "request_date",
                "requested_by",
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
            category: "NEW_BLOOD_REQUEST",
        },
        {}
    );
}
