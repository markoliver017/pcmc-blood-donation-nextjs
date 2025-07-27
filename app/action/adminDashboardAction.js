"use server";

import { Op } from "sequelize";
import moment from "moment";
import { auth } from "@lib/auth";

import {
    Agency,
    BloodDonationCollection,
    BloodDonationEvent,
    Donor,
    User,
    sequelize 
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/validationErrorHandler";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { logErrorToFile } from "@lib/logger.server";

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
        const donorCount = await Donor.count({ where: { status: 'activated' } });
        const donationCount = await BloodDonationCollection.count();
        const agencyCount = await Agency.count({ where: { status: 'activated' } });

        // 2. Event Status Counts
        const [totalEventCount, pendingApprovalCount, activeEventCount] = await Promise.all([
            BloodDonationEvent.count(),
            BloodDonationEvent.count({ where: { status: "for approval" } }),
            BloodDonationEvent.count({ where: { status: "approved" } })
        ]);

        // 3. Participant & Success Metrics
        const eventStats = await BloodDonationEvent.findAll({
            attributes: [
                [sequelize.fn("sum", sequelize.col("total_participants")), "totalParticipants"],
                [sequelize.fn("sum", sequelize.col("successful_donations")), "totalSuccessfulDonations"],
            ],
            where: { status: "completed" },
            raw: true,
        });
        const { totalParticipants, totalSuccessfulDonations } = eventStats[0];
        const successRate = totalParticipants > 0 ? (totalSuccessfulDonations / totalParticipants) * 100 : 0;
        const averageParticipants = totalEventCount > 0 ? totalParticipants / totalEventCount : 0;

        // 4. For Approval Lists
        const [forApprovalEvents, forApprovalAgencies] = await Promise.all([
            BloodDonationEvent.findAll({
                where: { status: "for approval" },
                include: [{ model: Agency, as: "agency", attributes: ["id", "name"] }],
                order: [["createdAt", "DESC"]],
            }),
            Agency.findAll({
                where: { status: "for approval" },
                order: [["createdAt", "DESC"]],
            })
        ]);

        // 5. Donations over time (last 6 months)
        const sixMonthsAgo = moment().subtract(6, 'months').startOf('month').toDate();
        const donationsByMonthData = await BloodDonationCollection.findAll({
            attributes: [
                [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                [sequelize.fn('count', sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: ['month'],
            order: [[sequelize.literal('month'), 'ASC']],
            raw: true,
        });

        const donationsByMonth = Array.from({ length: 6 }, (_, i) => {
            const month = moment().subtract(5 - i, 'months');
            const monthStr = month.format('YYYY-MM');
            const data = donationsByMonthData.find(d => d.month === monthStr);
            return {
                name: month.format('MMM'),
                donations: data ? data.count : 0,
            };
        });

        // 6. Blood Type Distribution
        const bloodTypeDistributionData = await BloodDonationCollection.findAll({
            attributes: [
                'blood_type',
                [sequelize.fn('count', sequelize.col('id')), 'count']
            ],
            group: ['blood_type'],
            raw: true,
        });

        const bloodTypeDistribution = bloodTypeDistributionData.map(item => ({
            name: item.blood_type,
            value: parseInt(item.count, 10),
        }));

        // 7. Event Success Rate (Last 5 Events)
        const recentEvents = await BloodDonationEvent.findAll({
            where: { status: 'completed' },
            order: [['end_date', 'DESC']],
            limit: 5,
            attributes: ['id', 'name', 'total_participants'],
            raw: true,
        });

        const eventIds = recentEvents.map(e => e.id);

        const donationCounts = await BloodDonationCollection.findAll({
            where: { event_id: { [Op.in]: eventIds } },
            attributes: [
                'event_id',
                [sequelize.fn('COUNT', sequelize.col('id')), 'donationCount']
            ],
            group: ['event_id'],
            raw: true
        });

        const eventSuccessData = recentEvents.map(event => {
            const donationData = donationCounts.find(d => d.event_id === event.id);
            return {
                name: event.name,
                participants: event.total_participants,
                donations: donationData ? parseInt(donationData.donationCount, 10) : 0
            };
        }).reverse(); // To show in chronological order on the chart

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
                forApprovalEvents: forApprovalEvents || [],
                forApprovalAgencies: forApprovalAgencies || [],
                donationsByMonth: donationsByMonth || [],
                bloodTypeDistribution: bloodTypeDistribution || [],
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
