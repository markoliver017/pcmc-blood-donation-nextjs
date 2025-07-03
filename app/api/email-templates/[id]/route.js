import { NextResponse } from "next/server";
import {
    getEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    toggleTemplateStatus,
} from "@action/emailTemplateAction";

// GET /api/email-templates/[id] - Get a single email template
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const result = await getEmailTemplate(id);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 404 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("GET /api/email-templates/[id] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT /api/email-templates/[id] - Update an email template
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const formData = await request.formData();
        const result = await updateEmailTemplate(id, formData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("PUT /api/email-templates/[id] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/email-templates/[id] - Delete an email template
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const result = await deleteEmailTemplate(id, userId);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: result.message });
    } catch (error) {
        console.error("DELETE /api/email-templates/[id] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH /api/email-templates/[id]/toggle - Toggle template status
export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const result = await toggleTemplateStatus(id, userId);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("PATCH /api/email-templates/[id]/toggle error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
