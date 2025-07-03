import { NextResponse } from "next/server";
import { EmailTemplate } from "@lib/models";

// GET /api/email-templates/test-simple - Simple test without associations
export async function GET() {
    try {
        // Test basic model functionality without associations
        const templateCount = await EmailTemplate.count();

        return NextResponse.json({
            success: true,
            message: "Email template model is working",
            data: {
                templateCount: templateCount,
                modelName: "EmailTemplate",
                tableName: "email_templates",
            },
        });
    } catch (error) {
        console.error("GET /api/email-templates/test-simple error:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
