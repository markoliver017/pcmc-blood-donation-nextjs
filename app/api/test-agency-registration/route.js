import { NextResponse } from "next/server";
import { storeAgency } from "@action/agencyAction";

export async function POST(request) {
    try {
        const formData = await request.json();

        // Call the actual storeAgency action
        const result = await storeAgency(formData);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message:
                    result.message ||
                    "Agency registration completed successfully",
                data: result.data,
            });
        } else {
            console.error("result error", result);
            return NextResponse.json(
                {
                    success: false,
                    message: result.message || "Agency registration failed",
                    error: result.errorObj || result.errorArr || result.message,
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Test agency registration error:", error);
        return NextResponse.json(
            {
                success: false,
                message:
                    "Internal server error during agency registration test",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
