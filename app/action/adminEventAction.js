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
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import {
    bloodDonationEventSchema,
    eventRegistrationStatusSchema,
    eventStatusSchema,
} from "@lib/zod/bloodDonationSchema";
import moment from "moment";
import { Op } from "sequelize";

export async function getAdminDashboard() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this page.",
        };
    }

    try {
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

        const eventCount = await BloodDonationEvent.count({
            where: {
                status: {
                    [Op.in]: ["approved"],
                },
            },
        });

        return {
            success: true,
            data: {
                donorCount,
                donationCount,
                agencyCount,
                eventCount,
            },
        };
    } catch (err) {
        logErrorToFile(err, "getHostCoordinatorsByStatus ERROR");
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
            action: "UPDATE EVENT STATUS",
            details: `Event status has been successfully updated. ID#: ${updatedEvent?.id}`,
        });

        const title = {
            rejected: "Rejection Successful",
            approved: "Status Update",
            cancelled: "Status Update",
        };
        const text = {
            rejected: "Blood donation event rejected successfully.",
            approved: "Blood donation event activated successfully.",
            cancelled: "Blood donation event cancelled successfully.",
        };

        return {
            success: true,
            data: updatedEvent.get({ plain: true }),
            title: title[data.status] || "Update!",
            text:
                text[data.status] ||
                "Blood donation event updated successfully.",
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
                    model: PhysicalExamination,
                    as: "physical_exam",
                    required: false,
                    attributes: ["id", "eligibility_status"],
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
