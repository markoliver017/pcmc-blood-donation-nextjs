// npx sequelize-cli db:seed --seed 20250115000014-seed-event-donor-invitation-email-template.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Blood Donation Event Invitation",
            category: "EVENT_DONOR_INVITATION",
            subject:
                "🩸 You're Invited! New Blood Donation Event - {{event_name}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Blood Donation Event Invitation</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear Valued Donor,</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                You're invited to participate in a blood donation event that could help save lives! We would be honored to have you join us for this important community initiative.
            </p>
        </div>

        <!-- Event Details -->
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
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Time:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{event_time}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Agency:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{agency_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Location:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{event_location}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; vertical-align: top;">Organizer:</td>
                        <td style="padding: 12px 0; color: #0c4a6e;">{{event_organizer}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #dc2626; color: white; padding: 25px; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px;">🎯 Ready to Make a Difference?</h3>
                <p style="margin: 0 0 20px 0; line-height: 1.6;">
                    Your donation can save up to 3 lives. Every drop counts in our mission to ensure a stable blood supply for patients in need.
                </p>
                <a href="{{domain_url}}" style="display: inline-block; background-color: white; color: #dc2626; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                    📋 Register for Event
                </a>
            </div>
        </div>

        <!-- Why Donate -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">💝 Why Your Donation Matters</h3>
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <ul style="color: #92400e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Emergency Care:</strong> Blood is needed for surgeries, trauma care, and emergency procedures</li>
                    <li><strong>Cancer Treatment:</strong> Patients undergoing chemotherapy often need blood transfusions</li>
                    <li><strong>Childbirth:</strong> Mothers experiencing complications during delivery may require blood</li>
                    <li><strong>Chronic Conditions:</strong> Patients with blood disorders depend on regular transfusions</li>
                </ul>
                <div style="text-align: center; margin: 5px 0;">
                    <a href="{{domain_url}}/why-donate" style="display: inline-block; background-color: white; color: #dc2626; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        📋 Why Donate
                    </a>
                </div>
                
            </div>
        </div>

        <!-- Preparation Tips -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 Preparation Tips</h3>
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e;">
                <ul style="color: #166534; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Get plenty of sleep</strong> the night before your donation</li>
                    <li><strong>Eat a healthy meal</strong> within 3 hours before donating</li>
                    <li><strong>Stay hydrated</strong> - drink extra fluids 24 hours before</li>
                    <li><strong>Bring valid ID</strong> and your donor card if you have one</li>
                    <li><strong>Wear comfortable clothing</strong> with sleeves that can be rolled up</li>
                </ul>
                <div style="text-align: center; margin: 5px 0;">
                    <a href="{{domain_url}}/donation-process" style="display: inline-block; background-color: white; color: #dc2626; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        📋 Donation Process
                    </a>
                </div>
            </div>
        </div>

        <!-- Eligibility Reminder -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">⚠️ Eligibility Requirements:</h4>
            <ul style="color: #991b1b; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Age 18-65 years old</li>
                <li>Weight at least 50kg (110 lbs)</li>
                <li>In good general health</li>
                <li>No recent tattoos or piercings (within 12 months)</li>
                <li>No recent travel to malaria-endemic areas</li>
            </ul>
            <div style="text-align: center; margin: 5px 0;">
                <a href="{{domain_url}}/eligibility-requirements" style="display: inline-block; background-color: white; color: #dc2626; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                    📋 Eligibility Requirements
                </a>
            </div>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Questions?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about the event or blood donation, please contact us:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Email:</strong> {{support_email}}<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #dc2626; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
            <div style="text-align: center; margin: 5px 0;">
                <a href="{{domain_url}}/contact-us" style="display: inline-block; background-color: #f8fafc; color: #dc2626; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                    📋 Contact Us Page
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for your commitment to saving lives through blood donation.<br>
                <strong>{{system_name}}</strong><br>
                <em>Every donation counts. Every donor matters.</em>
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
            text_content: `Dear Valued Donor,

You're invited to participate in a blood donation event that could help save lives! We would be honored to have you join us for this important community initiative.

EVENT DETAILS:
- Event Name: {{event_name}}
- Date: {{event_date}}
- Time: {{event_time}}
- Agency: {{agency_name}}
- Location: {{event_location}}
- Organizer: {{event_organizer}}

READY TO MAKE A DIFFERENCE?
Your donation can save up to 3 lives. Every drop counts in our mission to ensure a stable blood supply for patients in need.

Register for the event at: {{domain_url}}/portal/donors/events

WHY YOUR DONATION MATTERS:
- Emergency Care: Blood is needed for surgeries, trauma care, and emergency procedures
- Cancer Treatment: Patients undergoing chemotherapy often need blood transfusions
- Childbirth: Mothers experiencing complications during delivery may require blood
- Chronic Conditions: Patients with blood disorders depend on regular transfusions

PREPARATION TIPS:
- Get plenty of sleep the night before your donation
- Eat a healthy meal within 3 hours before donating
- Stay hydrated - drink extra fluids 24 hours before
- Bring valid ID and your donor card if you have one
- Wear comfortable clothing with sleeves that can be rolled up

ELIGIBILITY REQUIREMENTS:
- Age 18-65 years old
- Weight at least 50kg (110 lbs)
- In good general health
- No recent tattoos or piercings (within 12 months)
- No recent travel to malaria-endemic areas

QUESTIONS?
If you have any questions about the event or blood donation, please contact us:
- Email: {{support_email}}
- Portal: {{domain_url}}

Thank you for your commitment to saving lives through blood donation.

{{system_name}}
Every donation counts. Every donor matters.

---
This is an automated message. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "event_name",
                "event_date",
                "event_time",
                "event_location",
                "event_organizer",
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
            category: "EVENT_DONOR_INVITATION",
        },
        {}
    );
}
