import { NextResponse } from "next/server";
import {
    Agency,
    BloodDonationEvent,
    BloodDonationCollection,
    DonorAppointmentInfo,
} from "@lib/models";
import { Op, fn, col, literal } from "sequelize";
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

        const eventWhereConditions = {
            status: "approved",
        };
        if (startDate && endDate) {
            eventWhereConditions.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            eventWhereConditions.date = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            eventWhereConditions.date = { [Op.lte]: new Date(endDate) };
        }

        const agencyContributions = await Agency.findAll({
            where: {
                status: "activated",
            },
            attributes: [
                "id",
                "name",
                [fn("COUNT", col("events.id")), "totalEvents"],
                [fn("COUNT", col("events.collections.id")), "totalCollections"],
                [
                    fn("SUM", col("events.collections.volume")),
                    "totalVolumeCollected",
                ],
                [
                    fn(
                        "AVG",
                        literal(
                            `(SELECT COUNT(*) FROM donor_appointment_infos WHERE donor_appointment_infos.event_id = events.id)`
                        )
                    ),
                    "avgDonorsPerEvent",
                ],
            ],
            include: [
                {
                    model: BloodDonationEvent,
                    as: "events",
                    attributes: [],
                    where: eventWhereConditions,
                    required: false, // Use left join to include agencies with no events in the period
                    include: [
                        {
                            model: BloodDonationCollection,
                            as: "collections",
                            attributes: [],
                            required: false,
                        },
                        {
                            model: DonorAppointmentInfo,
                            as: "donors",
                            attributes: [],
                            where: {
                                status: {
                                    [Op.notIn]: ["cancelled", "no show"],
                                },
                            },
                            required: false,
                        },
                    ],
                },
            ],
            group: ["Agency.id"],
            order: [[fn("SUM", col("events.collections.volume")), "DESC"]],
            raw: true,
            nest: true,
        });

        return NextResponse.json({ success: true, data: agencyContributions });
    } catch (error) {
        console.error("Agency Contribution Report Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred while fetching the report data.",
            },
            { status: 500 }
        );
    }
}
