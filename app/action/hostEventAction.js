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
import {
    bloodDonationEventSchema,
    timeScheduleSchema,
} from "@lib/zod/bloodDonationSchema";
import { addDays, format, subDays } from "date-fns";
import { ForeignKeyConstraintError, Op } from "sequelize";
// import { logAuditTrail } from "@lib/audit_trails.utils";

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
    } else if (user?.role_name === "Donor") {
        const response = await Donor.findOne({
            where: { user_id: user.id },
            attributes: ["agency_id"],
        });
        if (response) {
            return response.agency_id;
        }
    }
    return null;
}

/** AllEventCalendar , CreateEventForm */
export async function getAllEvents() {
    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                status: {
                    [Op.in]: ["for approval", "approved"],
                },
            },
            include: {
                model: Agency,
                as: "agency",
                attributes: ["id", "name", "file_url"],
            },
        });

        const formattedEvents = formatSeqObj(events);

        return formattedEvents;
    } catch (err) {
        logErrorToFile(err, "getAllEvents ERROR");
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
        return {
            success: false,
            message:
                "Unauthorized access: You are not allowed to access this resources.",
        };
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
        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
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
    const session = await auth();
    if (!session)
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };

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
        return {
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
    await new Promise((resolve) => setTimeout(resolve, 500));
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
            date: {
                [Op.eq]: data.date,
            },
        },
    });

    if (existingEvent) {
        return {
            success: false,
            message: `Event date conflict: Another event (${existingEvent?.title}) is already scheduled for this date.`,
        };
    }

    // Calculate the 90-day window
    const eventDate = new Date(data.date);
    const currentDate = new Date();

    if (eventDate < currentDate) {
        return {
            success: false,
            message: "You cannot book a donation in the past ☺.",
        };
    }

    const start = subDays(eventDate, 90);
    const end = addDays(eventDate, 89);

    // Query for any event whose date is between start and end
    const overlappingEvent = await BloodDonationEvent.findOne({
        where: {
            agency_id: data.agency_id,
            status: {
                [Op.in]: ["approved", "for approval"],
            },
            date: {
                [Op.between]: [start, end],
            },
        },
    });

    if (overlappingEvent) {
        return {
            success: false,
            message: `Event date conflict: Your agency has another event ("${
                overlappingEvent?.title
            }") scheduled on ${format(
                overlappingEvent?.date,
                "PP"
            )} Please choose a date that's at least 90 days before or after this event.`,
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
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

    console.log("parsed data", data);

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
            date: {
                [Op.eq]: data.date,
            },
        },
    });

    if (conflictingEvent) {
        return {
            successs: false,
            message: `Event date conflict: Another event (${conflictingEvent?.title}) is already scheduled for this date.`,
        };
    }

    // Calculate the 90-day window
    const eventDate = new Date(data.date);
    const currentDate = new Date();

    if (eventDate < currentDate) {
        return {
            success: false,
            message: "You cannot book a donation in the past ☺.",
        };
    }

    const start = subDays(eventDate, 90);
    const end = addDays(eventDate, 89);

    // Query for any event whose date is between start and end
    const overlappingEvent = await BloodDonationEvent.findOne({
        where: {
            id: { [Op.ne]: id },
            agency_id: data.agency_id,
            status: {
                [Op.in]: ["approved", "for approval"],
            },
            date: {
                [Op.between]: [start, end],
            },
        },
    });

    if (overlappingEvent) {
        return {
            success: false,
            type: "field_errors",
            message: `Event date conflict: Your agency has another event "${
                overlappingEvent?.title
            }" scheduled on ${format(
                overlappingEvent?.date,
                "PP"
            )}. Please choose a date that's at least 90 days before or after this event.`,
            errors: {
                date: `Event date conflict: Your agency has another event "${
                    overlappingEvent?.title
                }" scheduled on ${format(
                    overlappingEvent?.date,
                    "PP"
                )}. Please choose a date that's at least 90 days before or after this event.`,
            },
        };
    }

    const transaction = await sequelize.transaction();

    try {
        data.updated_by = user.id;
        await existingEvent.update(data, { transaction });

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
        console.log(err);
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

export async function updateEventTimeSchedule(id, formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    console.log(id, formData);
    const parsed = timeScheduleSchema.safeParse(formData);

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

    console.log("parsed data", data);

    const timeSchedule = await EventTimeSchedule.findByPk(id);

    if (!timeSchedule) {
        return {
            success: false,
            message: "Database Error: Time schedule not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        data.updated_by = user.id;
        await timeSchedule.update(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "events",
            action: "UPDATE EVENT TIME SCHEDULE",
            details: `Blood donation time schedule has been successfully updated. ID#: ${id}`,
        });

        return {
            success: true,
            data: timeSchedule.get({ plain: true }),
        };
    } catch (err) {
        console.log(err);
        logErrorToFile(err, "UPDATE EVENT TIME SCHEDULE");
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

// 1. Get all existing schedules for this event
// const existingSchedules = await EventTimeSchedule.findAll({
//     where: { blood_donation_event_id: id },
//     transaction,
// });
// // 2. Map for quick lookup
// const existingMap = new Map(
//     existingSchedules.map((s) => [s.id.toString(), s])
// );
// // 3. Prepare new data
// const newSchedules = data.time_schedules;
// // 4. Track IDs to keep
// const keepIds = [];
// // 5. Update or create
// for (const sched of newSchedules) {
//     if (sched.id && existingMap.has(sched.id.toString())) {
//         // Update existing
//         await EventTimeSchedule.update(
//             {
//                 ...sched,
//                 blood_donation_event_id: id,
//             },
//             {
//                 where: { id: sched.id },
//                 transaction,
//             }
//         );
//         keepIds.push(sched.id);
//     } else {
//         // Create new
//         const created = await EventTimeSchedule.create(
//             {
//                 ...sched,
//                 blood_donation_event_id: id,
//             },
//             { transaction }
//         );
//         keepIds.push(created.id);
//     }
// }
// // 6. Delete schedules not in keepIds
// const toDelete = existingSchedules
//     .filter((s) => !keepIds.includes(s.id))
//     .map((s) => s.id);

// if (toDelete.length > 0) {
//     await EventTimeSchedule.destroy({
//         where: { id: toDelete },
//         transaction,
//     });
// }

// await EventTimeSchedule.destroy({
//     where: { blood_donation_event_id: id },
//     transaction,
// });

// await EventTimeSchedule.bulkCreate(
//     data.time_schedules.map((row) => ({
//         blood_donation_event_id: id,
//         ...row,
//     })),
//     { transaction }
// );
