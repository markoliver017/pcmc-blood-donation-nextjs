import { NextResponse } from "next/server";
import {
    Donor,
    BloodDonationCollection,
    BloodType,
    User,
    BloodDonationEvent,
    Agency,
} from "@lib/models";
import { Op, fn, col } from "sequelize";
import { auth } from "@lib/auth";

export async function GET(request) {
    const session = await auth();
    if (!session || session.user.role_name !== "Admin") {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Build date filter for BloodDonationEvent.date
        const eventDateFilter = {};
        if (startDate && endDate) {
            eventDateFilter.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            eventDateFilter.date = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            eventDateFilter.date = { [Op.lte]: new Date(endDate) };
        } else {
            // Default to the last 90 days if no date is provided
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            eventDateFilter.date = { [Op.gte]: ninetyDaysAgo };
        }

        const activeDonors = await Donor.findAll({
            attributes: [
                "id",
                "contact_number",
                [col("user.name"), "name"],
                [col("user.email"), "email"],
                [col("agency.name"), "agency"],
                [col("blood_type.blood_type"), "blood_type"],
                [
                    fn("MAX", col("blood_collections->event.date")),
                    "lastDonationDate",
                ],
            ],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [],
                },
                {
                    model: BloodDonationCollection,
                    as: "blood_collections",
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: BloodDonationEvent,
                            as: "event",
                            attributes: [],
                            where: eventDateFilter,
                            required: true,
                        },
                    ],
                },
                {
                    model: BloodType,
                    as: "blood_type",
                    attributes: ["blood_type"],
                },
                {
                    model: Agency,
                    as: "agency",
                    attributes: ["name"],
                },
            ],
            group: ["Donor.id", "user.id", "blood_type.id"],
            order: [[fn("MAX", col("blood_collections.event.date")), "DESC"]],
            raw: true,
            nest: true,
        });

        return NextResponse.json({ success: true, data: activeDonors });
    } catch (error) {
        console.error("Active Donor Report Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred while fetching the report data.",
            },
            { status: 500 }
        );
    }
}
