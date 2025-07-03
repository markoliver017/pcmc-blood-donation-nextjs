import { NextResponse } from "next/server";
import { previewTemplate } from "@action/emailTemplateAction";

// POST /api/email-templates/preview - Preview template with sample data
export async function POST(request) {
    try {
        const body = await request.json();
        const { template, sampleData = {} } = body;

        if (!template) {
            return NextResponse.json(
                { error: "Template is required" },
                { status: 400 }
            );
        }

        const result = await previewTemplate(template, sampleData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("POST /api/email-templates/preview error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
