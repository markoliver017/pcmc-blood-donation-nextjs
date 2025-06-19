import { getLastDonationDateBooked } from "@/action/donorAction";
import { User } from "@lib/models";
import { NextResponse } from "next/server";

export async function GET() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const last_donation_date = await getLastDonationDateBooked();
    console.log("last_donation_date", last_donation_date);

    try {
        const users = await User.findAll({
            attributes: ["id", "name", "email"],
        });
        return NextResponse.json(
            { last_donation_date, users },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve admins.",
                details: error,
            },
            { status: 500 }
        );
    }
}
