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
import { bookAppointmentSchema } from "@lib/zod/bloodDonationSchema";
import { Op } from "sequelize";
import { getLastDonationDateBooked } from "./donorAction";
import moment from "moment";
import { appointmentDetailsSchema } from "@lib/zod/appointmentSchema";

export async function bookDonorAppointment(formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;

    const donor = await Donor.findOne({
        where: { user_id: user?.id, status: "activated" },
    });

    if (!donor) {
        return {
            success: false,
            message: "Database Error: Agency not found or inactive.",
        };
    }

    formData.donor_id = donor.id;

    const parsed = bookAppointmentSchema.safeParse(formData);

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

    const event = await BloodDonationEvent.findByPk(data?.event_id, {
        attributes: ["id", "date"],
    });

    if (!event) {
        return {
            success: false,
            message: "Database Error: Event not found or inactive.",
        };
    }

    let latestDonationDate = null;

    const latestDonation = await getLastDonationDateBooked(user?.id);
    if (latestDonation.success) {
        latestDonationDate = latestDonation?.data?.last_donation_date;
    }

    if (latestDonationDate) {
        console.log("latestDonationDate", latestDonationDate);
        const lastDate = moment(latestDonationDate).startOf("day");
        const nextEligibleDate = lastDate.clone().add(90, "days");

        const eventDate = moment(event?.date).startOf("day");
        console.log(
            "nextEligibleDate",
            nextEligibleDate.format("MMM DD, YYYY")
        );
        console.log("eventDate", eventDate.format("MMM DD, YYYY"));
        if (nextEligibleDate.isAfter(eventDate)) {
            return {
                success: false,
                message: `You cannot book an appointment before 90 days from your last donation date (${moment(
                    latestDonationDate
                ).format("MMM DD, YYYY")}).`,
            };
        }
    }

    const existingAppointment = await DonorAppointmentInfo.findOne({
        attributes: ["id"],
        where: {
            donor_id: donor?.id,
            event_id: data?.event_id,
            status: {
                [Op.not]: "cancelled",
            },
            // time_schedule_id: data?.time_schedule_id,
        },
    });

    if (existingAppointment) {
        return {
            success: false,
            message: `You have already booked an appointment for this event. Kindly go navigate to your "My Appointments" tab.`,
        };
    }

    const timeSchedule = await EventTimeSchedule.findByPk(
        data.time_schedule_id,
        {
            attributes: {
                include: [
                    [
                        sequelize.fn("COUNT", sequelize.col("donors.id")),
                        "donorCount",
                    ],
                ],
            },
            include: [
                {
                    model: DonorAppointmentInfo,
                    as: "donors",
                    attributes: [], // Don't fetch full donor records
                    required: false,
                    where: {
                        status: {
                            [Op.not]: "cancelled",
                        },
                    },
                },
            ],
            group: ["EventTimeSchedule.id"],
        }
    );

    const timeSchedTotalDonors = timeSchedule?.dataValues?.donorCount || 0;
    if (!timeSchedule)
        return {
            success: false,
            message: "Database Error: Time Schedule not found or not active.",
        };

    if (
        timeSchedule?.status !== "open" ||
        (timeSchedule?.has_limit &&
            timeSchedule?.max_limit <= timeSchedTotalDonors)
    ) {
        return {
            success: false,
            message:
                "This time schedule is either closed, not yet accepting applicants, or has already reached its maximum limit.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const newAppointment = await DonorAppointmentInfo.create(data, {
            transaction,
        });
        if (
            timeSchedule?.has_limit &&
            timeSchedule?.max_limit <= timeSchedTotalDonors + 1
        ) {
            await timeSchedule.update({ status: "closed" }, { transaction });
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donorAppointmentAction",
            action: "BOOK DONOR APPOINTMENT",
            details: `New appointment has been successfully booked to User ID: ${user.id}. ID#: ${newAppointment?.id}`,
        });

        return {
            success: true,
            data: newAppointment.get({ plain: true }),
        };
    } catch (err) {
        console.log(">>>>>>>>>>>>>>>>>>>>>", err);
        logErrorToFile(err, "BOOK DONOR APPOINTMENT");
        await transaction.rollback();

        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getBookedAppointmentsByDonor() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    const donor = await Donor.findOne({
        where: {
            user_id: user.id,
            status: "activated",
        },
    });

    if (!donor) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const appointments = await DonorAppointmentInfo.findAll({
            where: {
                donor_id: donor.id,
                status: {
                    [Op.not]: "cancelled",
                },
            },
        });

        const formattedappointments = formatSeqObj(appointments);

        return { success: true, data: formattedappointments };
    } catch (err) {
        logErrorToFile(err, "getBookedAppointmentsByDonor ERROR");
        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function getAllAppointmentsByDonor() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    const donor = await Donor.findOne({
        where: {
            user_id: user.id,
            status: "activated",
        },
    });

    if (!donor) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    try {
        const appointments = await DonorAppointmentInfo.findAll({
            where: {
                donor_id: donor.id,
            },
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    include: {
                        model: BloodDonationEvent,
                        as: "event",
                    },
                },
                {
                    model: Donor,
                    as: "donor",
                    include: [
                        {
                            model: Agency,
                            as: "agency",
                        },
                        {
                            model: BloodType,
                            as: "blood_type",
                        },
                    ],
                },
            ],
        });

        const formattedappointments = formatSeqObj(appointments);

        return { success: true, data: formattedappointments };
    } catch (err) {
        console.log("err>>>", err);
        logErrorToFile(err, "getAllAppointmentsByDonor ERROR");
        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

export async function getBookedAppointmentById(id) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    const donor = await Donor.findOne({
        where: {
            user_id: user.id,
            status: "activated",
        },
    });

    if (!donor) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const event = await BloodDonationEvent.findOne({
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
                        where: { id: id },
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

        const formattedEvent = formatSeqObj(event);

        return { success: true, data: formattedEvent };
    } catch (err) {
        logErrorToFile(err, "getBookedAppointmentById ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function updateAppointmentDetails(appointmentId, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    formData.updated_by = user.id;

    const parsed = appointmentDetailsSchema.safeParse(formData);

    if (!parsed.success) {
        const errorObj = parsed?.error?.flatten().fieldErrors;

        return {
            success: false,
            type: "validation",
            message:
                "Validation Error: Please try again. If the issue persists, contact your administrator for assistance.",
            errorObj,
            errorArr: Object.values(errorObj).flat(),
        };
    }

    // return parsed;

    const { data } = parsed;

    const appointment = await DonorAppointmentInfo.findByPk(appointmentId);

    if (!appointment) {
        return {
            success: false,
            message: "Database Error: Appointment ID was not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedAppointment = await appointment.update(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donorAppointmentAction",
            action: "donorAppointmentDetails",
            details: `The Donor's appointment details has been successfully updated. ID#: ${updatedAppointment.id}`,
        });

        return {
            success: true,
            message:
                "The Donor's appointment details has been successfully updated.",
        };
    } catch (err) {
        logErrorToFile(err, "donorAppointmentDetails");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}
