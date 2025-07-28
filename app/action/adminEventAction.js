"use server";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    Agency,
    AgencyCoordinator,
    BloodDonationCollection,
    BloodDonationEvent,
    BloodType,
    Donor,
    DonorAppointmentInfo,
    EventTimeSchedule,
    PhysicalExamination,
    sequelize,
    User,
} from "@lib/models";
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import {
    bloodDonationEventSchema,
    eventRegistrationStatusSchema,
    eventStatusSchema,
} from "@lib/zod/bloodDonationSchema";
import { format } from "date-fns";
import moment from "moment";
import { Op } from "sequelize";

async function updatePastEventStatuses() {
    const today = new Date();

    // 1. Approved & Ongoing -> Completed
    await BloodDonationEvent.update(
        { registration_status: "completed" },
        {
            where: {
                date: { [Op.lt]: today },
                status: "approved",
                registration_status: "ongoing",
            },
        }
    );

    // 2. Not Approved & Not Started -> Closed
    await BloodDonationEvent.update(
        {
            registration_status: "closed",
            remarks: "Event has been closed due to past date.",
        },
        {
            where: {
                date: { [Op.lt]: today },
                registration_status: "not started",
            },
        }
    );

    // 3. Past For Approval Events -> Rejected & Closed
    await BloodDonationEvent.update(
        {
            status: "rejected",
            registration_status: "closed",
            remarks: "Event has been closed due to past date.",
        },
        {
            where: {
                date: { [Op.lt]: today },
                status: "for approval",
            },
        }
    );
}

export async function getAdminDashboard() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this page.",
        };
    }

    try {
        // Basic counts
        const donorCount = await Donor.count({
            where: {
                status: {
                    [Op.in]: ["activated"],
                },
            },
        });

        const donationCount = await BloodDonationCollection.count();

        const agencyCount = await Agency.count({
            where: {
                status: {
                    [Op.in]: ["activated"],
                },
            },
        });

        const totalEventCount = await BloodDonationEvent.count();

        // Event status counts
        const approvedEventCount = await BloodDonationEvent.count({
            where: {
                status: "approved",
            },
        });

        const pendingApprovalCount = await BloodDonationEvent.count({
            where: {
                status: "for approval",
            },
        });

        const activeEventCount = await BloodDonationEvent.count({
            where: {
                status: "approved",
                registration_status: "ongoing",
                // date: {
                //     [Op.gte]: moment().format("YYYY-MM-DD"),
                // },
            },
        });

        // Participant counts
        const totalParticipants = await DonorAppointmentInfo.count({
            where: {
                status: {
                    [Op.not]: "cancelled",
                },
            },
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    include: [
                        {
                            model: BloodDonationEvent,
                            as: "event",
                            where: {
                                status: "approved",
                            },
                        },
                    ],
                },
            ],
        });

        // Recent events (last 30 days)
        const thirtyDaysAgo = moment()
            .subtract(30, "days")
            .format("YYYY-MM-DD");
        const today = moment().format("YYYY-MM-DD");

        const recentEventCount = await BloodDonationEvent.count({
            where: {
                status: "approved",
                date: {
                    [Op.gte]: thirtyDaysAgo,
                    [Op.lte]: today,
                },
            },
        });

        // Success rate calculation
        const completedEvents = await BloodDonationEvent.count({
            where: {
                status: "approved",
                date: {
                    [Op.lt]: moment().format("YYYY-MM-DD"),
                },
            },
        });

        const successRate =
            approvedEventCount > 0
                ? Math.round((completedEvents / approvedEventCount) * 100)
                : 0;

        // Average participants per event
        const averageParticipants =
            approvedEventCount > 0
                ? Math.round(totalParticipants / approvedEventCount)
                : 0;

        return {
            success: true,
            data: {
                donorCount,
                donationCount,
                agencyCount,
                totalEventCount,
                approvedEventCount,
                pendingApprovalCount,
                activeEventCount,
                totalParticipants,
                recentEventCount,
                successRate,
                averageParticipants,
            },
        };
    } catch (err) {
        logErrorToFile(err, "getAdminDashboard ERROR");
        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getEventsAnalytics() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this page.",
        };
    }

    try {
        // Events over time (last 12 months)
        const twelveMonthsAgo = moment()
            .subtract(12, "months")
            .startOf("month");
        const eventsOverTime = await BloodDonationEvent.findAll({
            where: {
                date: {
                    [Op.gte]: twelveMonthsAgo.format("YYYY-MM-DD"),
                },
                status: {
                    [Op.in]: ["approved"],
                },
            },
            attributes: [
                [
                    sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"),
                    "month",
                ],
                [sequelize.fn("COUNT", sequelize.col("id")), "count"],
            ],
            group: [
                sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"),
            ],
            order: [
                [
                    sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"),
                    "ASC",
                ],
            ],
            raw: true,
        });

        // Status distribution
        const statusDistribution = await BloodDonationEvent.findAll({
            attributes: [
                "status",
                [sequelize.fn("COUNT", sequelize.col("id")), "count"],
            ],
            group: ["status"],
            raw: true,
        });

        // Agency performance (top 10 agencies)
        const agencyPerformance = await BloodDonationEvent.findAll({
            where: {
                status: "approved",
            },
            include: [
                {
                    model: Agency,
                    as: "agency",
                    attributes: ["name"],
                },
            ],
            attributes: [
                "agency_id",
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.col("BloodDonationEvent.id")
                    ),
                    "eventCount",
                ],
            ],
            group: ["agency_id"],
            order: [
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.col("BloodDonationEvent.id")
                    ),
                    "DESC",
                ],
            ],
            limit: 10,
            raw: true,
        });

        // Participant trends (last 6 months)
        const sixMonthsAgo = moment().subtract(6, "months").startOf("month");
        const participantTrends = await DonorAppointmentInfo.findAll({
            where: {
                status: {
                    [Op.notIn]: ["cancelled", "no show"],
                },
            },
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    include: [
                        {
                            model: BloodDonationEvent,
                            as: "event",
                            attributes: [], // Only need the date for grouping
                        },
                    ],
                    attributes: [],
                },
            ],
            attributes: [
                [
                    sequelize.fn(
                        "DATE_FORMAT",
                        sequelize.col("time_schedule.event.date"),
                        "%Y-%m"
                    ),
                    "month",
                ],
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.col("DonorAppointmentInfo.id")
                    ),
                    "count",
                ],
            ],
            where: {
                [Op.and]: [
                    { status: { [Op.not]: "cancelled" } },
                    sequelize.where(
                        sequelize.col("time_schedule.event.date"),
                        ">=",
                        sixMonthsAgo.format("YYYY-MM-DD")
                    ),
                ],
            },
            group: [
                sequelize.fn(
                    "DATE_FORMAT",
                    sequelize.col("time_schedule.event.date"),
                    "%Y-%m"
                ),
            ],
            order: [
                [
                    sequelize.fn(
                        "DATE_FORMAT",
                        sequelize.col("time_schedule.event.date"),
                        "%Y-%m"
                    ),
                    "ASC",
                ],
            ],
            raw: true,
        });

        // Blood type distribution
        const bloodTypeDistribution = await Donor.findAll({
            include: [
                {
                    model: BloodType,
                    as: "blood_type",
                    attributes: ["blood_type"],
                },
            ],
            attributes: [
                "blood_type_id",
                [sequelize.fn("COUNT", sequelize.col("Donor.id")), "count"],
            ],
            group: ["blood_type_id"],
            raw: true,
        });

        // Format data for charts
        const formattedEventsOverTime = eventsOverTime.map((item) => ({
            month: moment(item.month, "YYYY-MM").format("MMM YYYY"),
            count: parseInt(item.count),
        }));

        const formattedStatusDistribution = statusDistribution.map((item) => ({
            status: item.status.toUpperCase(),
            count: parseInt(item.count),
        }));

        const formattedAgencyPerformance = agencyPerformance
            .filter((item) => item["agency.name"])
            .map((item) => ({
                agency: item["agency.name"],
                eventCount: parseInt(item.eventCount),
            }));

        const formattedParticipantTrends = participantTrends.map((item) => ({
            month: moment(item.month, "YYYY-MM").format("MMM YYYY"),
            count: parseInt(item.count),
        }));

        const formattedBloodTypeDistribution = bloodTypeDistribution
            .filter((item) => item["blood_type.blood_type"])
            .map((item) => ({
                bloodType: item["blood_type.blood_type"],
                count: parseInt(item.count),
            }));

        return {
            success: true,
            data: {
                eventsOverTime: formattedEventsOverTime,
                statusDistribution: formattedStatusDistribution,
                agencyPerformance: formattedAgencyPerformance,
                participantTrends: formattedParticipantTrends,
                bloodTypeDistribution: formattedBloodTypeDistribution,
            },
        };
    } catch (err) {
        console.log("getEventsAnalytics()", err);
        logErrorToFile(err, "getEventsAnalytics ERROR");
        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getAgencyId() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    if (user?.role_name === "Agency Administrator") {
        const response = await User.findByPk(user.id, {
            attributes: ["id"],
            include: [
                {
                    model: Agency,
                    as: "headedAgency",
                    attributes: ["id"],
                    required: true,
                },
            ],
        });
        return response?.headedAgency?.id;
    } else if (user?.role_name === "Organizer") {
        const response = await User.findByPk(user.id, {
            attributes: ["id"],
            include: [
                {
                    model: AgencyCoordinator,
                    as: "coordinator",
                    attributes: ["id"],
                    required: true,
                    include: {
                        model: Agency,
                        attributes: ["id"],
                        as: "agency",
                        required: true,
                    },
                },
            ],
        });
        return response?.coordinator?.agency?.id;
    }
    return null;
}

/* use in allDataEvents components event calendar */
export async function getAllEvents() {
    await updatePastEventStatuses();
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                status: {
                    [Op.not]: "for approval",
                },
            },
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                },
                {
                    model: Agency,
                    as: "agency",
                },
                {
                    model: User,
                    as: "validator",
                    attributes: ["id", "name", "email", "image"],
                },
                {
                    model: User,
                    as: "editor",
                    attributes: ["id", "name", "email", "image"],
                },
                {
                    model: EventTimeSchedule,
                    as: "time_schedules",
                    include: {
                        model: DonorAppointmentInfo,
                        as: "donors",
                        include: {
                            model: Donor,
                            as: "donor",
                            include: [
                                {
                                    model: User,
                                    as: "user",
                                },
                                {
                                    model: BloodType,
                                    as: "blood_type",
                                },
                            ],
                        },
                    },
                },
            ],
        });

        const formattedEvents = formatSeqObj(events);

        return { success: true, data: formattedEvents };
    } catch (err) {
        logErrorToFile(err, "getAllEvents ERROR");
        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function getPresentEvents() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentDate = moment().format("YYYY-MM-DD");
    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                status: {
                    [Op.eq]: "approved",
                },
                date: {
                    [Op.gte]: currentDate,
                },
            },
            order: [["date", "DESC"]],
            include: [
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                },
                {
                    model: Agency,
                    as: "agency",
                },
                {
                    model: User,
                    as: "validator",
                    attributes: ["id", "name", "email", "image"],
                },
                {
                    model: User,
                    as: "editor",
                    attributes: ["id", "name", "email", "image"],
                },
                {
                    model: EventTimeSchedule,
                    as: "time_schedules",
                    include: {
                        model: DonorAppointmentInfo,
                        as: "donors",
                        include: {
                            model: Donor,
                            as: "donor",
                            include: [
                                {
                                    model: User,
                                    as: "user",
                                },
                                {
                                    model: BloodType,
                                    as: "blood_type",
                                },
                            ],
                        },
                    },
                },
            ],
        });

        const formattedEvents = formatSeqObj(events);

        return { success: true, data: formattedEvents };
    } catch (err) {
        logErrorToFile(err, "getAllEvents ERROR");
        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function getAllEventOptions() {
    try {
        const events = await BloodDonationEvent.findAll({
            attributes: ["id", "title", "date"],
            where: {
                status: {
                    [Op.not]: "for approval",
                },
            },
            order: [["createdAt", "DESC"]],
        });

        const formattedEvents = formatSeqObj(events);

        return { success: true, data: formattedEvents };
    } catch (err) {
        logErrorToFile(err, "getAllEventOptions ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getAllAgencyOptions() {
    try {
        const agencies = await Agency.findAll({
            attributes: ["id", "name"],
            where: {
                status: {
                    [Op.eq]: "activated",
                },
            },
            order: [["createdAt", "DESC"]],
        });

        const formattedagencies = formatSeqObj(agencies);

        return { success: true, data: formattedagencies };
    } catch (err) {
        logErrorToFile(err, "getAllAgencyOptions ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getAllEventsByAgency() {
    // await new Promise((resolve) => setTimeout(resolve, 500));

    const agency_id = await getAgencyId();

    if (!agency_id) {
        return {
            success: false,
            message: "Agency not found or inactive!",
        };
    }

    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                agency_id,
                status: {
                    [Op.not]: "for approval",
                },
            },
            include: [
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                },
            ],
        });

        const formattedEvents = formatSeqObj(events);

        return { success: true, data: formattedEvents };
    } catch (err) {
        logErrorToFile(err, "getAllEventsByAgency ERROR");
        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function getEventsByStatus(status) {
    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                status: {
                    [Op.eq]: status,
                },
            },
            include: [
                {
                    model: Agency,
                    as: "agency",
                    attributes: ["id", "name"],
                },
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                },
            ],
        });

        const formattedEvents = formatSeqObj(events);

        return formattedEvents;
    } catch (err) {
        logErrorToFile(err, "getEventsByStatus ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getEventsById(id) {
    if (!id) {
        return {
            success: false,
            message: "Incomplete data: Id is required.",
        };
    }

    try {
        const events = await BloodDonationEvent.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                    include: {
                        model: AgencyCoordinator,
                        as: "coordinator",
                        attributes: ["contact_number"],
                    },
                },
                {
                    model: Agency,
                    as: "agency",
                },
                {
                    model: EventTimeSchedule,
                    as: "time_schedules",
                },
            ],
        });

        const formattedEvents = formatSeqObj(events);

        return formattedEvents;
    } catch (err) {
        logErrorToFile(err, "getEventsById ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function storeEvent(formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    formData.requester_id = user.id;

    console.log("formData received on server", formData);

    const parsed = bloodDonationEventSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const agency = Agency.findByPk(data?.agency_id, {
        where: { status: "activated" },
    });

    if (!agency) {
        return {
            success: false,
            message: "Database Error: Agency not found or inactive.",
        };
    }

    const existingEvent = await BloodDonationEvent.findOne({
        where: {
            status: {
                [Op.in]: ["approved", "for approval"],
            },
            [Op.or]: [
                {
                    from_date: {
                        [Op.between]: [data.from_date, data.to_date],
                    },
                },
                {
                    to_date: {
                        [Op.between]: [data.from_date, data.to_date],
                    },
                },
                {
                    [Op.and]: [
                        {
                            from_date: {
                                [Op.lte]: data.from_date,
                            },
                        },
                        {
                            to_date: {
                                [Op.gte]: data.to_date,
                            },
                        },
                    ],
                },
            ],
        },
    });

    if (existingEvent) {
        return {
            success: false,
            message:
                "Event date conflict: Another event is already scheduled for this date.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const newEvent = await BloodDonationEvent.create(data, {
            transaction,
        });

        if (newEvent) {
            await EventTimeSchedule.bulkCreate(
                data.time_schedules.map((row) => ({
                    blood_donation_event_id: newEvent.id,
                    ...row,
                })),
                { transaction }
            );
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "events",
            action: "STORE EVENT",
            details: `New blood donation event has been successfully created. ID#: ${newEvent?.id}`,
        });

        return {
            success: true,
            data: newEvent.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "STORE EVENT");
        await transaction.rollback();

        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function updateEvent(id, formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    formData.requester_id = user.id;

    const parsed = bloodDonationEventSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const agency = await Agency.findByPk(data?.agency_id, {
        where: { status: "activated" },
    });

    if (!agency) {
        return {
            success: false,
            message: "Database Error: Agency not found or inactive.",
        };
    }

    const existingEvent = await BloodDonationEvent.findByPk(id);

    if (!existingEvent) {
        return {
            success: false,
            message: "Event not found.",
        };
    }

    const conflictingEvent = await BloodDonationEvent.findOne({
        where: {
            id: { [Op.ne]: id },
            status: {
                [Op.in]: ["approved", "for approval"],
            },
            [Op.or]: [
                {
                    from_date: {
                        [Op.between]: [data.from_date, data.to_date],
                    },
                },
                {
                    to_date: {
                        [Op.between]: [data.from_date, data.to_date],
                    },
                },
                {
                    [Op.and]: [
                        {
                            from_date: {
                                [Op.lte]: data.from_date,
                            },
                        },
                        {
                            to_date: {
                                [Op.gte]: data.to_date,
                            },
                        },
                    ],
                },
            ],
        },
    });

    if (conflictingEvent) {
        return {
            success: false,
            message:
                "Event date conflict: Another event is already scheduled for this date.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        await existingEvent.update(data, { transaction });

        await EventTimeSchedule.destroy({
            where: { blood_donation_event_id: id },
            transaction,
        });

        await EventTimeSchedule.bulkCreate(
            data.time_schedules.map((row) => ({
                blood_donation_event_id: id,
                ...row,
            })),
            { transaction }
        );

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "events",
            action: "UPDATE EVENT",
            details: `Blood donation event has been successfully updated. ID#: ${id}`,
        });

        return {
            success: true,
            data: existingEvent.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE EVENT");
        await transaction.rollback();

        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function updateEventStatus(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    formData.verified_by = user.id;

    const parsed = eventStatusSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message:
                "Validation Error: Please try again. If the issue persists, contact your administrator for assistance.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const event = await BloodDonationEvent.findByPk(data.id, {
        include: [
            {
                model: Agency,
                as: "agency",
                attributes: ["name"],
            },
        ],
    });

    if (!event) {
        return {
            success: false,
            message: "Database Error: Event ID was not found",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedEvent = await event.update(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "adminEventAction",
            action: "UPDATE EVENT STATUS",
            details: `Event status has been successfully updated to ${data?.status}. Event ID#: ${updatedEvent?.id} by user ${user?.name} (${user?.email})`,
        });

        // Notifications and emails (non-blocking)
        (async () => {
            try {
                let notification_message = `The blood donation event "${event.title}" has been updated.`;

                if (data.status === "approved") {
                    notification_message = `Your blood donation event "${event.title}" has been approved! You can now manage the event and open registrations for your donors.`;
                } else if (data.status === "rejected") {
                    notification_message = `Your blood donation event "${event.title}" has been rejected with the following remarks: (${event.remarks}). Please review the feedback and make the necessary adjustments.`;
                }

                const organizer = await User.findByPk(event.requester_id);

                if (organizer) {
                    // System notification to all admins
                    try {
                        await sendNotificationAndEmail({
                            userIds: [organizer.id],
                            notificationData: {
                                subject: `Blood Donation Event Update`,
                                message: notification_message,
                                type: "BLOOD_DRIVE_APPROVAL",
                                reference_id: event.id,
                                created_by: user.id,
                            },
                        });
                    } catch (err) {
                        console.error(
                            "An organizer system notification failed:",
                            err
                        );
                    }

                    try {
                        await sendNotificationAndEmail({
                            emailData: {
                                to: organizer.email,
                                templateCategory: "BLOOD_DRIVE_APPROVAL",
                                templateData: {
                                    event_name: event.title,
                                    event_date: event.date,

                                    agency_name: event?.agency?.name || "",
                                    event_description: event.description || "",
                                    approval_status: event.status || "",
                                    approval_date: format(new Date(), "PPP"),
                                    approval_reason:
                                        event.remarks ||
                                        "You can now manage the event and open registrations for your donors.",
                                    event_organizer:
                                        organizer.full_name || organizer.name,
                                    system_name:
                                        process.env.NEXT_PUBLIC_SYSTEM_NAME ||
                                        "",
                                    support_email:
                                        process.env
                                            .NEXT_PUBLIC_SMTP_SUPPORT_EMAIL ||
                                        "",
                                    support_contact:
                                        process.env
                                            .NEXT_PUBLIC_SMTP_SUPPORT_CONTACT ||
                                        "",
                                    domain_url:
                                        process.env.NEXT_PUBLIC_APP_URL || "",
                                },
                            },
                        });
                    } catch (err) {
                        console.error(
                            `Admin email notification failed for ${organizer.email}:`,
                            err
                        );
                    }
                }
            } catch (err) {
                console.error("Admin notification/email block failed:", err);
            }
        })();

        const title = {
            rejected: "Event Rejected",
            approved: "Event Approved",
            cancelled: "Event Cancelled",
        };

        const text = {
            rejected:
                "The blood donation event has been rejected. The agency will be notified.",
            approved:
                "The blood donation event is now approved and active. The agency will be notified.",
            cancelled:
                "The blood donation event has been cancelled. The agency will be notified.",
        };

        return {
            success: true,
            data: updatedEvent.get({ plain: true }),
            title: title[data.status] || "Event Updated",
            text:
                text[data.status] ||
                "The blood donation event has been updated. The agency will be notified.",
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE EVENT STATUS");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function updateEventRegistrationStatus(formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    formData.updated_by = user.id;

    const parsed = eventRegistrationStatusSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message:
                "Validation Error: Please try again. If the issue persists, contact your administrator for assistance.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const event = await BloodDonationEvent.findByPk(data.id);

    if (!event) {
        return {
            success: false,
            message: "Database Error: Event ID was not found",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedEvent = await event.update(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "adminEventAction",
            action: "UPDATE EVENT REGISTRATION STATUS",
            details: `The Event registration status has been successfully updated to ${data?.registration_status}. ID#: ${updatedEvent?.id}`,
        });

        const title = {
            ongoing: "Registration Ongoing",
            closed: "Registration Closed",
            completed: "Update Successful",
        };

        const text = {
            ongoing: "Blood donation event registration is now open.",
            closed: "Blood donation event registration has been closed successfully.",
            completed:
                "Blood donation event registration details have been updated successfully.",
        };

        return {
            success: true,
            data: updatedEvent.get({ plain: true }),
            title: title[data.registration_status] || "Updated Status",
            text:
                text[data.registration_status] ||
                `Blood donation event registration status updated to ${data.registration_status}.`,
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE EVENT STATUS");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function getForApprovalEvents() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const currentDate = moment().format("YYYY-MM-DD");
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                status: {
                    [Op.eq]: "approved",
                },
                registration_status: "ongoing",
                date: {
                    [Op.gte]: currentDate,
                },
            },
            order: [["date", "ASC"]],
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedules",
                    attributes: [
                        "id",
                        "blood_donation_event_id",
                        "time_start",
                        "time_end",
                        "status",
                        "has_limit",
                        "max_limit",
                    ],
                    include: {
                        model: DonorAppointmentInfo,
                        as: "donors",
                    },
                },
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                    include: {
                        model: AgencyCoordinator,
                        as: "coordinator",
                        attributes: ["contact_number"],
                        required: false,
                    },
                },
                {
                    model: Agency,
                    as: "agency",
                    attributes: [
                        "head_id",
                        "name",
                        "contact_number",
                        "address",
                        "barangay",
                        "city_municipality",
                        "province",
                        "agency_address",
                    ],
                },
            ],
        });

        const formattedEvents = formatSeqObj(events);

        return { success: true, data: formattedEvents };
    } catch (err) {
        logErrorToFile(err, "getAllOngoingEvents ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getAllAppointments() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const appointments = await DonorAppointmentInfo.findAll({
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    required: true,
                    include: {
                        model: BloodDonationEvent,
                        as: "event",
                    },
                },
                {
                    model: BloodDonationCollection,
                    as: "blood_collection",
                    required: false,
                    attributes: ["id", "volume"],
                },
                {
                    model: PhysicalExamination,
                    as: "physical_exam",
                    required: false,
                },
                {
                    model: Donor,
                    as: "donor",
                    include: [
                        {
                            model: User,
                            as: "user",
                        },
                        {
                            model: BloodType,
                            as: "blood_type",
                        },
                        {
                            model: Agency,
                            as: "agency",
                            attributes: ["name"],
                        },
                    ],
                },
            ],
            order: [
                [
                    { model: EventTimeSchedule, as: "time_schedule" },
                    { model: BloodDonationEvent, as: "event" },
                    "date",
                    "DESC",
                ],
            ],
        });

        const formattedAppointments = formatSeqObj(appointments);
        return {
            success: true,
            data: formattedAppointments,
        };
    } catch (err) {
        logErrorToFile(err, "getEventParticipants ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getAppointmentById(id) {
    const session = await auth();
    if (!session || !id) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const appointment = await DonorAppointmentInfo.findOne({
            where: { id },
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    required: true,
                    include: {
                        model: BloodDonationEvent,
                        as: "event",
                        order: [["title", "ASC"]],
                        include: {
                            model: User,
                            as: "requester",
                            attributes: ["name", "email", "image"],
                            include: {
                                model: AgencyCoordinator,
                                as: "coordinator",
                                attributes: ["contact_number"],
                            },
                        },
                    },
                },
                {
                    model: Donor,
                    as: "donor",
                    attributes: { exclude: ["updated_by"] },
                    include: [
                        {
                            model: User,
                            as: "user",
                        },
                        {
                            model: BloodType,
                            as: "blood_type",
                        },
                        {
                            model: Agency,
                            as: "agency",
                            attributes: [
                                "name",
                                "file_url",
                                "address",
                                "barangay",
                                "city_municipality",
                                "province",
                                "agency_address",
                            ],
                            include: {
                                model: User,
                                as: "head",
                                attributes: ["name", "email"],
                            },
                        },
                    ],
                },
                {
                    model: PhysicalExamination,
                    as: "physical_exam",
                    required: false,
                },
                {
                    model: BloodDonationCollection,
                    as: "blood_collection",
                    required: false,
                },
            ],
        });

        const formattedAppointment = formatSeqObj(appointment);
        return {
            success: true,
            data: formattedAppointment,
        };
    } catch (err) {
        logErrorToFile(err, "getParticipantById ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getEventDashboardData(eventId) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    if (!eventId) {
        return {
            success: false,
            message: "Event ID is required.",
        };
    }

    try {
        // Fetch event details
        const event = await BloodDonationEvent.findByPk(eventId, {
            include: [
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                    include: {
                        model: AgencyCoordinator,
                        as: "coordinator",
                        attributes: ["contact_number"],
                        required: false,
                    },
                },
                {
                    model: Agency,
                    as: "agency",
                },
                {
                    model: User,
                    as: "validator",
                    attributes: ["id", "name", "email", "image"],
                },
                {
                    model: User,
                    as: "editor",
                    attributes: ["id", "name", "email", "image"],
                },
            ],
        });

        if (!event) {
            return {
                success: false,
                message: "Event not found or inaccessible.",
            };
        }

        if (session?.user?.role_name !== "Admin") {
            if (
                session?.user?.role_name === "Organizer" &&
                event?.requester_id !== session?.user?.id
            ) {
                return {
                    success: false,
                    message: "You are not authorized to access this event.",
                };
            }

            if (
                session?.user?.role_name === "Agency Administrator" &&
                event?.agency?.head_id !== session?.user?.id
            ) {
                return {
                    success: false,
                    message: "You are not authorized to access this event.",
                };
            }
        }

        // Fetch all appointments for this event with related data
        const appointments = await DonorAppointmentInfo.findAll({
            where: {
                event_id: eventId,
            },
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    required: true,
                },
                {
                    model: BloodDonationCollection,
                    as: "blood_collection",
                    required: false,
                    attributes: ["id", "volume", "remarks", "createdAt"],
                },
                {
                    model: PhysicalExamination,
                    as: "physical_exam",
                    required: false,
                    attributes: [
                        "id",
                        "blood_pressure",
                        "pulse_rate",
                        "hemoglobin_level",
                        "weight",
                        "temperature",
                        "eligibility_status",
                        "deferral_reason",
                        "remarks",
                        "createdAt",
                    ],
                },
                {
                    model: Donor,
                    as: "donor",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "gender",
                                "email",
                                "image",
                                "full_name",
                            ],
                        },
                        {
                            model: BloodType,
                            as: "blood_type",
                            attributes: ["id", "blood_type"],
                        },
                        {
                            model: Agency,
                            as: "agency",
                            attributes: ["id", "name"],
                        },
                    ],
                },
            ],
            order: [
                [
                    { model: EventTimeSchedule, as: "time_schedule" },
                    "time_start",
                    "ASC",
                ],
            ],
        });

        const formattedAppointments = formatSeqObj(appointments);

        // Calculate statistics
        const totalRegistered = appointments.length;
        const pendingExamination = appointments.filter(
            (apt) =>
                !apt.physical_exam &&
                apt.status !== "no show" &&
                apt.status !== "cancelled"
        );
        const collected = appointments.filter((apt) => apt.blood_collection);
        const examined = appointments.filter((apt) => apt.physical_exam);
        const cancelled = appointments.filter(
            (apt) => apt.status === "cancelled"
        );
        const noShow = appointments.filter((apt) => apt.status === "no show");

        // Calculate success rate (collected / total registered)
        const successRate =
            totalRegistered > 0
                ? Math.round((collected / totalRegistered) * 100)
                : 0;

        // Calculate total blood volume collected
        const totalBloodVolume = collected?.reduce((total, apt) => {
            return total + (parseFloat(apt.blood_collection.volume) || 0);
        }, 0);

        // Group appointments by status
        const appointmentsByStatus = {
            pending: pendingExamination,
            examined: examined,
            collected: collected,
            cancelled: cancelled,
            noShow: noShow,
        };

        // Get deferred donors (those with physical examination but deferred)
        const deferredDonors = formattedAppointments.filter(
            (apt) =>
                apt?.physical_exam &&
                apt?.physical_exam?.eligibility_status !== "ACCEPTED"
        );

        const statistics = {
            total_registered: totalRegistered,
            pending_examination: pendingExamination?.length || 0,
            examined: examined?.length || 0,
            collected: collected?.length || 0,
            cancelled: cancelled?.length || 0,
            no_show: noShow?.length || 0,
            deferred: deferredDonors?.length || 0,
            success_rate: successRate,
            total_blood_volume: totalBloodVolume,
        };

        const formattedEvent = formatSeqObj(event);

        return {
            success: true,
            data: {
                event: formattedEvent,
                statistics: statistics,
                appointments: formatSeqObj(appointmentsByStatus),
                deferred_donors: formatSeqObj(deferredDonors),
                all_appointments: formattedAppointments,
            },
        };
    } catch (err) {
        logErrorToFile(err, "getEventDashboardData ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getEventAppointmentsByStatus(
    eventId,
    status,
    options = {}
) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    if (!eventId) {
        return {
            success: false,
            message: "Event ID is required.",
        };
    }

    if (!status) {
        return {
            success: false,
            message: "Status is required.",
        };
    }

    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        sortOrder = "DESC",
    } = options;
    const offset = (page - 1) * limit;

    try {
        // Build where clause
        let whereClause = { event_id: eventId };

        // Handle special status cases
        if (status === "deferred") {
            // For deferred, we need to check physical examination eligibility status
            whereClause = {
                event_id: eventId,
                "$physical_exam.eligibility_status$": {
                    [Op.ne]: "ACCEPTED",
                },
            };
        } else {
            whereClause.status = status;
        }

        // Build search conditions
        let searchConditions = {};
        if (search) {
            searchConditions = {
                [Op.or]: [
                    {
                        "$donor.user.name$": {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        "$donor.user.email$": {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        "$donor.blood_type.blood_type$": {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        "$donor.agency.name$": {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            };
        }

        // Combine where conditions
        const finalWhereClause = {
            ...whereClause,
            ...searchConditions,
        };

        const appointments = await DonorAppointmentInfo.findAndCountAll({
            where: finalWhereClause,
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    required: true,
                },
                {
                    model: BloodDonationCollection,
                    as: "blood_collection",
                    required: false,
                    attributes: ["id", "volume", "remarks", "createdAt"],
                },
                {
                    model: PhysicalExamination,
                    as: "physical_exam",
                    required: status === "deferred" ? true : false,
                    attributes: [
                        "id",
                        "blood_pressure",
                        "pulse_rate",
                        "hemoglobin_level",
                        "weight",
                        "temperature",
                        "eligibility_status",
                        "deferral_reason",
                        "remarks",
                        "createdAt",
                    ],
                },
                {
                    model: Donor,
                    as: "donor",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "email",
                                "image",
                                "full_name",
                            ],
                        },
                        {
                            model: BloodType,
                            as: "blood_type",
                            attributes: ["id", "blood_type"],
                        },
                        {
                            model: Agency,
                            as: "agency",
                            attributes: ["id", "name"],
                        },
                    ],
                },
            ],
            order: [
                [sortBy, sortOrder],
                [
                    { model: EventTimeSchedule, as: "time_schedule" },
                    "time_start",
                    "ASC",
                ],
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        const formattedAppointments = formatSeqObj(appointments.rows);

        return {
            success: true,
            data: {
                appointments: formattedAppointments,
                pagination: {
                    total: appointments.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(appointments.count / limit),
                },
            },
        };
    } catch (err) {
        logErrorToFile(err, "getEventAppointmentsByStatus ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getEventStatistics(eventId) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    if (!eventId) {
        return {
            success: false,
            message: "Event ID is required.",
        };
    }

    try {
        // Get all appointments for the event
        const appointments = await DonorAppointmentInfo.findAll({
            where: { event_id: eventId },
            include: [
                {
                    model: BloodDonationCollection,
                    as: "blood_collection",
                    required: false,
                    attributes: ["volume"],
                },
                {
                    model: PhysicalExamination,
                    as: "physical_exam",
                    required: false,
                    attributes: ["eligibility_status"],
                },
            ],
        });

        // Calculate basic counts
        const totalRegistered = appointments.length;
        const pendingExamination = appointments.filter(
            (apt) => !apt.physical_exam
        ).length;
        const collected = appointments.filter(
            (apt) => apt.status === "collected"
        ).length;
        const examinedOnly = appointments.filter(
            (apt) => apt.status === "examined"
        ).length;
        // Total examined includes both "examined" and "collected" statuses
        const examined = examinedOnly + collected;
        const cancelled = appointments.filter(
            (apt) => apt.status === "cancelled"
        ).length;
        const noShow = appointments.filter(
            (apt) => apt.status === "no show"
        ).length;

        // Calculate deferred count
        const deferred = appointments.filter(
            (apt) =>
                apt.physical_exam &&
                apt.physical_exam.eligibility_status !== "ACCEPTED"
        ).length;

        // Calculate success rate
        const successRate =
            totalRegistered > 0
                ? Math.round((collected / totalRegistered) * 100)
                : 0;

        // Calculate blood collection statistics
        const bloodCollections = appointments.filter(
            (apt) => apt.blood_collection
        );

        const totalBloodVolume = bloodCollections.reduce(
            (total, apt) =>
                total + (parseFloat(apt.blood_collection.volume) || 0),
            0
        );

        const averageBloodVolume =
            bloodCollections.length > 0
                ? Math.round(totalBloodVolume / bloodCollections.length)
                : 0;

        // Calculate time-based statistics
        const today = new Date();
        const todayAppointments = appointments.filter((apt) => {
            const aptDate = new Date(apt.time_schedule?.event?.date);
            return aptDate.toDateString() === today.toDateString();
        }).length;

        // Calculate status distribution percentages
        const statusDistribution = {
            pending:
                totalRegistered > 0
                    ? Math.round((pendingExamination / totalRegistered) * 100)
                    : 0,
            examined:
                totalRegistered > 0
                    ? Math.round((examined / totalRegistered) * 100)
                    : 0,
            collected:
                totalRegistered > 0
                    ? Math.round((collected / totalRegistered) * 100)
                    : 0,
            cancelled:
                totalRegistered > 0
                    ? Math.round((cancelled / totalRegistered) * 100)
                    : 0,
            no_show:
                totalRegistered > 0
                    ? Math.round((noShow / totalRegistered) * 100)
                    : 0,
            deferred:
                totalRegistered > 0
                    ? Math.round((deferred / totalRegistered) * 100)
                    : 0,
        };

        const statistics = {
            total_registered: totalRegistered,
            pending_examination: pendingExamination,
            examined: examined,
            collected: collected,
            cancelled: cancelled,
            no_show: noShow,
            deferred: deferred,
            success_rate: successRate,
            total_blood_volume: totalBloodVolume,
            average_blood_volume: averageBloodVolume,
            today_appointments: todayAppointments,
            status_distribution: statusDistribution,
            last_updated: new Date().toISOString(),
        };

        return {
            success: true,
            data: statistics,
        };
    } catch (err) {
        logErrorToFile(err, "getEventStatistics ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function updateAppointmentStatus(appointmentId, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;

    if (!appointmentId) {
        return {
            success: false,
            message: "Appointment ID is required.",
        };
    }

    // Validate required fields
    if (!formData.status) {
        return {
            success: false,
            message: "Status is required.",
        };
    }

    // Validate status values
    const validStatuses = [
        "registered",
        "cancelled",
        "no show",
        "examined",
        "collected",
        "deferred",
    ];
    if (!validStatuses.includes(formData.status)) {
        return {
            success: false,
            message: "Invalid status value.",
        };
    }

    try {
        // Find the appointment with related data
        const appointment = await DonorAppointmentInfo.findByPk(appointmentId, {
            include: [
                {
                    model: Donor,
                    as: "donor",
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
                    attributes: ["id", "title", "date"],
                },
                {
                    model: PhysicalExamination,
                    as: "physical_exam",
                    required: false,
                },
                {
                    model: BloodDonationCollection,
                    as: "blood_collection",
                    required: false,
                },
            ],
        });

        if (!appointment) {
            return {
                success: false,
                message: "Appointment not found.",
            };
        }

        const oldStatus = appointment.status;
        const newStatus = formData.status;

        // Validate status transitions
        const validTransitions = {
            registered: ["registered", "cancelled", "no show", "examined"],
            examined: ["collected", "deferred", "cancelled"],
            collected: [], // No further transitions from collected
            deferred: [], // No further transitions from deferred
            cancelled: [], // No further transitions from cancelled
            "no show": [], // No further transitions from no show
        };

        if (
            validTransitions[oldStatus] &&
            !validTransitions[oldStatus].includes(newStatus)
        ) {
            return {
                success: false,
                message: `Invalid status transition from "${oldStatus}" to "${newStatus}".`,
            };
        }

        // Special validation for status transitions
        if (newStatus === "examined" && !appointment.physical_exam) {
            return {
                success: false,
                message:
                    "Cannot mark as examined without physical examination record.",
            };
        }

        if (newStatus === "collected" && !appointment.physical_exam) {
            return {
                success: false,
                message:
                    "Cannot mark as collected without physical examination record.",
            };
        }

        if (
            newStatus === "collected" &&
            appointment.physical_exam?.eligibility_status !== "ACCEPTED"
        ) {
            return {
                success: false,
                message:
                    "Cannot mark as collected for donors who are not eligible (deferred).",
            };
        }

        if (newStatus === "collected" && !appointment.blood_collection) {
            return {
                success: false,
                message:
                    "Cannot mark as collected without blood collection record.",
            };
        }

        console.log("formData on updateAppointmentStatus", formData);
        // Prepare update data
        const updateData = {
            status: newStatus,
            updated_by: user.id,
        };

        // Add comments if provided
        if (formData.comments) {
            updateData.comments = formData.comments;
        }

        // If appointment is registered, allow updating other fields
        if (oldStatus === "registered") {
            if (typeof formData.collection_method !== "undefined") {
                updateData.collection_method = formData.collection_method;
            }
            if (typeof formData.donor_type !== "undefined") {
                updateData.donor_type = formData.donor_type;
            }
            if (typeof formData.patient_name !== "undefined") {
                updateData.patient_name = formData.patient_name;
            }
            if (typeof formData.relation !== "undefined") {
                updateData.relation = formData.relation;
            }
        }

        // Handle special cases for status updates
        if (newStatus === "cancelled" || newStatus === "no show") {
            // Update time schedule availability if appointment is cancelled or no-show
            const timeSchedule = await EventTimeSchedule.findByPk(
                appointment.time_schedule_id
            );
            if (
                timeSchedule &&
                timeSchedule.status === "closed" &&
                timeSchedule.has_limit
            ) {
                // Reopen the time slot if it was closed due to limit
                const currentAppointments = await DonorAppointmentInfo.count({
                    where: {
                        time_schedule_id: appointment.time_schedule_id,
                        status: {
                            [Op.notIn]: ["cancelled", "no show"],
                        },
                    },
                });

                if (currentAppointments < timeSchedule.max_limit) {
                    await timeSchedule.update({ status: "open" });
                }
            }
        }

        // Update the appointment
        await appointment.update(updateData);

        // Log audit trail
        await logAuditTrail({
            userId: user.id,
            controller: "adminEventAction",
            action: "UPDATE_APPOINTMENT_STATUS",
            details: `Appointment status updated from "${oldStatus}" to "${newStatus}" for donor ${appointment.donor.user.name} (ID: ${appointmentId}). Event: ${appointment.event.title} on ${appointment.event.date}.`,
        });

        // Return updated appointment data
        const updatedAppointment = await DonorAppointmentInfo.findByPk(
            appointmentId,
            {
                include: [
                    {
                        model: Donor,
                        as: "donor",
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: ["id", "name", "email"],
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
                    },
                    {
                        model: EventTimeSchedule,
                        as: "time_schedule",
                    },
                    {
                        model: PhysicalExamination,
                        as: "physical_exam",
                        required: false,
                    },
                    {
                        model: BloodDonationCollection,
                        as: "blood_collection",
                        required: false,
                    },
                ],
            }
        );

        const formattedAppointment = formatSeqObj(updatedAppointment);

        return {
            success: true,
            message: `Appointment status successfully updated from "${oldStatus}" to "${newStatus}".`,
            data: formattedAppointment,
        };
    } catch (err) {
        logErrorToFile(err, "updateAppointmentStatus ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}
