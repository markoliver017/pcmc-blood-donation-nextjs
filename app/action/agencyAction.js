// https://psgc.gitlab.io/api/regions/130000000 NCR
// https://psgc.gitlab.io/api/island-groups/luzon/provinces Luzon
"use server";

import { auth } from "@lib/auth";
import { Agency, sequelize, User } from "@lib/models";
import { agencySchema, agencyStatusSchema } from "@lib/zod/agencySchema";

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
    // await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;
    formData.head_id = user.id;

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

        const newAgency = await Agency.create(data, { transaction });

        await transaction.commit();

        return { success: true, data: newAgency.get({ plain: true }) };
    } catch (err) {
        console.error("error?????", err);
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}

export async function updateAgency(formData) {
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
        const agency = await Agency.findByPk(data.id, {
            transaction,
        });

        if (!agency) {
            throw new Error("Database Error: Agency ID Not found");
        }

        const updatedAgency = await agency.update(data, { transaction });

        await transaction.commit();

        return { success: true, data: updatedAgency.get({ plain: true }) };
    } catch (err) {
        console.error("error?????", err);
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}

export async function updateAgencyStatus(formData) {
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;
    formData.verified_by = user.id;

    const parsed = agencyStatusSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message:
                "Validation Error: Please try again. If the issue persists, contact your administrator for assistance.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    // return { success: true, data };

    const transaction = await sequelize.transaction();

    try {
        const agency = await Agency.findByPk(data.id, {
            transaction,
        });

        if (!agency) {
            throw new Error("Database Error: Agency ID Not found");
        }

        const updatedAgency = await agency.update(data, { transaction });

        await transaction.commit();

        const title = {
            rejected: "Rejection Successful",
        };
        const text = {
            rejected: "Agency application rejected successfully.",
        };

        return {
            success: true,
            data: updatedAgency.get({ plain: true }),
            title: title[data.status] || "Update!",
            text:
                text[data.status] || "Agency application updated successfully.",
        };
    } catch (err) {
        console.error("error?????", err);
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}
