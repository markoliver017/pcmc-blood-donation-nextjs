"use server";
import { BloodType } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";

export async function getBloodTypes() {
    try {
        const bloodTypes = await BloodType.findAll();

        if (!bloodTypes) {
            return {
                success: false,
                message:
                    "Database Error: Please contact your administrator! Code:roleAction/getRoles",
            };
        }

        return formatSeqObj(bloodTypes);
    } catch (error) {
        console.error(error);
        return extractErrorMessage(error);
    }
}
