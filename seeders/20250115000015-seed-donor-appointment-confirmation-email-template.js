"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Appointment Confirmation",
            category: "DONOR_APPOINTMENT_CONFIRMATION",
            subject: "✅ Appointment Confirmed - {{event_title}}",
            html_content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #16a34a; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">✅ Appointment Confirmed</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">{{system_name}}</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{donor_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Thank you for booking your blood donation appointment. Below are your confirmed details:
            </p>
        </div>

        <!-- Appointment Details -->
        <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0c4a6e; margin: 0 0 20px 0; font-size: 20px; text-align: center;">📅 Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; width: 140px;">Reference #:</td>
                    <td style="padding: 12px 0; color: #0c4a6e;">{{appointment_reference}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Date:</td>
                    <td style="padding: 12px 0; color: #0c4a6e;">{{appointment_date}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Time:</td>
                    <td style="padding: 12px 0; color: #0c4a6e;">{{appointment_time}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Agency:</td>
                    <td style="padding: 12px 0; color: #0c4a6e;">{{agency_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Location:</td>
                    <td style="padding: 12px 0; color: #0c4a6e;">{{agency_address}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Event Name:</td>
                    <td style="padding: 12px 0; color: #0c4a6e;">{{event_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e;">Event Description:</td>
                    <td style="padding: 12px 0; color: #0c4a6e;">{{event_description}}</td>
                </tr>
            </table>
        </div>

        <!-- QR Code -->
        <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 15px;">
                Please present the QR code below upon arrival:
            </p>
            <img src="{{appointment_qr_code}}" alt="Appointment QR Code" style="width: 200px; height: 200px;"/>
        </div>

        <!-- Preparation Tips -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 Preparation Tips</h3>
            <ul style="color: #166534; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Get plenty of rest the night before</li>
                <li>Eat a healthy meal before donating</li>
                <li>Drink extra fluids 24 hours before</li>
                <li>Bring valid ID</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <p style="color: #374151; line-height: 1.6;">
                If you have questions, contact us at:
                <br><strong>Email:</strong> {{support_email}}
                <br><strong>Portal:</strong> <a href="{{domain_url}}" style="color: #16a34a; text-decoration: none;">{{domain_url}}</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for your commitment to saving lives.<br>
                <strong>{{system_name}}</strong>
            </p>
        </div>
    </div>
</div>`,
            text_content: `Dear {{donor_name}},

Your appointment has been confirmed.

Reference #: {{appointment_reference}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{appointment_location}}

Please bring your QR code: {{appointment_qr_code}}

Thank you,
{{system_name}}

---
For questions, contact {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "donor_name",
                "appointment_reference",
                "appointment_date",
                "appointment_time",
                "agency_name",
                "agency_address",
                "event_name",
                "event_description",
                "appointment_qr_code",
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
        { category: "APPOINTMENT_CONFIRMATION" },
        {}
    );
}
