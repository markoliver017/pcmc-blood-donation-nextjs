// npx sequelize-cli db:seed --seed 20250115000003-seed-donor-rejection-email-template.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const emailTemplates = [
        {
            name: "Donor Rejection Notification",
            category: "DONOR_REJECTION",
            subject: "Donor Application Status Update - {{system_name}}",
            html_content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donor Application Status</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: "🩸";
            font-size: 48px;
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0.3;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        .status-badge {
            display: inline-block;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .info-section {
            background-color: #f8fafc;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border-left: 5px solid #dc2626;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .info-section h3 {
            color: #1f2937;
            margin: 0 0 15px 0;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-section ul {
            margin: 0;
            padding-left: 20px;
        }
        .info-section li {
            margin: 8px 0;
            color: #374151;
        }
        .rejection-reason {
            background-color: #fef2f2;
            border-left: 5px solid #dc2626;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .rejection-reason h3 {
            color: #dc2626;
            margin: 0 0 10px 0;
            font-size: 18px;
        }
        .rejection-reason p {
            color: #7f1d1d;
            margin: 0;
            font-weight: 500;
        }
        .contact-info {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border: 1px solid #d1d5db;
        }
        .contact-info h3 {
            color: #1f2937;
            margin: 0 0 15px 0;
            font-size: 18px;
        }
        .contact-info ul {
            margin: 0;
            padding-left: 20px;
        }
        .contact-info li {
            margin: 8px 0;
            color: #374151;
        }
        .contact-info a {
            color: #dc2626;
            text-decoration: none;
            font-weight: 500;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 25px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
            background-color: #f9fafb;
            padding: 20px 30px;
        }
        .footer p {
            margin: 5px 0;
        }
        .signature {
            margin: 25px 0;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            text-align: center;
        }
        .signature p {
            margin: 5px 0;
            color: #374151;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{system_name}}</h1>
            <p>Donor Application Status Update</p>
        </div>
        
        <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Dear {{user_first_name}},</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.7;">
                Thank you for your interest in becoming a blood donor with <strong>{{system_name}}</strong>. We have carefully reviewed your application and regret to inform you that we are unable to approve your donor registration at this time.
            </p>
            
            <div class="status-badge">
                Status: {{approval_status}}
            </div>
            
            <div class="info-section">
                <h3>📋 Application Details</h3>
                <ul>
                    <li><strong>Full Name:</strong> {{user_first_name}} {{user_last_name}}</li>
                    <li><strong>Email Address:</strong> {{user_email}}</li>
                    <li><strong>Agency:</strong> {{agency_name}}</li>
                    <li><strong>Application Date:</strong> {{approval_date}}</li>
                </ul>
            </div>
            
            <div class="rejection-reason">
                <h3>❌ Reason for Rejection</h3>
                <p>{{approval_reason}}</p>
            </div>
            
            <div class="contact-info">
                <h3>📞 Need Assistance?</h3>
                <p style="color: #374151; margin-bottom: 15px;">
                    If you have any questions about this decision or would like to discuss your application further, please don't hesitate to contact us:
                </p>
                <ul>
                    <li><strong>Email Support:</strong> <a href="mailto:{{support_email}}">{{support_email}}</a></li>
                    <li><strong>Portal Access:</strong> <a href="{{domain_url}}">{{domain_url}}</a></li>
                </ul>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.7;">
                We appreciate your understanding and encourage you to reach out if you believe there may be additional information that could affect this decision.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.7;">
                Thank you for your interest in supporting our blood donation program.
            </p>
            
            <div class="signature">
                <p style="margin: 0;"><strong>Best regards,</strong></p>
                <p style="margin: 5px 0; font-size: 18px; color: #dc2626;"><strong>{{system_name}} Team</strong></p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>This is an automated message from {{system_name}}.</strong></p>
            <p>Please do not reply to this email. For support, contact us at {{support_email}}</p>
        </div>
    </div>
</body>
</html>`,
            text_content: `DONOR APPLICATION STATUS UPDATE - {{system_name}}

Dear {{user_name}},

Thank you for your interest in becoming a blood donor with {{system_name}}. We have carefully reviewed your application and regret to inform you that we are unable to approve your donor registration at this time.

Status: {{approval_status}}

Application Details:
- Name: {{user_first_name}} {{user_last_name}}
- Email: {{user_email}}
- Agency: {{agency_name}}
- Application Date: {{approval_date}}

Reason for Rejection:
{{approval_reason}}

Need Assistance?
If you have any questions about this decision or would like to discuss your application further, please don't hesitate to contact us:
- Email: {{support_email}}
- Portal: {{domain_url}}

We appreciate your understanding and encourage you to reach out if you believe there may be additional information that could affect this decision.

Thank you for your interest in supporting our blood donation program.

Best regards,
{{system_name}} Team

---
This is an automated message from {{system_name}}. Please do not reply to this email.
For support, contact us at {{support_email}}`,
            dynamic_fields: JSON.stringify([
                "user_name",
                "user_email",
                "user_first_name",
                "user_last_name",
                "agency_name",
                "approval_status",
                "approval_date",
                "approval_reason",
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
            category: ["DONOR_REJECTION"],
        },
        {}
    );
} 