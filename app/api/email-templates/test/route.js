import { NextResponse } from "next/server";
import {
    DYNAMIC_FIELDS,
    TEMPLATE_CATEGORIES,
} from "@lib/utils/emailTemplateUtils";

// GET /api/email-templates/test - Test route to verify functionality
export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            message: "Email template API is working",
            data: {
                dynamicFields: Object.keys(DYNAMIC_FIELDS),
                categories: TEMPLATE_CATEGORIES,
                totalFields: Object.keys(DYNAMIC_FIELDS).length,
                totalCategories: TEMPLATE_CATEGORIES.length,
            },
        });
    } catch (error) {
        console.error("GET /api/email-templates/test error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
