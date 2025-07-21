import { NextResponse } from "next/server";
import {
    BloodDonationCollection,
    BloodType,
    BloodDonationEvent,
    Donor,
} from "@lib/models";
import { Op, fn, col } from "sequelize";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const agencyId = searchParams.get("agencyId");
        const bloodType = searchParams.get("bloodType");

        // Build where conditions
        const whereConditions = {};

        if (startDate && endDate) {
            whereConditions["$event.date$"] = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            whereConditions["$event.date$"] = {
                [Op.gte]: new Date(startDate),
            };
        } else if (endDate) {
            whereConditions["$event.date$"] = {
                [Op.lte]: new Date(endDate),
            };
        }

        // Include conditions for related models
        const includeConditions = [];

        // Donor with blood type filter
        const donorInclude = {
            model: Donor,
            as: "donor",
            required: false,
            attributes: [],
            include: [
                {
                    model: BloodType,
                    as: "blood_type",
                    required: false,
                    attributes: [],
                },
            ],
        };

        if (bloodType && bloodType !== "ALL") {
            donorInclude.include[0].where = { blood_type: bloodType };
            donorInclude.include[0].required = true;
            donorInclude.required = true;
        }

        // Agency filter through event
        const eventInclude = {
            model: BloodDonationEvent,
            as: "event",
            attributes: [],
            required: false,
        };

        if (agencyId && agencyId !== "ALL") {
            eventInclude.where = { agency_id: agencyId };
            eventInclude.required = true;
        }

        includeConditions.push(eventInclude);
        includeConditions.push(donorInclude);

        // Get summary statistics
        const summaryData = await BloodDonationCollection.findAll({
            attributes: [
                [
                    fn("COUNT", col("BloodDonationCollection.id")),
                    "totalDonations",
                ],
                [
                    fn("SUM", col("BloodDonationCollection.volume")),
                    "totalVolume",
                ],
                [
                    fn("AVG", col("BloodDonationCollection.volume")),
                    "averageVolume",
                ],
                [
                    fn(
                        "COUNT",
                        fn("DISTINCT", col("BloodDonationCollection.donor_id"))
                    ),
                    "uniqueDonors",
                ],
            ],
            where: whereConditions,
            include: includeConditions,
            // group: ["BloodDonationCollection.id"],
            raw: true,
        });

        // Get donations by blood type
        const donationsByBloodType = await BloodDonationCollection.findAll({
            attributes: [
                [col("donor.blood_type.blood_type"), "bloodType"],
                [fn("COUNT", col("BloodDonationCollection.id")), "count"],
                [fn("SUM", col("volume")), "totalVolume"],
            ],
            where: whereConditions,
            include: [
                {
                    model: Donor,
                    as: "donor",
                    attributes: [],
                    include: [
                        {
                            model: BloodType,
                            as: "blood_type",
                            attributes: [],
                            required: true,
                        },
                    ],
                    required: true,
                },
                eventInclude,
            ],
            group: ["donor.blood_type.blood_type"],
            raw: true,
        });

        console.log(includeConditions);

        // // Get donations by month (last 12 months)
        const donationsByMonth = await BloodDonationCollection.findAll({
            attributes: [
                [fn("DATE_FORMAT", col("event.date"), "%Y-%m"), "month"],
                [fn("COUNT", col("BloodDonationCollection.id")), "count"],
                [
                    fn("SUM", col("BloodDonationCollection.volume")),
                    "totalVolume",
                ],
            ],
            where: {
                ...whereConditions,
                // createdAt: {
                //     [Op.gte]: new Date(
                //         new Date().setMonth(new Date().getMonth() - 12)
                //     ),
                // },
            },
            include: includeConditions,
            group: [fn("DATE_FORMAT", col("event.date"), "%Y-%m")],
            order: [[fn("DATE_FORMAT", col("event.date"), "%Y-%m"), "ASC"]],
            raw: true,
        });

        return NextResponse.json({
            success: true,
            data: {
                summary: summaryData[0] || {
                    totalDonations: 0,
                    totalVolume: 0,
                    averageVolume: 0,
                    uniqueDonors: 0,
                },
                byBloodType: donationsByBloodType,
                byMonth: donationsByMonth,
                filters: {
                    startDate,
                    endDate,
                    agencyId,
                    bloodType,
                },
            },
        });
    } catch (error) {
        console.error("Donation summary API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch donation summary data",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
