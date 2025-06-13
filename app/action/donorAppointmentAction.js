"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    Donor,
    DonorAppointmentInfo,
    EventTimeSchedule,
    sequelize,
} from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";
import { bookAppointmentSchema } from "@lib/zod/bloodDonationSchema";
import { Op } from "sequelize";

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

    const existingAppointment = await DonorAppointmentInfo.findOne({
        attributes: ["id"],
        where: {
            donor_id: donor?.id,
            status: {
                [Op.not]: "cancelled",
            },
            // time_schedule_id: data?.time_schedule_id,
        },
        include: {
            model: EventTimeSchedule,
            as: "time_schedule",
            where: {
                blood_donation_event_id: data?.event_id,
            },
        },
    });

    if (existingAppointment) {
        return {
            success: false,
            message: `You have already booked an appointment for this event. Kindly go navigate to your "My Appointments" tab.`,
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const newAppointment = await DonorAppointmentInfo.create(data, {
            transaction,
        });

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
            message: err || "Unknown error",
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
