// npx sequelize-cli db:seed --seed 20250115000003-seed-agency-rejection-email-template.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Agency Rejection Notification",
            category: "AGENCY_REJECTION",
            subject: "Agency Application Rejected - {{agency_name}}",
            html_content: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agency Application Rejected</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #dc3545;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #dc3545;
            margin-bottom: 10px;
        }
        .title {
            color: #dc3545;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .agency-details {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .rejection-reason {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            background-color: #e9ecef;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .highlight {
            color: #dc3545;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🩸 PCMC Pediatric Blood Center</div>
            <div class="title">Agency Application Rejected</div>
        </div>

        <div class="content">
            <p>Dear <strong>{{user_name}}</strong>,</p>

            <p>We regret to inform you that your agency application has been <span class="highlight">rejected</span> after careful review by our administrative team.</p>

            <div class="agency-details">
                <h3>Agency Details:</h3>
                <p><strong>Agency Name:</strong> {{agency_name}}</p>
                <p><strong>Address:</strong> {{agency_address}}</p>
                <p><strong>Contact:</strong> {{agency_contact}}</p>
                <p><strong>Application Date:</strong> {{approval_date}}</p>
            </div>

            <div class="rejection-reason">
                <h3>Rejection Reason:</h3>
                <p>{{rejection_reason}}</p>
            </div>

            <div class="info-box">
                <h3>What This Means:</h3>
                <ul>
                    <li>Your agency will not be able to participate in blood donation activities</li>
                    <li>You may reapply after addressing the concerns mentioned above</li>
                    <li>Your account access has been restricted</li>
                </ul>
            </div>

            <p>If you believe this decision was made in error or if you have additional documentation to support your application, please contact our support team.</p>

            <div class="contact-info">
                <h3>Need Help?</h3>
                <p>For questions or to appeal this decision, please contact:</p>
                <p><strong>Email:</strong> {{support_email}}</p>
                <p><strong>System:</strong> {{system_name}}</p>
            </div>

            <p>Thank you for your interest in partnering with the PCMC Pediatric Blood Center.</p>

            <p>Best regards,<br>
            <strong>{{system_name}} Team</strong></p>
        </div>

        <div class="footer">
            <p>This is an automated message from {{system_name}}.</p>
            <p>Please do not reply to this email. For support, contact {{support_email}}</p>
        </div>
    </div>
</body>
</html>`,
            text_content: `
AGENCY APPLICATION REJECTED - {{agency_name}}

Dear {{user_name}},

We regret to inform you that your agency application has been REJECTED after careful review by our administrative team.

AGENCY DETAILS:
- Agency Name: {{agency_name}}
- Address: {{agency_address}}
- Contact: {{agency_contact}}
- Application Date: {{approval_date}}

REJECTION REASON:
{{rejection_reason}}

WHAT THIS MEANS:
- Your agency will not be able to participate in blood donation activities
- You may reapply after addressing the concerns mentioned above
- Your account access has been restricted

If you believe this decision was made in error or if you have additional documentation to support your application, please contact our support team.

NEED HELP?
For questions or to appeal this decision, please contact:
Email: {{support_email}}
System: {{system_name}}

Thank you for your interest in partnering with the PCMC Pediatric Blood Center.

Best regards,
{{system_name}} Team

---
This is an automated message from {{system_name}}.
Please do not reply to this email. For support, contact {{support_email}}
`,
            dynamic_fields: JSON.stringify([
                "agency_name",
                "user_name",
                "user_email",
                "user_first_name",
                "user_last_name",
                "agency_address",
                "agency_contact",
                "approval_status",
                "approval_date",
                "approval_reason",
                "rejection_reason",
                "system_name",
                "support_email",
                "domain_url",
                "rejected_by"
            ]),
            is_active: true,
            created_by: null,
            updated_by: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    await queryInterface.bulkInsert("email_templates", emailTemplates, {});
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete(
        "email_templates",
        {
            category: "AGENCY_REJECTION"
        },
        {}
    );
} 