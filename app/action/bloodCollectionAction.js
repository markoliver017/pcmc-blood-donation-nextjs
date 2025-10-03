"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    Agency,
    BloodDonationCollection,
    BloodDonationEvent,
    BloodDonationHistory,
    BloodType,
    Donor,
    DonorAppointmentInfo,
    PhysicalExamination,
    sequelize,
    User,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { bloodCollectionchema } from "@lib/zod/bloodCollectionSchema";
import { format, startOfDay } from "date-fns";
import { Op } from "sequelize";

export async function storeUpdateBloodCollection(appointmentId, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;

    const parsed = bloodCollectionchema.safeParse(formData);

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

    const appointment = await DonorAppointmentInfo.findByPk(appointmentId, {
        include: [
            {
                model: PhysicalExamination,
                as: "physical_exam",
                where: { eligibility_status: "ACCEPTED" },
                required: true,
            },
            {
                model: Donor,
                as: "donor",
                attributes: [
                    "id",
                    "user_id",
                    "last_donation_date",
                    "donation_history_donation_date",
                ],
                required: true,
            },
            {
                model: BloodDonationEvent,
                as: "event",
                attributes: ["date"],
                required: true,
            },
        ],
    });

    if (!appointment) {
        return {
            success: false,
            message: `No appointment found with accepted physical examination with the provided ID: ${appointmentId} .`,
        };
    }

    if (
        appointment.status !== "collected" &&
        appointment.status !== "examined"
    ) {
        return {
            success: false,
            message: `You can not conduct a blood collection with the status of ${appointment.status}`,
        };
    }

    const transaction = await sequelize.transaction();

    const donor = appointment.donor;

    let lastBloodCollectionDate = null;
    const eventDate = startOfDay(new Date(appointment?.event?.date));
    console.log("eventDate", eventDate);

    if (donor?.last_donation_date) {
        lastBloodCollectionDate = startOfDay(
            new Date(donor?.last_donation_date)
        );
    }
    const isEventAfterEqualLastBloodCollectionDate = isNaN(
        lastBloodCollectionDate?.getTime()
    )
        ? true
        : eventDate.getTime() >= lastBloodCollectionDate?.getTime();

    try {
        const bloodCollection = await BloodDonationCollection.findOne({
            where: { appointment_id: appointmentId },
        });

        if (!bloodCollection) {
            data.appointment_id = appointment?.id;
            data.donor_id = appointment.donor_id;
            data.event_id = appointment.event_id;
            data.physical_examination_id = appointment?.physical_exam?.id;
            data.collector_id = user.id;
            await BloodDonationCollection.create(data, { transaction });
        } else {
            data.updated_by = user.id;
            await bloodCollection.update(data, { transaction });
        }

        if (isEventAfterEqualLastBloodCollectionDate) {
            await donor.update(
                {
                    last_donation_date: format(eventDate, "yyyy-MM-dd"),
                },
                { transaction }
            );
        }

        /* update donor appointment status */
        await appointment.update({ status: "collected" }, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "bloodDonationCollectionAction",
            action: "storeUpdateBloodCollection ",
            details: `The Donor's blood collection data has been successfully updated. With appointment ID#: ${appointmentId}.`,
        });

        return {
            success: true,
            message: `The Donor's blood collection data has been successfully updated.`,
            data: data,
        };
    } catch (err) {
        logErrorToFile(err, "storeUpdateBloodDonationCollection");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function getAllBloodCollections() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const collections = await BloodDonationCollection.findAll({
            include: [
                {
                    model: BloodDonationEvent,
                    as: "event",
                    attributes: ["date"],
                },
                {
                    model: Donor,
                    as: "donor",
                    include: [
                        {
                            model: BloodDonationHistory,
                            as: "blood_history",
                            attributes: [
                                "previous_donation_count",
                                "previous_donation_volume",
                            ],
                        },
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
        });

        const formattedData = formatSeqObj(collections);
        return {
            success: true,
            data: formattedData,
        };
    } catch (err) {
        logErrorToFile(err, "getAllBloodCollections ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getAllDonorsBloodCollections() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const collections = await Donor.findAll({
            where: {
                status: {
                    [Op.in]: ["activated", "deactivated"],
                },
            },
            include: [
                {
                    model: BloodDonationCollection,
                    as: "blood_collections",
                },
                {
                    model: BloodDonationHistory,
                    as: "blood_history",
                    attributes: [
                        "previous_donation_count",
                        "previous_donation_volume",
                    ],
                },
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "first_name",
                        "middle_name",
                        "last_name",
                        "full_name",
                        "email",
                        "image",
                        "gender",
                    ],
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
                        "address",
                        "barangay",
                        "city_municipality",
                        "province",
                        "contact_number",
                        "agency_address",
                    ],
                },
            ],
        });

        const formattedData = formatSeqObj(collections);
        return {
            success: true,
            data: formattedData,
        };
    } catch (err) {
        logErrorToFile(err, "getAllBloodCollections ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getDonorBloodCollections(donorId) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const collections = await Donor.findByPk(donorId, {
            include: [
                {
                    model: BloodDonationCollection,
                    as: "blood_collections",
                    include: [
                        {
                            where: { status: "collected" },
                            model: DonorAppointmentInfo,
                            as: "appointment",
                            attributes: [
                                "id",
                                "donor_type",
                                "collection_method",
                                "status",
                                "appointment_reference_id",
                            ],
                        },
                        {
                            model: PhysicalExamination,
                            as: "exam",
                            attributes: [
                                "id",
                                "eligibility_status",
                                "blood_pressure",
                                "pulse_rate",
                                "hemoglobin_level",
                                "weight",
                                "temperature",
                                "deferral_reason",
                                "remarks",
                            ],
                        },
                        {
                            model: BloodDonationEvent,
                            as: "event",
                            attributes: ["date", "title"],
                        },
                    ],
                },
                {
                    model: BloodDonationHistory,
                    as: "blood_history",
                    attributes: [
                        "previous_donation_count",
                        "previous_donation_volume",
                    ],
                },
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "first_name",
                        "middle_name",
                        "last_name",
                        "full_name",
                        "email",
                        "image",
                        "gender",
                    ],
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
                        "address",
                        "barangay",
                        "city_municipality",
                        "province",
                        "contact_number",
                        "agency_address",
                    ],
                },
            ],
        });

        const formattedData = formatSeqObj(collections);
        return {
            success: true,
            data: formattedData,
        };
    } catch (err) {
        logErrorToFile(err, "getAllBloodCollections ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}
