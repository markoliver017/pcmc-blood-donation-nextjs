import { NextResponse } from "next/server";
import {
    BloodDonationEvent,
    DonorAppointmentInfo,
    PhysicalExamination,
    BloodDonationCollection,
    Agency,
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
        const agencyId = searchParams.get("agency");

        const whereConditions = {};
        if (startDate && endDate) {
            whereConditions.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            whereConditions.date = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            whereConditions.date = { [Op.lte]: new Date(endDate) };
        }

        if (agencyId && agencyId !== "ALL") {
            whereConditions.agency_id = agencyId;
        }

        const eventPerformanceData = await BloodDonationEvent.findAll({
            attributes: [
                "id",
                "title",
                "date",
                [
                    literal(
                        `(SELECT COUNT(*) FROM donor_appointment_infos WHERE donor_appointment_infos.event_id = BloodDonationEvent.id)`
                    ),
                    "registeredDonors",
                ],
                [
                    literal(
                        `(SELECT COUNT(*) FROM physical_examinations WHERE physical_examinations.event_id = BloodDonationEvent.id)`
                    ),
                    "screenedDonors",
                ],
                [
                    literal(
                        `(SELECT COUNT(*) FROM blood_donation_collections WHERE blood_donation_collections.event_id = BloodDonationEvent.id)`
                    ),
                    "collectedDonors",
                ],
            ],
            include: [
                {
                    model: Agency,
                    as: "agency",
                    attributes: ["name"],
                },
            ],
            where: whereConditions,
            group: ["BloodDonationEvent.id", "agency.id"],
            order: [["date", "DESC"]],
            raw: true,
            nest: true,
        });

        return NextResponse.json({ success: true, data: eventPerformanceData });
    } catch (error) {
        console.error("Event Performance Report Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred while fetching the report data.",
            },
            { status: 500 }
        );
    }
}
