import { Role } from "@lib/models";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const roles = await Role.findAll();
        return NextResponse.json(
            { success: true, data: roles },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve user roles.",
                error: error,
            },
            { status: 500 }
        );
    }
}
