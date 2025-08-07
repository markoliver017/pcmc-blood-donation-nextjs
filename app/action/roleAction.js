"use server";
import { Role } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";

export async function getRoles() {
    try {
        const roles = await Role.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        if (!roles) {
            return {
                success: false,
                message:
                    "Database Error: Please contact your administrator! Code:roleAction/getRoles",
            };
        }

        return formatSeqObj(roles);
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: extractErrorMessage(error),
        };
    }
}

export async function fetchRoles() {
    const url = new URL(`/api/roles`, process.env.INTERNAL_API_URL);
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });
    return await response.json();
}
