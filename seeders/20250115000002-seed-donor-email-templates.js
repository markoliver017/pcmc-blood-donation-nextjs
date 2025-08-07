// npx sequelize-cli db:seed --seed 20250115000002-seed-donor-email-templates.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Donor Registration Welcome",
            category: "DONOR_REGISTRATION",
            subject:
                "🩸 Welcome to PCMC Pediatric Blood Center - Your Donor Registration is Received",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🩸 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Blood Donor Registration</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Thank you for registering as a <strong>Blood Donor</strong> with PCMC Pediatric Blood Center. We are excited to welcome you to our community of life-saving donors who make a difference in children's lives through blood donation.
            </p>
        </div>

        <!-- Status Information -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">📋 Application Status: Under Review</h3>
            <p style="color: #92400e; margin: 0; line-height: 1.5;">
                Your donor application is currently being reviewed by <strong>{{agency_name}}</strong>. 
                This process typically takes 1-2 business days. You will receive a confirmation email once your account is approved by your partner agency.
            </p>
        </div>

        <!-- Donor Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">👤 Your Donor Information</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Full Name:</td>
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
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Blood Type:</td>
                        <td style="padding: 8px 0; color: #374151;">{{blood_type}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Partner Agency:</td>
                        <td style="padding: 8px 0; color: #374151;">{{agency_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Registration Date:</td>
                        <td style="padding: 8px 0; color: #374151;">{{registration_date}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Donor Role Description -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🎯 Your Role as a Blood Donor</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <p style="color: #0c4a6e; line-height: 1.6; margin-bottom: 15px;">
                    As a blood donor, you will be able to:
                </p>
                <ul style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Browse Events:</strong> View available blood donation events in your agency</li>
                    <li><strong>Book Appointments:</strong> Schedule donation appointments at your convenience</li>
                    <li><strong>Track History:</strong> Monitor your donation history and eligibility status</li>
                    <li><strong>Receive Updates:</strong> Get notifications about upcoming events and reminders</li>
                </ul>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 What Happens Next?</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Review Process:</strong> {{agency_name}} will review your application and verify your information.</li>
                    <li><strong>Account Approval:</strong> Once approved by your partner agency, your account will be activated.</li>
                    <li><strong>Event Access:</strong> You'll be able to browse and book appointments for blood donation events.</li>
                    <li><strong>First Donation:</strong> Schedule your first donation appointment and start saving lives!</li>
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
                <li>You must be at least 18 years old and meet health requirements to donate blood.</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about your registration or need assistance, please contact us:
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

Thank you for registering as a Blood Donor with PCMC Pediatric Blood Center. We are excited to welcome you to our community of life-saving donors who make a difference in children's lives through blood donation.

APPLICATION STATUS: UNDER REVIEW
Your donor application is currently being reviewed by {{agency_name}}. This process typically takes 1-2 business days. You will receive a confirmation email once your account is approved by your partner agency.

YOUR DONOR INFORMATION:
- Full Name: {{user_name}}
- Email Address: {{user_email}}
- Contact Number: +63 {{contact_number}}
- Blood Type: {{blood_type}}
- Partner Agency: {{agency_name}}
- Registration Date: {{registration_date}}

YOUR ROLE AS A BLOOD DONOR:
As a blood donor, you will be able to:
- Browse Events: View available blood donation events in your area
- Book Appointments: Schedule donation appointments at your convenience
- Track History: Monitor your donation history and eligibility status
- Receive Updates: Get notifications about upcoming events and reminders

WHAT HAPPENS NEXT?
1. Review Process: {{agency_name}} will review your application and verify your information.
2. Account Approval: Once approved by your partner agency, your account will be activated.
3. Event Access: You'll be able to browse and book appointments for blood donation events.
4. First Donation: Schedule your first donation appointment and start saving lives!

IMPORTANT NOTES:
- You will not be able to log in or use the platform until your registration is approved.
- Please ensure all provided information is accurate and up-to-date.
- Keep this email for your records and future reference.
- You must be at least 18 years old and meet health requirements to donate blood.

NEED HELP?
If you have any questions about your registration or need assistance, please contact us:
- Email: {{support_email}}
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
                "contact_number",
                "blood_type",
                "agency_name",
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
        {
            name: "Donor Approval Notification",
            category: "DONOR_APPROVAL",
            subject:
                "🎉 Congratulations! Your Donor Registration Has Been Approved by {{agency_name}}",
            html_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #059669; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🎉 PCMC Pediatric Blood Center</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Donor Registration Approved</p>
            </div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Dear {{user_name}},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                Great news! Your donor registration has been approved by <strong>{{agency_name}}</strong>. You are now officially a registered blood donor and can start making a difference in children's lives through blood donation.
            </p>
        </div>

        <!-- Approval Status -->
        <div style="background-color: #d1fae5; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">✅ Account Status: Approved by {{agency_name}}</h3>
            <p style="color: #065f46; margin: 0; line-height: 1.5;">
                Your donor account has been successfully activated by your partner agency. You can now log in to the portal and start browsing blood donation events.
            </p>
        </div>

        <!-- Donor Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">👤 Your Approved Donor Information</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Full Name:</td>
                        <td style="padding: 8px 0; color: #374151;">{{user_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email Address:</td>
                        <td style="padding: 8px 0; color: #374151;">{{user_email}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Contact Number:</td>
                        <td style="padding: 8px 0; color: #374151;">+63{{contact_number}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Blood Type:</td>
                        <td style="padding: 8px 0; color: #374151;">{{blood_type}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Partner Agency:</td>
                        <td style="padding: 8px 0; color: #374151;">{{agency_name}}</td>
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
                    <li><strong>Browse Events:</strong> View all available blood donation events in your area</li>
                    <li><strong>Book Appointments:</strong> Schedule donation appointments at your preferred time and location</li>
                    <li><strong>Update Profile:</strong> Keep your contact information and health details up-to-date</li>
                    <li><strong>Track Donations:</strong> Monitor your donation history and eligibility status</li>
                    <li><strong>Receive Notifications:</strong> Get updates about upcoming events and donation reminders</li>
                </ul>
            </div>
        </div>

        <!-- Donation Guidelines -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📋 Important Donation Guidelines</h3>
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #f59e0b;">
                <ul style="color: #92400e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Age Requirement:</strong> You must be at least 18 years old to donate blood</li>
                    <li><strong>Health Check:</strong> You'll undergo a health screening before each donation</li>
                    <li><strong>Donation Interval:</strong> Wait at least 56 days between whole blood donations</li>
                    <li><strong>Pre-donation:</strong> Get adequate sleep, eat a healthy meal, and stay hydrated</li>
                    <li><strong>Post-donation:</strong> Rest for 10-15 minutes and avoid strenuous activity for 24 hours</li>
                </ul>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">🎯 Ready to Start Donating?</h3>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Log In:</strong> Access your donor portal using your registered credentials</li>
                    <li><strong>Browse Events:</strong> Find blood donation events near you</li>
                    <li><strong>Book Appointment:</strong> Schedule your first donation appointment</li>
                    <li><strong>Prepare:</strong> Follow the pre-donation guidelines for a successful donation</li>
                    <li><strong>Donate:</strong> Make your first life-saving blood donation!</li>
                </ol>
            </div>
        </div>

        <!-- Contact Information -->
        <div style="margin: 25px 0; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">📞 Need Help?</h3>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                If you have any questions about donating blood or need assistance, please contact us:
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 5px 0; color: #374151;">
                    <strong>Email:</strong> {{support_email}}<br>
                    <strong>Phone:</strong> {{support_contact}}<br>
                    <strong>Portal:</strong> <a href="{{domain_url}}" style="color: #059669; text-decoration: none;">{{domain_url}}</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Welcome to our community of life-saving donors!<br>
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

Great news! Your donor registration has been approved by {{agency_name}}. You are now officially a registered blood donor and can start making a difference in children's lives through blood donation.

ACCOUNT STATUS: APPROVED BY {{agency_name}}
Your donor account has been successfully activated by your partner agency. You can now log in to the portal and start browsing blood donation events.

YOUR APPROVED DONOR INFORMATION:
- Full Name: {{user_name}}
- Email Address: {{user_email}}
- Contact Number: +63 {{contact_number}}
- Blood Type: {{blood_type}}
- Partner Agency: {{agency_name}}
- Approval Date: {{approval_date}}

WHAT YOU CAN DO NOW:
- Browse Events: View all available blood donation events in your area
- Book Appointments: Schedule donation appointments at your preferred time and location
- Update Profile: Keep your contact information and health details up-to-date
- Track Donations: Monitor your donation history and eligibility status
- Receive Notifications: Get updates about upcoming events and donation reminders

IMPORTANT DONATION GUIDELINES:
- Age Requirement: You must be at least 18 years old to donate blood
- Health Check: You'll undergo a health screening before each donation
- Donation Interval: Wait at least 56 days between whole blood donations
- Pre-donation: Get adequate sleep, eat a healthy meal, and stay hydrated
- Post-donation: Rest for 10-15 minutes and avoid strenuous activity for 24 hours

READY TO START DONATING?
1. Log In: Access your donor portal using your registered credentials
2. Browse Events: Find blood donation events near you
3. Book Appointment: Schedule your first donation appointment
4. Prepare: Follow the pre-donation guidelines for a successful donation
5. Donate: Make your first life-saving blood donation!

NEED HELP?
If you have any questions about donating blood or need assistance, please contact us:
- Email: {{support_email}}
- Phone: {{support_contact}}
- Portal: {{domain_url}}

Welcome to our community of life-saving donors!

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
                "contact_number",
                "blood_type",
                "agency_name",
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
            category: ["DONOR_REGISTRATION", "DONOR_APPROVAL"],
        },
        {}
    );
}
