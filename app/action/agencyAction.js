// https://psgc.gitlab.io/api/regions/130000000 NCR
// https://psgc.gitlab.io/api/island-groups/luzon/provinces Luzon
"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { Agency, Role, sequelize, User } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";
import { agencySchema, agencyStatusSchema } from "@lib/zod/agencySchema";

export async function fetchAgencies() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const agencies = await Agency.findAll({
            // attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: { exclude: ["password", "email_verified"] },
                },
                {
                    model: User,
                    as: "creator",
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
                    attributes: { exclude: ["password", "email_verified", "prefix", "suffix", "createdAt", "updatedAt", "updated_by"] },
                },
            ],
        });

        return { success: true, data: formatSeqObj(agency) };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createAgency(formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;

    const role = await Role.findOne({
        where: { role_name: "Agency Administrator" },
        attributes: ["id", "role_name"],
    });

    if (!role) {
        throw "Database Error: Agency Administrator role is not set on the system.";
    }

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

    const userData = await User.findByPk(user.id, {
        include: [
            {
                model: sequelize.models.Role,
                attributes: ["id", "role_name"],
                as: "roles",
                through: { attributes: [] },
            },
            {
                model: sequelize.models.Agency,
                attributes: ["id", "name"],
                as: "headedAgency",
            },
        ],
    });

    if (!userData) {
        throw `User session expired: The user's session might have timed out or been invalidated.`;
    }

    if (userData.headedAgency) {
        throw `Your account is currently linked to partner agency "${userData.headedAgency.name}".`;
    }

    const existingRoles = userData?.roles.map((role) => role.id) || [];
    const isExistingRole = existingRoles.includes(role.id);

    const transaction = await sequelize.transaction();

    try {
        if (!isExistingRole) {
            await userData.addRoles(role.id);
            await logAuditTrail({
                userId: userData.id,
                controller: "agency_action",
                action: "CREATE",
                details: `A new user role (${role?.role_name}) has been successfully added to user ID#: ${userData.id}`,
            });
            await userData.reload();
        }

        const newAgency = await Agency.create(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "agencies",
            action: "CREATE",
            details: `A new agency has been successfully created. ID#: ${newAgency.id}`,
        });

        return { success: true, data: newAgency.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "CREATE AGENCY");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}

export async function updateAgency(formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("formData received on server", formData);
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;
    formData.updated_by = user.id;

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

        await logAuditTrail({
            userId: user.id,
            controller: "agencies",
            action: "UPDATE",
            details: `Agency has been successfully updated. ID#: ${updatedAgency.id}`,
        });

        return { success: true, data: updatedAgency.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "UPDATE AGENCY");

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

    const agency = await Agency.findByPk(data.id);

    if (!agency) {
        throw new Error("Database Error: Agency ID was not found");
    }

    const agency_head = await User.findByPk(agency.head_id, {
        include: [
            {
                where: { role_name: "Agency Administrator" },
                model: Role,
                attributes: ["id", "role_name"],
                as: "roles",
                required: true,
                through: {
                    attributes: ["id", "is_active"],
                    as: "role",
                },
            },
        ],
    });

    if (!agency_head) {
        throw new Error("Database Error: Agency Head was Not found");
    }

    const agency_head_role = agency_head?.roles[0].role;

    const transaction = await sequelize.transaction();

    try {

        const updatedAgency = await agency.update(data, { transaction });

        const agency_head_status = updatedAgency.status == "activated";

        if (updatedAgency) {
            await agency_head_role.update({ is_active: agency_head_status }, { transaction })
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "agencies",
            action: "UPDATE AGENCY STATUS",
            details: `User status has been successfully updated. ID#: ${updatedAgency.id}`,
        });

        const title = {
            rejected: "Rejection Successful",
            activated: "Status Update",
            deactivated: "Status Update",
        };
        const text = {
            rejected: "Agency application rejected successfully.",
            activated: "The agency activated successfully.",
            deactivated: "The agency deactivated successfully.",
        };

        return {
            success: true,
            data: updatedAgency.get({ plain: true }),
            title: title[data.status] || "Update!",
            text:
                text[data.status] || "Agency application updated successfully.",
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE AGENCY STATUS");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}
