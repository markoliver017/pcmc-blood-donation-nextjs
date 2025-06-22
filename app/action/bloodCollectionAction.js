"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    Agency,
    BloodDonationCollection,
    BloodDonationEvent,
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

    console.log("formData", formData)
    console.log("parsed data", data)

    const appointment = await DonorAppointmentInfo.findByPk(appointmentId, {
        include: {
            model: PhysicalExamination,
            as: "physical_exam",
            where: { eligibility_status: "ACCEPTED" },
            required: true
        }
    });

    if (!appointment) {
        return {
            success: false,
            message: `No appointment found with the provided ID: ${appointmentId} .`,
        };
    }

    const transaction = await sequelize.transaction();

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