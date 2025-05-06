import { logErrorToFile, logSuccessToFile } from "@lib/logger.server";
import nodemailer from "nodemailer";

export async function send_mail(to, subject, text, html, attachFiles = []) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            // host: "smtp-relay.brevo.com",
            // port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD, // Consider using env vars for security
            },
        });

        const mailOptions = {
            from: `"pcmc-notification" <${process.env.SMTP_USER}>`, // sender address
            to,
            subject,
            text,
            html,
            attachments: attachFiles.length > 0 ? attachFiles : [],
            // attachments: [
            //     {
            //         filename: 'report.pdf',
            //         content: pdfBuffer,
            //         contentType: 'application/pdf',
            //     },
            // ],
        };

        const info = await transporter.sendMail(mailOptions);

        logSuccessToFile(
            `Email sent to ${to} with subject "${subject}". Message ID: ${info.messageId}`,
            "send-email"
        );

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        logErrorToFile(error, "send-email");

        return {
            success: false,
            error: error.message,
        };
    }
}
