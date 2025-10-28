"use server";

import { Op } from "sequelize";
import moment from "moment";
import { auth } from "@lib/auth";

import {
    Agency,
    BloodDonationCollection,
    BloodDonationEvent,
    BloodType,
    Donor,
    DonorAppointmentInfo,
    sequelize,
    User,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/validationErrorHandler";
import { logErrorToFile } from "@lib/logger.server";
import { formatSeqObj } from "@lib/utils/object.utils";

export async function getDashboardData() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        // --- Consolidated Data Fetching ---

        // 1. Basic Counts
        const donorCount = await Donor.count({
            where: { status: "activated" },
        });
        const donationCount = await BloodDonationCollection.count();
        const agencyCount = await Agency.count({
            where: { status: "activated" },
        });

        // 2. Event Status Counts
        const [totalEventCount, pendingApprovalCount, activeEventCount] =
            await Promise.all([
                BloodDonationEvent.count(),
                BloodDonationEvent.count({ where: { status: "for approval" } }),
                BloodDonationEvent.count({ where: { status: "approved" } }),
            ]);

        // 3. Participant & Success Metrics
        const totalParticipants = await DonorAppointmentInfo.count({
            where: {
                status: {
                    [Op.notIn]: ["cancelled"],
                },
            },
        });

        const totalSuccessfulDonations = await BloodDonationCollection.count();
        const successRate =
            totalParticipants > 0
                ? (totalSuccessfulDonations / totalParticipants) * 100
                : 0;
        const averageParticipants =
            activeEventCount > 0 ? totalParticipants / activeEventCount : 0;

        // 4. For Approval Lists
        const [forApprovalEvents, forApprovalAgencies] = await Promise.all([
            BloodDonationEvent.findAll({
                where: { status: "for approval" },
                include: [
                    { model: Agency, as: "agency", attributes: ["id", "name"] },
                ],
                order: [["createdAt", "DESC"]],
            }),
            Agency.findAll({
                where: { status: "for approval" },
                attributes: {
                    exclude: [
                        "remarks",
                        "verified_by",
                        "updated_by",
                        "updatedAt",
                        "head_id",
                    ],
                },
                include: [
                    {
                        model: User,
                        as: "head",
                        attributes: {
                            exclude: [
                                "password",
                                "email_verified",
                                "prefix",
                                "suffix",
                                "createdAt",
                                "updatedAt",
                                "updated_by",
                            ],
                        },
                    },
                ],
                order: [["createdAt", "DESC"]],
            }),
        ]);

        // 5. Donations over time (last 6 months)
        const sixMonthsAgo = moment()
            .subtract(6, "months")
            .startOf("month")
            .toDate();

        const donationsByMonthData = await BloodDonationCollection.findAll({
            attributes: [
                [
                    sequelize.fn(
                        "date_format",
                        sequelize.col("event.date"),
                        "%Y-%m"
                    ),
                    "month",
                ],
                [
                    sequelize.fn(
                        "count",
                        sequelize.col("BloodDonationCollection.id")
                    ),
                    "count",
                ],
            ],
            include: [
                {
                    model: BloodDonationEvent,
                    as: "event",
                    attributes: [],
                    where: {
                        date: {
                            [Op.gte]: sixMonthsAgo,
                        },
                    },
                },
            ],
            group: [
                sequelize.fn(
                    "date_format",
                    sequelize.col("event.date"),
                    "%Y-%m"
                ),
            ],
            order: [[sequelize.literal("month"), "ASC"]],
            raw: true,
        });

        const donationsByMonth = Array.from({ length: 6 }, (_, i) => {
            const month = moment().subtract(5 - i, "months");
            const monthStr = month.format("YYYY-MM");
            const data = donationsByMonthData.find((d) => d.month === monthStr);
            return {
                name: month.format("MMM"),
                donations: data ? data.count : 0,
            };
        });

        // 6. Blood Type Distribution
        const bloodTypeDistributionData = await Donor.findAll({
            where: {
                status: "activated",
                blood_type_id: { [Op.not]: null },
            },
            attributes: [
                "blood_type_id",
                "blood_type.blood_type",
                [
                    sequelize.fn("count", sequelize.col("blood_type_id")),
                    "count",
                ],
            ],

            include: [
                {
                    model: BloodType,
                    as: "blood_type",
                    attributes: ["blood_type"],
                },
            ],

            group: ["blood_type_id"],
            raw: true,
        });
        // const bloodTypeDistributionData = await BloodDonationCollection.findAll(
        //     {
        //         attributes: [
        //             "donor.blood_type_id",
        //             "donor.blood_type.blood_type",
        //             [
        //                 sequelize.fn(
        //                     "count",
        //                     sequelize.col("donor.blood_type_id")
        //                 ),
        //                 "count",
        //             ],
        //         ],
        //         include: [
        //             {
        //                 model: Donor,
        //                 as: "donor",
        //                 attributes: ["blood_type_id"],
        //                 include: [
        //                     {
        //                         model: BloodType,
        //                         as: "blood_type",
        //                         attributes: ["blood_type"],
        //                     },
        //                 ],
        //             },
        //         ],
        //         group: ["donor.blood_type_id"],
        //         raw: true,
        //     }
        // );

        const bloodTypeDistribution = bloodTypeDistributionData.map((item) => ({
            name: item["blood_type.blood_type"],
            value: parseInt(item.count, 10),
        }));

        // 7. Event Success Rate (Last 5 Events)
        const recentEvents = await BloodDonationEvent.findAll({
            where: { status: "approved" },
            order: [["date", "DESC"]],
            limit: 5,
            attributes: ["id", "title", "date"],
            raw: true,
        });

        const eventIds = recentEvents.map((e) => e.id);

        // Get participant counts for each event
        const { participantOverallFeedback } =
            await DonorAppointmentInfo.findOne({
                where: {
                    status: { [Op.notIn]: ["cancelled"] },
                    feedback_average: { [Op.not]: null },
                },
                attributes: [
                    [
                        sequelize.fn("AVG", sequelize.col("feedback_average")),
                        "participantOverallFeedback",
                    ],
                ],
                raw: true,
            });

        const participantCounts = await DonorAppointmentInfo.findAll({
            where: {
                event_id: { [Op.in]: eventIds },
                status: { [Op.notIn]: ["cancelled"] },
            },
            attributes: [
                "event_id",
                [
                    sequelize.fn("COUNT", sequelize.col("id")),
                    "participantCount",
                ],
            ],
            group: ["event_id"],
            raw: true,
        });

        const donationCounts = await BloodDonationCollection.findAll({
            where: { event_id: { [Op.in]: eventIds } },
            attributes: [
                "event_id",
                [sequelize.fn("COUNT", sequelize.col("id")), "donationCount"],
            ],
            group: ["event_id"],
            raw: true,
        });

        const eventSuccessData = recentEvents
            .map((event) => {
                const donationData = donationCounts.find(
                    (d) => d.event_id === event.id
                );
                const participantData = participantCounts.find(
                    (p) => p.event_id === event.id
                );
                return {
                    name: event.title,
                    participants: participantData
                        ? parseInt(participantData.participantCount, 10)
                        : 0,
                    donations: donationData
                        ? parseInt(donationData.donationCount, 10)
                        : 0,
                };
            })
            .reverse(); // To show in chronological order on the chart

        return {
            success: true,
            data: {
                donorCount: donorCount || 0,
                donationCount: donationCount || 0,
                agencyCount: agencyCount || 0,
                totalEventCount: totalEventCount || 0,
                pendingApprovalCount: pendingApprovalCount || 0,
                activeEventCount: activeEventCount || 0,
                totalParticipants: totalParticipants || 0,
                successRate: successRate || 0,
                averageParticipants: averageParticipants || 0,
                forApprovalEvents: formatSeqObj(forApprovalEvents) || [],
                forApprovalAgencies: formatSeqObj(forApprovalAgencies) || [],
                donationsByMonth: donationsByMonth || [],
                bloodTypeDistribution: bloodTypeDistribution || [],
                participantOverallFeedback: participantOverallFeedback || 0,
                eventSuccessData: eventSuccessData || [],
            },
        };
    } catch (err) {
        logErrorToFile(err, "getDashboardData");
        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}
