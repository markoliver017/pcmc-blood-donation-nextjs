// npx sequelize-cli db:seed --seed 20250115000017-seed-event-creation-email-template.js
// updated: 2025-07-23
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const emailTemplates = [
    {
      name: "New Blood Donation Event Created",
      category: "EVENT_CREATION",
      subject: "🩸 New Blood Donation Event: {{event_name}}",
      html_content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
      <p style="margin: 5px 0 0 0; font-size: 16px;">New Blood Donation Event Created</p>
    </div>
    <div style="margin-bottom: 25px;">
      <h2 style="color: #1f2937; margin-bottom: 15px;">Dear Admin,</h2>
      <p style="color: #374151; line-height: 1.6; font-size: 16px;">
        A new blood donation event has been created and is pending your review and approval. Please see the event details below:
      </p>
    </div>
    <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 25px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #0c4a6e; margin: 0 0 20px 0; font-size: 20px; text-align: center;">📅 Event Details</h3>
      <div style="background-color: white; padding: 20px; border-radius: 6px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; width: 140px; vertical-align: top;">Event Name:</td>
            <td style="padding: 12px 0; color: #0c4a6e; font-weight: 600;">{{event_name}}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Date:</td>
            <td style="padding: 12px 0; color: #0c4a6e;">{{event_date}}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Location:</td>
            <td style="padding: 12px 0; color: #0c4a6e;">{{event_location}}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Agency:</td>
            <td style="padding: 12px 0; color: #0c4a6e;">{{agency_name}}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Organizer:</td>
            <td style="padding: 12px 0; color: #0c4a6e;">{{event_organizer}}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Description:</td>
            <td style="padding: 12px 0; color: #0c4a6e;">{{event_description}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div style="margin: 25px 0;">
      <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📝 Next Steps</h3>
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
        <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li><strong>Review Event:</strong> Log in to the admin portal to review and approve or reject the event.</li>
          <li><strong>Contact Organizer:</strong> If you need more information, contact the event organizer directly.</li>
          <li><strong>Documentation:</strong> Keep this notification for your records.</li>
        </ul>
      </div>
    </div>
    <div style="margin: 25px 0; text-align: center;">
      <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Questions?</h3>
      <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
        If you have any questions about the event or need assistance, please contact us:
      </p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
        <p style="margin: 5px 0; color: #374151;">
          <strong>Email:</strong> {{support_email}}<br>
          <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #dc2626; text-decoration: none;">{{domain_url}}</a>
        </p>
      </div>
    </div>
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        Thank you for your commitment to saving lives through blood donation.<br>
        <strong>{{system_name}}</strong><br>
        <em>Every donation counts. Every event matters.</em>
      </p>
    </div>
  </div>
  <div style="text-align: center; margin-top: 20px;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      This is an automated message. Please do not reply to this email.<br>
      For support, contact us at {{support_email}}
    </p>
  </div>
</div>
`,
      text_content: `Dear Admin,

A new blood donation event has been created and is pending your review and approval. Please see the event details below:

EVENT DETAILS:
- Event Name: {{event_name}}
- Date: {{event_date}}
- Location: {{event_location}}
- Agency: {{agency_name}}
- Organizer: {{event_organizer}}
- Description: {{event_description}}

NEXT STEPS:
- Review Event: Log in to the admin portal to review and approve or reject the event.
- Contact Organizer: If you need more information, contact the event organizer directly.
- Documentation: Keep this notification for your records.

QUESTIONS?
If you have any questions about the event or need assistance, please contact us:
- Email: {{support_email}}
- Portal: {{domain_url}}

Thank you for your commitment to saving lives through blood donation.

{{system_name}}
Every donation counts. Every event matters.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
      dynamic_fields: JSON.stringify([
        "event_name",
        "event_title",
        "event_date",
        "event_location",
        "agency_name",
        "event_organizer",
        "event_description",
        "system_name",
        "support_email",
        "domain_url"
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
      category: "EVENT_CREATION",
    },
    {}
  );
} 