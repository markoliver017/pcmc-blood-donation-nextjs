import { NextResponse } from "next/server";
import { sendEmailByCategory } from "@action/emailTemplateAction";

// POST /api/email-templates/test-send - Test sending email with template
export async function POST(request) {
    try {
        const body = await request.json();
        const { category, recipientEmail, dynamicData = {} } = body;

        if (!category) {
            return NextResponse.json(
                { error: "Category is required" },
                { status: 400 }
            );
        }

        if (!recipientEmail) {
            return NextResponse.json(
                { error: "Recipient email is required" },
                { status: 400 }
            );
        }

        const result = await sendEmailByCategory(
            category,
            recipientEmail,
            dynamicData
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Email sent successfully",
            data: result.data,
        });
    } catch (error) {
        console.error("POST /api/email-templates/test-send error:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
