"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";

import { logErrorToFile } from "@lib/logger.server";
import { Donor, Role, sequelize, User } from "@lib/models";
import { donorRegistrationWithUser } from "@lib/zod/donorSchema";
import { Op } from "sequelize";

/* For client user registration */
export async function storeDonor(formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("formData received on server", formData);
    const parsed = donorRegistrationWithUser.safeParse(formData);

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

    const existingUser = await User.findOne({
        where: { email: data.email },
    });
    if (existingUser) {
        throw `The email is already associated with an existing account in the system.`;
    }

    const roles = await Role.findAll({
        where: {
            id: {
                [Op.in]: data.role_ids,
            },
        },
        attributes: ["id", "role_name"],
    });

    if (roles.length !== data.role_ids.length) {
        throw "Database Error: One or more roles not found.";
    }

    const transaction = await sequelize.transaction();

    try {
        const newUser = await User.create(data, { transaction });
        if (!newUser) {
            throw "Registration Failed: There was an error while trying to register a new user account!";
        }

        await newUser.addRoles(data.role_ids, { transaction });

        data.user_id = newUser.id;

        const newDonor = await Donor.create(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: newUser.id,
            controller: "agencies",
            action: "CREATE",
            details: `A new donor has been successfully created. Donor ID#: ${newDonor.id} with User account: ${newUser.id}`,
        });

        return { success: true, data: newDonor.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "CREATE DONOR");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}
