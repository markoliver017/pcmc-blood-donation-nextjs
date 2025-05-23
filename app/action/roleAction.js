"use server";
import { Role } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";

export async function getRoles() {
    try {
        const roles = await Role.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        if (!roles)
            throw "Database Error: Please contact your administrator! Code:roleAction/getRoles";

        return formatSeqObj(roles);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchRoles() {
    const url = new URL(`/api/roles`, process.env.NEXT_PUBLIC_DOMAIN);
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });
    return await response.json();
}
