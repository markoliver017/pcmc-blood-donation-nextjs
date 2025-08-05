import { NextResponse } from "next/server";
import {
    Donor,
    BloodDonationHistory,
    BloodType
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

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.date_of_donation = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            dateFilter.date_of_donation = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            dateFilter.date_of_donation = { [Op.lte]: new Date(endDate) };
        } else {
            // Default to the last 90 days if no date is provided
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            dateFilter.date_of_donation = { [Op.gte]: ninetyDaysAgo };
        }

        const activeDonors = await Donor.findAll({
            attributes: [
                "id",
                "name",
                "email",
                "contact_no",
                [fn('MAX', col('blood_history.date_of_donation')), 'lastDonationDate']
            ],
            include: [
                {
                    model: BloodDonationHistory,
                    as: "blood_history",
                    attributes: [],
                    where: dateFilter,
                    required: true, // Ensures only donors with donations in the period are returned
                },
                {
                    model: BloodType,
                    as: 'blood_type',
                    attributes: ['blood_type']
                }
            ],
            group: ['Donor.id', 'blood_type.id'],
            order: [[fn('MAX', col('blood_history.date_of_donation')), 'DESC']],
            raw: true,
            nest: true
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
