import { NextResponse } from "next/server";
import {
    getEmailTemplates,
    createEmailTemplate,
} from "@action/emailTemplateAction";

// GET /api/email-templates - Get all email templates with optional filtering
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filters = {
            category: searchParams.get("category"),
            is_active:
                searchParams.get("is_active") === "true"
                    ? true
                    : searchParams.get("is_active") === "false"
                    ? false
                    : undefined,
            search: searchParams.get("search"),
        };

        const result = await getEmailTemplates(filters);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("GET /api/email-templates error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/email-templates - Create a new email template
export async function POST(request) {
    try {
        const formData = await request.formData();
        const result = await createEmailTemplate(formData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data, { status: 201 });
    } catch (error) {
        console.error("POST /api/email-templates error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
