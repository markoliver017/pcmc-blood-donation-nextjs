import {
    Agency,
    BloodDonationEvent,
    Donor,
    DonorAppointmentInfo,
    User,
} from "@lib/models";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function GET(request, { params }) {
    const { apt_id } = await params;

    if (!apt_id) {
        return NextResponse.json(
            {
                success: false,
                message: "Appointment ID is required.",
            },
            { status: 400 }
        );
    }

    try {
        const appointment = await DonorAppointmentInfo.findByPk(apt_id, {
            where: {
                status: {
                    [Op.notIn]: ["cancelled"],
                },
            },
            attributes: [],
            include: [
                {
                    model: Donor,
                    as: "donor",
                    attributes: ["id"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "email"],
                        },
                    ],
                },
                {
                    model: BloodDonationEvent,
                    as: "event",
                    attributes: ["id", "title", "date", "file_url"],
                    where: {
                        status: {
                            [Op.notIn]: ["cancelled", "rejected"],
                        },
                    },
                    required: true,
                    include: [
                        {
                            model: Agency,
                            as: "agency",
                            attributes: [
                                "id",
                                "name",
                                "address",
                                "barangay",
                                "city_municipality",
                                "province",
                                "region",
                                "agency_address",
                            ],
                        },
                    ],
                },
            ],
        });
        if (!appointment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Appointment not found.",
                },
                { status: 404 }
            );
        }
        return NextResponse.json({ appointment }, { status: 200 });
    } catch (error) {
        console.error("GET /api/verify-appointment/[apt_id] error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to verify appointment.",
                details: error,
            },
            { status: 500 }
        );
    }
}
