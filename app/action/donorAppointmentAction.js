"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    Agency,
    AgencyCoordinator,
    BloodDonationCollection,
    BloodDonationEvent,
    BloodDonationHistory,
    BloodType,
    Donor,
    DonorAppointmentInfo,
    EventTimeSchedule,
    FeedbackResponse,
    PhysicalExamination,
    Role,
    ScreeningDetail,
    sequelize,
    User,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { bookAppointmentSchema } from "@lib/zod/bloodDonationSchema";
import { Op } from "sequelize";
import { getLastDonationDateDonated } from "./donorAction";
import moment from "moment";
import { appointmentDetailsSchema } from "@lib/zod/appointmentSchema";
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";
import { format, parse } from "date-fns";
import QRCode from "qrcode";

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
        include: [
            {
                model: PhysicalExamination,
                as: "last_donation_examination",
                attributes: ["id", "eligibility_status", "deferral_reason"],
                required: false,
            },
            {
                model: User,
                as: "user",
                attributes: [
                    "id",
                    "name",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "full_name",
                    "email",
                    "image",
                ],
            },
        ],
    });

    if (!donor) {
        return {
            success: false,
            message: "Database Error: Donor not found or inactive.",
        };
    }

    if (
        donor?.last_donation_examination?.eligibility_status ===
        "PERMANENTLY-DEFERRED"
    ) {
        return {
            success: false,
            message:
                "Sorry, you are permanently deferred. Please contact the organizer for more information.",
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
        attributes: ["id", "date", "title", "description", "requester_id"],
        include: [
            {
                model: EventTimeSchedule,
                as: "time_schedules",
                attributes: ["id", "time_start", "time_end"],
            },
            {
                model: Agency,
                as: "agency",
                attributes: [
                    "id",
                    "name",
                    "address",
                    "barangay",
                    "city_municipality",
                    "province",
                    "agency_address",
                ],
            },
        ],
    });

    if (!event) {
        return {
            success: false,
            message: "Database Error: Event not found or inactive.",
        };
    }

    let latestDonationDate = null;

    const latestDonation = await getLastDonationDateDonated(user?.id);
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
                message: `<p>You cannot book an appointment before <b>90 days</b> from your last donation date <b>(${moment(
                    latestDonationDate
                ).format("MMM DD, YYYY")})</b>.</p>`,
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

    if (!timeSchedule)
        return {
            success: false,
            message: "Database Error: Time Schedule not found or not active.",
        };

    const timeSchedTotalDonors = timeSchedule?.dataValues?.donorCount || 0;

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
            details: `New appointment has been successfully booked to User ID: ${user.id} Name: ${user?.name} (${user?.email}). Appointment ID#: ${newAppointment?.appointment_reference_id}`,
        });

        //  Notify all admins & organizer
        try {
            const adminRole = await Role.findOne({
                where: { role_name: "Admin" },
            });

            if (adminRole) {
                const adminUsers = await User.findAll({
                    include: [
                        {
                            model: Role,
                            as: "roles",
                            where: { id: adminRole.id },
                            through: { attributes: [] },
                        },
                    ],
                });
                const emailRecipients = [
                    ...adminUsers.map((a) => a.id),
                    event?.requester_id,
                ];
                if (adminUsers.length > 0) {
                    await sendNotificationAndEmail({
                        userIds: emailRecipients,
                        notificationData: {
                            subject: "New Appointment Booked",
                            message: `A new appointment to event (${event?.title}) has been booked by ${user.name} (${user.email}).`,
                            type: "APPOINTMENT",
                            reference_id: newAppointment.id,
                            created_by: user.id,
                        },
                    });
                }
            }
        } catch (err) {
            console.error("Admin notification failed:", err);
        }
        const to12h = (t) => format(parse(t, "HH:mm:ss", new Date()), "h:mm a");

        const verificationUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/verify-appointment/${newAppointment?.id}`;
        const qrCodeBuffer = await QRCode.toBuffer(verificationUrl);

        //notify donor through email
        try {
            await sendNotificationAndEmail({
                emailData: {
                    to: donor?.user?.email,
                    templateCategory: "DONOR_APPOINTMENT_CONFIRMATION",
                    attachments: [
                        {
                            filename: "qrcode.png",
                            content: qrCodeBuffer,
                            cid: "appointment_qr_code", // This CID must match the src in the email template
                        },
                    ],
                    templateData: {
                        donor_name: donor?.user?.full_name,
                        appointment_reference:
                            newAppointment?.appointment_reference_id,
                        appointment_date: event?.date,
                        appointment_time: event?.time_schedules?.[0]
                            ? `${to12h(
                                  event?.time_schedules[0].time_start
                              )} - ${to12h(event?.time_schedules[0].time_end)}`
                            : "TBD",
                        agency_name: event?.agency?.name,
                        agency_address: event?.agency?.agency_address,
                        event_name: event?.title,
                        event_description: event?.description,
                        appointment_qr_code: "cid:appointment_qr_code", // Use CID in template data
                        system_name: process.env.NEXT_PUBLIC_SYSTEM_NAME || "",
                        support_email:
                            process.env.NEXT_PUBLIC_SMTP_SUPPORT_EMAIL || "",
                        support_contact:
                            process.env.NEXT_PUBLIC_SMTP_SUPPORT_CONTACT || "",
                        domain_url: process.env.NEXT_PUBLIC_APP_URL || "",
                    },
                },
            });
        } catch (err) {
            console.error("Donor notification email failed:", err);
        }

        return {
            success: true,
            data: newAppointment.get({ plain: true }),
        };
    } catch (err) {
        console.log("bookDonorAppointment>>>>>>>>>>>>>>>>>>>>>", err);
        logErrorToFile(err, "BOOK DONOR APPOINTMENT");
        await transaction.rollback();

        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function cancelDonorAppointment(appointmentId, formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;

    const appointment = await DonorAppointmentInfo.findByPk(appointmentId, {
        include: {
            model: BloodDonationEvent,
            as: "event",
            attribute: ["id", "requester_id", "title", "date"],
        },
    });

    if (!appointment) {
        return {
            success: false,
            message:
                "Unable to find the appointment. It may be inactive or does not exist.",
        };
    }
    const dateNow = moment().format("YYYY-MM-DD");
    if (dateNow >= appointment.date) {
        return {
            success: false,
            message:
                "You cannot cancel an appointment on or after the scheduled event date.",
        };
    }

    const timeSchedule = await EventTimeSchedule.findByPk(
        formData.time_schedule_id,
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

    if (!timeSchedule)
        return {
            success: false,
            message: "Database Error: Time Schedule not found or not active.",
        };

    const timeSchedTotalDonors = timeSchedule?.dataValues?.donorCount || 0;

    const transaction = await sequelize.transaction();

    try {
        const updatedData = await appointment.update(formData, {
            transaction,
        });
        if (
            timeSchedule?.status == "closed" &&
            timeSchedule?.has_limit &&
            timeSchedule?.max_limit > timeSchedTotalDonors - 1
        ) {
            await timeSchedule.update({ status: "open" }, { transaction });
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donorAppointmentAction",
            action: "CANCEL DONOR APPOINTMENT",
            details: `The donor's appointment has been successfully cancelled. ID#: ${updatedData?.id}`,
        });

        //  Notify all admins & organizer
        try {
            const adminRole = await Role.findOne({
                where: { role_name: "Admin" },
            });

            if (adminRole) {
                const adminUsers = await User.findAll({
                    include: [
                        {
                            model: Role,
                            as: "roles",
                            where: { id: adminRole.id },
                            through: { attributes: [] },
                        },
                    ],
                });
                const emailRecipients = [
                    ...adminUsers.map((a) => a.id),
                    appointment?.event?.requester_id,
                ];
                if (adminUsers.length > 0) {
                    await sendNotificationAndEmail({
                        userIds: emailRecipients,
                        notificationData: {
                            subject: "Appointment Cancelled",
                            message: `The appointment to event (${appointment?.event?.title}) has been cancelled by ${user?.name} (${user?.email}).`,
                            type: "APPOINTMENT",
                            reference_id: appointment.id,
                            created_by: user.id,
                        },
                    });
                }
            }
        } catch (err) {
            console.error("Admin notification failed:", err);
        }

        return {
            success: true,
            message: `The donor's appointment has been successfully cancelled. ID#: ${updatedData?.id}`,
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
            attributes: {
                include: ["id", "status", "feedback_average"],
            },
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    include: {
                        model: BloodDonationEvent,
                        as: "event",
                        include: {
                            model: Agency,
                            as: "agency",
                        },
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
                        {
                            model: BloodDonationHistory,
                            as: "blood_history",
                            attributes: [
                                "previous_donation_count",
                                "previous_donation_volume",
                            ],
                        },
                    ],
                },
                {
                    model: PhysicalExamination,
                    as: "physical_exam",
                    attributes: [
                        "deferral_reason",
                        "eligibility_status",
                        "remarks",
                    ],
                },
                {
                    model: BloodDonationCollection,
                    as: "blood_collection",
                },
                {
                    model: FeedbackResponse,
                    as: "feedback_responses",
                    attributes: ["id"],
                },
                {
                    model: ScreeningDetail,
                    as: "screening_details",
                    attributes: ["id"],
                    required: false,
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
        const appointment = await DonorAppointmentInfo.findByPk(id, {
            include: [
                {
                    model: BloodDonationEvent,
                    as: "event",
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
                },
            ],
        });

        const formattedData = formatSeqObj(appointment);

        return { success: true, data: formattedData };
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
