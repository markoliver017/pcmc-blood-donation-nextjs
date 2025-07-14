// npx sequelize-cli db:seed --seed 20250115000015-seed-blood-request-approval-email-template.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Blood Request Status Update",
            category: "BLOOD_REQUEST_APPROVAL",
            subject: "🩸 Blood Request Status Update - {{blood_request_id}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Blood Request Status Update</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Your blood request has been reviewed and the status has been updated. Please find the details below.
            </p>
        </div>

        <!-- Status Update -->
        <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0c4a6e; margin: 0 0 20px 0; font-size: 20px; text-align: center;">📋 Request Status Update</h3>
            <div style="background-color: white; padding: 20px; border-radius: 6px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; width: 140px; vertical-align: top;">Request ID:</td>
                        <td style="padding: 12px 0; color: #0c4a6e; font-weight: 600;">{{blood_request_id}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Status:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{request_status}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Update Date:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{status_update_date}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Remarks:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{status_remarks}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Request Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🏥 Blood Request Details</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 140px;">Blood Component:</td>
                        <td style="padding: 8px 0; color: #374151;">{{blood_component}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Blood Type:</td>
                        <td style="padding: 8px 0; color: #374151;">{{blood_type}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Units Required:</td>
                        <td style="padding: 8px 0; color: #374151;">{{no_of_units}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Patient Name:</td>
                        <td style="padding: 8px 0; color: #374151;">{{patient_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Patient Gender:</td>
                        <td style="padding: 8px 0; color: #374151;">{{patient_gender}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Date of Birth:</td>
                        <td style="padding: 8px 0; color: #374151;">{{patient_date_of_birth}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Diagnosis:</td>
                        <td style="padding: 8px 0; color: #374151;">{{diagnosis}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Hospital:</td>
                        <td style="padding: 8px 0; color: #374151;">{{hospital_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Request Date:</td>
                        <td style="padding: 8px 0; color: #374151;">{{request_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Status-Specific Information -->
        <div style="margin: 25px 0;">
            <div style="{{status_style}} padding: 20px; border-radius: 8px;">
                <p style="font-size: 16px; margin: 0;">{{status_message}}</p>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 Next Steps</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Monitor Status:</strong> Check your request status regularly through the portal</li>
                    <li><strong>Contact Hospital:</strong> Coordinate with the hospital for blood unit pickup</li>
                    <li><strong>Follow Up:</strong> If you have questions, contact our support team</li>
                    <li><strong>Documentation:</strong> Keep this notification for your records</li>
                </ul>
            </div>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about your blood request or need assistance, please contact us:
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
                Thank you for using our blood request system.<br>
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
            text_content: `Dear {{user_name}},

Your blood request has been reviewed and the status has been updated. Please find the details below.

REQUEST STATUS UPDATE:
- Request ID: {{blood_request_id}}
- Status: {{request_status}}
- Update Date: {{status_update_date}}
- Remarks: {{status_remarks}}

BLOOD REQUEST DETAILS:
- Blood Component: {{blood_component}}
- Blood Type: {{blood_type}}
- Units Required: {{no_of_units}}
- Patient Name: {{patient_name}}
- Patient Gender: {{patient_gender}}
- Date of Birth: {{patient_date_of_birth}}
- Diagnosis: {{diagnosis}}
- Hospital: {{hospital_name}}
- Request Date: {{request_date}}

STATUS INFORMATION:
{{#if_eq request_status "fulfilled"}}
✅ REQUEST FULFILLED
Your blood request has been successfully fulfilled. The blood units have been allocated and are ready for use.
{{/if_eq}}

{{#if_eq request_status "expired"}}
⏰ REQUEST EXPIRED
Your blood request has expired. If you still need blood units, please submit a new request.
{{/if_eq}}

{{#if_eq request_status "cancelled"}}
❌ REQUEST CANCELLED
Your blood request has been cancelled. If you need to submit a new request, please contact us.
{{/if_eq}}

{{#if_eq request_status "pending"}}
⏳ REQUEST PENDING
Your blood request is currently being reviewed. We will notify you once the status changes.
{{/if_eq}}

NEXT STEPS:
- Monitor Status: Check your request status regularly through the portal
- Contact Hospital: Coordinate with the hospital for blood unit pickup
- Follow Up: If you have questions, contact our support team
- Documentation: Keep this notification for your records

NEED HELP?
If you have any questions about your blood request or need assistance, please contact us:
- Email: {{support_email}}
- Portal: {{domain_url}}

Thank you for using our blood request system.

{{system_name}}
Supporting healthcare through efficient blood management.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "user_name",
                "user_email",
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
                "request_status",
                "status_update_date",
                "status_remarks",
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
            category: "BLOOD_REQUEST_APPROVAL",
        },
        {}
    );
}
