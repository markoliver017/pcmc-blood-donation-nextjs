"use server";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    Agency,
    AgencyCoordinator,
    BloodDonationEvent,
    BloodType,
    Donor,
    DonorAppointmentInfo,
    EventTimeSchedule,
    sequelize,
    User,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { bloodDonationEventSchema } from "@lib/zod/bloodDonationSchema";
import { ForeignKeyConstraintError, Op } from "sequelize";
// import { logAuditTrail } from "@lib/audit_trails.utils";

export async function getAgencyId() {
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

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

export async function getAllEvents() {
    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                status: {
                    [Op.in]: ["for approval", "approved"],
                },
            },
        });

        const formattedEvents = formatSeqObj(events);

        return formattedEvents;
    } catch (err) {
        logErrorToFile(err, "getAllEvents ERROR");
        throw {
            success: false,
            type: "server",
            message: err || "Unknown error",
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
        logErrorToFile(err, "getAllEventsByAgency ERROR");
        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function getAllEventsCount() {
    // await new Promise((resolve) => setTimeout(resolve, 500));

    const agency_id = await getAgencyId();

    if (!agency_id) {
        return {
            success: false,
            message: "Agency not found or inactive!",
        };
    }

    try {
        const events_count = await BloodDonationEvent.count({
            where: {
                agency_id,
                status: {
                    [Op.not]: "for approval",
                },
            },
        });

        return { success: true, data: events_count };
    } catch (err) {
        logErrorToFile(err, "getAllEventsCount ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}
export async function getForApprovalEventsByAgency(status) {
    // await new Promise((resolve) => setTimeout(resolve, 500));

    const agency_id = await getAgencyId();

    if (!agency_id) {
        throw "Unauthorized access: You are not allowed to access this resources.";
    }

    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                agency_id,
                status: {
                    [Op.eq]: status,
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

        return formattedEvents;
    } catch (err) {
        logErrorToFile(err, "getForApprovalEventsByAgency ERROR");
        throw {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function getEventsById(id) {
    if (!id) {
        throw "Incomplete data: Id is required.";
    }
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    try {
        const events = await BloodDonationEvent.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                    include: [
                        {
                            model: AgencyCoordinator,
                            as: "coordinator",
                            attributes: ["contact_number"],
                            required: false,
                        },
                    ],
                },
                {
                    model: Agency,
                    as: "agency",
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

        return formattedEvents;
    } catch (err) {
        logErrorToFile(err, "getEventsById ERROR");
        throw {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function getEventParticipants(eventId) {
    if (!eventId) {
        return {
            success: false,
            message: "Incomplete data: eventId is required.",
        };
    }
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const event = await BloodDonationEvent.findByPk(eventId);
    if (!event) {
        return {
            success: false,
            message: "Event ID was not found or inactive.",
        };
    }

    try {
        const donors = await DonorAppointmentInfo.findAll({
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    required: true,
                    where: {
                        blood_donation_event_id: eventId, // filter by the event ID
                    },
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
                    ],
                },
            ],
        });

        const formattedDonors = formatSeqObj(donors);
        const formattedEvent = formatSeqObj(event);
        return {
            success: true,
            data: {
                event: formattedEvent,
                donors: formattedDonors,
            },
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

export async function storeEvent(formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";
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
        throw "Database Error: Agency not found or inactive.";
    }

    const existingEvent = await BloodDonationEvent.findOne({
        where: {
            status: {
                [Op.in]: ["approved", "for approval"],
            },
            date: {
                [Op.eq]: data.date,
            },
            // [Op.or]: [
            //     {
            //         from_date: {
            //             [Op.between]: [data.from_date, data.to_date],
            //         },
            //     },
            //     {
            //         to_date: {
            //             [Op.between]: [data.from_date, data.to_date],
            //         },
            //     },
            //     {
            //         [Op.and]: [
            //             {
            //                 from_date: {
            //                     [Op.lte]: data.from_date,
            //                 },
            //             },
            //             {
            //                 to_date: {
            //                     [Op.gte]: data.to_date,
            //                 },
            //             },
            //         ],
            //     },
            // ],
        },
    });

    if (existingEvent) {
        throw new Error(
            "Event date conflict: Another event is already scheduled for this date."
        );
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
    if (!session) throw "You are not authorized to access this request.";
    const { user } = session;

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
        throw "Database Error: Agency not found or inactive.";
    }

    const existingEvent = await BloodDonationEvent.findByPk(id);

    if (!existingEvent) {
        throw "Event not found.";
    }

    const conflictingEvent = await BloodDonationEvent.findOne({
        where: {
            id: { [Op.ne]: id },
            status: {
                [Op.in]: ["approved", "for approval"],
            },
            date: {
                [Op.eq]: data.date,
            },
        },
    });

    if (conflictingEvent) {
        throw "Event date conflict: Another event is already scheduled for this date.";
    }

    const transaction = await sequelize.transaction();

    try {
        data.updated_by = user.id;
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

        let message = extractErrorMessage(err); // default fallback

        if (
            err instanceof ForeignKeyConstraintError ||
            err.original?.errno === 1451
        ) {
            message =
                "Unable to update the event because some time schedules already have donor appointments. Please remove those appointments first.";
        }

        return {
            success: false,
            type: "server",
            message,
        };
    }
}
