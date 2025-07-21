import { NextResponse } from "next/server";
import {
    BloodDonationCollection,
    BloodRequest,
    BloodType,
    Donor,
} from "@lib/models";
import { Op, fn, col, literal } from "sequelize";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const bloodType = searchParams.get("bloodType");

        // Build where conditions for blood type filter
        const bloodTypeWhere = {};
        if (bloodType && bloodType !== "ALL") {
            bloodTypeWhere.blood_type = bloodType;
        }

        // Get current inventory by blood type
        const inventoryData = await BloodType.findAll({
            attributes: [
                "blood_type",
                "id",
                [
                    literal(`(
                        SELECT COALESCE(SUM(bdc.volume), 0) 
                        FROM blood_donation_collections bdc 
                        INNER JOIN donors d ON bdc.donor_id = d.id
                        WHERE d.blood_type_id = BloodType.id
                    )`),
                    "totalCollected",
                ],
                [
                    literal(`(
                        SELECT COALESCE(SUM(br.no_of_units), 0) 
                        FROM blood_requests br 
                        WHERE br.blood_type_id = BloodType.id
                        AND br.status IN ('pending', 'fulfilled')
                    )`),
                    "totalRequested",
                ],
                [
                    literal(`(
                        SELECT COUNT(*) 
                        FROM blood_donation_collections bdc 
                        INNER JOIN donors d ON bdc.donor_id = d.id
                        WHERE d.blood_type_id = BloodType.id
                    )`),
                    "unitsAvailable",
                ],
            ],
            where: bloodTypeWhere,
            order: [["blood_type", "ASC"]],
        });

        // Calculate days of coverage (assuming average daily usage)
        const inventoryWithCoverage = inventoryData.map((item) => {
            const data = item.toJSON();
            const dailyUsage = data.totalRequested / 30; // Rough estimate based on monthly requests
            const daysCoverage =
                dailyUsage > 0
                    ? Math.floor(data.totalCollected / dailyUsage)
                    : 999;

            return {
                ...data,
                daysCoverage: daysCoverage > 999 ? "999+" : daysCoverage,
                status:
                    daysCoverage < 7
                        ? "Critical"
                        : daysCoverage < 14
                        ? "Low"
                        : "Good",
            };
        });

        // Get recent collection trends (last 30 days)
        const recentCollections = await BloodDonationCollection.findAll({
            attributes: [
                [col("donor.blood_type.blood_type"), "bloodType"],
                [fn("DATE", col("BloodDonationCollection.createdAt")), "date"],
                [fn("COUNT", col("BloodDonationCollection.id")), "count"],
                [fn("SUM", col("BloodDonationCollection.volume")), "volume"],
            ],
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
                            where: bloodTypeWhere,
                            required: true,
                        },
                    ],
                    required: true,
                },
            ],
            where: {
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
            },
            group: [
                "donor.blood_type.blood_type",
                fn("DATE", col("BloodDonationCollection.createdAt")),
            ],
            order: [
                [fn("DATE", col("BloodDonationCollection.createdAt")), "DESC"],
            ],
            raw: true,
        });

        // Get pending requests by blood type
        const pendingRequests = await BloodRequest.findAll({
            attributes: [
                [col("blood_type.blood_type"), "bloodType"],
                [fn("COUNT", col("BloodRequest.id")), "requestCount"],
                [fn("SUM", col("no_of_units")), "totalUnitsRequested"],
            ],
            include: [
                {
                    model: BloodType,
                    as: "blood_type",
                    attributes: [],
                    where: bloodTypeWhere,
                    required: true,
                },
            ],
            where: {
                status: ["pending", "fulfilled"],
            },
            group: ["blood_type.blood_type"],
            raw: true,
        });

        // Calculate total inventory summary
        const totalSummary = inventoryWithCoverage.reduce(
            (acc, item) => ({
                totalUnits: acc.totalUnits + (item.unitsAvailable || 0),
                totalVolume:
                    acc.totalVolume + (Number(item.totalCollected) || 0),
                criticalTypes:
                    acc.criticalTypes + (item.status === "Critical" ? 1 : 0),
                lowTypes: acc.lowTypes + (item.status === "Low" ? 1 : 0),
            }),
            { totalUnits: 0, totalVolume: 0, criticalTypes: 0, lowTypes: 0 }
        );

        return NextResponse.json({
            success: true,
            data: {
                inventory: inventoryWithCoverage,
                summary: totalSummary,
                recentCollections,
                pendingRequests,
                filters: {
                    bloodType,
                },
            },
        });
    } catch (error) {
        console.error("Inventory API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch inventory data",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
