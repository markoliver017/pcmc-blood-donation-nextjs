"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    BloodDonationHistory,
    Donor,
    sequelize,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";

import { bloodHistorySchema } from "@lib/zod/bloodHistorySchema";

export async function storeUpdatePrevDonation(donorId, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;

    formData.updated_by = user.id;

    const parsed = bloodHistorySchema.safeParse(formData);

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

    console.log("formData", formData);
    console.log("parsed data", data);

    const donor = await Donor.findByPk(donorId);
    if (!donor) {
        return {
            success: false,
            message: "Dono'r's Information was not found or inactive.",
        };
    }


    const transaction = await sequelize.transaction();

    try {
        const prevDonation = await BloodDonationHistory.findOne({
            where: { donor_id: donorId },
        });

        if (!prevDonation) {
            data.donor_id = donor?.id;
            data.user_id = donor?.user_id;
            await BloodDonationHistory.create(data, {
                transaction,
            });


        } else {
            await prevDonation.update(data, { transaction });

        }


        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "bloodDonationHistoryAction",
            action: "storeUpdatePrevDonation",
            details: `The Donor's previous donations has been successfully submitted. With donor ID#: ${donorId}.`,
        });

        return {
            success: true,
            message: `The Donor's previous donations has been successfully submitted.`,
            data: data,
        };
    } catch (err) {
        console.log("storeUpdatePrevDonation error", err);
        logErrorToFile(err, "storeUpdatePrevDonation");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function getDonorPrevDonation(donorId) {
    const session = await auth();

    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const donor = await Donor.findByPk(donorId);
    if (!donor) {
        return {
            success: false,
            message: "Dono'r's Information was not found or inactive.",
        };
    }

    try {
        const donation = await BloodDonationHistory.findOne({
            where: { donor_id: donorId }
        });

        const formattedData = formatSeqObj(donation);

        return { success: true, data: formattedData };

    } catch (err) {

        logErrorToFile(err, "getDonorPrevDonation ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}
