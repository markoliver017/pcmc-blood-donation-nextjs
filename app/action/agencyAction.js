// https://psgc.gitlab.io/api/regions/130000000 NCR
// https://psgc.gitlab.io/api/island-groups/luzon/provinces Luzon
"use server";

import { Agency, sequelize, User } from "@lib/models";
import { agencySchema } from "@lib/zod/agencySchema";

export async function fetchAgencies() {
    try {
        const agencies = await Agency.findAll({
            // attributes: { exclude: ["password", "email_verified"] },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: { exclude: ["password", "email_verified"] },
                },
            ],
        });

        return JSON.parse(JSON.stringify(agencies));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchAgency(id) {
    try {
        const agency = await Agency.findByPk(id, {
            // attributes: { exclude: ["password", "email_verified"] },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: { exclude: ["password", "email_verified"] },
                },
            ],
        });

        return { success: true, data: agency.get({ plain: true }) };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createAgency(formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("formData received on server", formData);
    const parsed = agencySchema.safeParse(formData);

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

    const transaction = await sequelize.transaction();

    try {
        const existing = await Agency.findOne({
            where: { agency_email: data.agency_email },
            transaction,
        });

        if (existing) {
            throw new Error("Agency Email already exists");
        }
        data.head_id = "e768c245-4ae2-4089-ad67-d50a1b1d88e4";
        const newAgency = await Agency.create(data, { transaction });

        await transaction.commit();

        return { success: true, data: newAgency.get({ plain: true }) };
    } catch (err) {
        console.error("error?????", err);
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}
