"use server";
import { BloodType } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";

export async function getBloodTypes() {
    try {
        const bloodTypes = await BloodType.findAll();

        if (!bloodTypes)
            throw "Database Error: Please contact your administrator! Code:roleAction/getRoles";

        return formatSeqObj(bloodTypes);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
