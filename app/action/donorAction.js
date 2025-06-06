"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";

import { logErrorToFile } from "@lib/logger.server";
import { Agency, BloodType, Donor, Role, sequelize, User } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";
import {
    bloodtypeSchema,
    donorRegistrationWithUser,
    donorSchema,
    donorStatusSchema,
} from "@lib/zod/donorSchema";
import { Op } from "sequelize";

/* For client user registration */
export async function storeDonor(formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("formData received on server", formData);
    if (!formData.blood_type_id) formData.blood_type_id = null;
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

    console.log("data parsed", data);

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

export async function getVerifiedDonors() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const donors = await Donor.findAll({
            where: {
                status: {
                    [Op.not]: "for approval",
                },
            },
            include: [
                {
                    model: User,
                    as: "user",
                },
                {
                    model: Agency,
                    as: "agency",
                },
                {
                    model: BloodType,
                    as: "blood_type",
                },
            ],
        });

        return formatSeqObj(donors);
    } catch (err) {
        logErrorToFile(err, "getVerifiedDonors ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getDonorsByStatus(status) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const donors = await Donor.findAll({
            where: { status },
            include: [
                {
                    model: User,
                    as: "user",
                },
                {
                    model: Agency,
                    as: "agency",
                },
                {
                    model: BloodType,
                    as: "blood_type",
                },
            ],
        });

        return formatSeqObj(donors);
    } catch (err) {
        logErrorToFile(err, "getCoordinatorsByStatus ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}
export async function getDonorById(id) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!id) throw "Invalid Donor Id provided!";

    try {
        const donor = await Donor.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                },
                {
                    model: Agency,
                    as: "agency",
                },
                {
                    model: BloodType,
                    as: "blood_type",
                },
            ],
        });

        return formatSeqObj(donor);
    } catch (err) {
        logErrorToFile(err, "getDonorById ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function updateDonor(formData) {
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";
    console.log("updateDonorStatus", formData);
    const { user } = session;
    formData.updated_by = user.id;

    const parsed = donorSchema.safeParse(formData);

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

    const donor = await Donor.findByPk(data.id);

    if (!donor) {
        throw new Error("Database Error: Donor ID was not found");
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedDonor = await donor.update(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donors",
            action: "UPDATE DONOR",
            details: `The Donor's profile has been successfully updated. ID#: ${updatedDonor.id}`,
        });

        return {
            success: true,
            data: updatedDonor.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE DONOR");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}

export async function updateDonorBloodType(formData) {
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;
    formData.updated_by = user.id;

    const parsed = bloodtypeSchema.safeParse(formData);

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

    const donor = await Donor.findByPk(data.id);

    if (!donor) {
        throw new Error("Database Error: Donor ID was not found");
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedDonor = await donor.update(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donors",
            action: "UPDATE DONOR BLOOD TYPE",
            details: `The Donor's blood type has been successfully updated. ID#: ${updatedDonor.id}`,
        });

        return {
            success: true,
            data: updatedDonor.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE DONOR");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}

export async function updateDonorStatus(formData) {
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";
    console.log("updateDonorStatus", formData);
    const { user } = session;
    formData.verified_by = user.id;

    const parsed = donorStatusSchema.safeParse(formData);

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

    const donor = await Donor.findByPk(data.id);

    if (!donor) {
        throw new Error("Database Error: Donor ID was not found");
    }

    const user_donor = await User.findByPk(donor.user_id, {
        include: [
            {
                where: { role_name: "Donor" },
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

    if (!user_donor) {
        throw new Error("Database Error: User with role donor was not found!");
    }

    const donor_role = user_donor?.roles[0].role;

    const transaction = await sequelize.transaction();

    try {
        const updatedDonor = await donor.update(data, {
            transaction,
        });

        const donor_status = updatedDonor.status == "activated";

        if (updatedDonor) {
            await donor_role.update(
                { is_active: donor_status },
                { transaction }
            );
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donors",
            action: "UPDATE DONOR STATUS",
            details: `The Donor status has been successfully updated. ID#: ${updatedDonor.id}`,
        });

        const title = {
            rejected: "Donor Rejected",
            activated: "Donor Activated",
            deactivated: "Donor Deactivated",
        };
        const text = {
            rejected: "The Donor was rejected successfully.",
            activated: "The Donor was activated successfully.",
            deactivated: "The Donor was deactivated successfully.",
        };

        return {
            success: true,
            data: updatedDonor.get({ plain: true }),
            title: title[data.status] || "Update!",
            text:
                text[data.status] || "Donor application updated successfully.",
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE DONOR STATUS");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}

export async function getDonorProfile() {
    const session = await auth();
    if (!session) throw "You are not authorized to access this page.";

    const { user } = session;

    try {
        /* For Agency Administrator */
        const profile = await User.findByPk(user?.id, {
            attributes: {
                exclude: [
                    "password",
                    "createdAt",
                    "updatedAt",
                    "updated_by",
                    "email_verified",
                ],
            },
            include: [
                {
                    model: Donor,
                    as: "donor",
                    required: false,
                    include: [
                        {
                            model: Agency,
                            as: "agency",
                            required: false,
                            include: {
                                model: User,
                                as: "head",
                                attributes: ["id", "name", "email", "image"],
                            },
                        },
                        {
                            model: BloodType,
                            as: "blood_type",
                        },
                    ],
                },
            ],
        });

        if (!profile) {
            throw "User not found or not activated.";
        }

        return formatSeqObj(profile);
    } catch (err) {
        logErrorToFile(err, "getHostCoordinatorsByStatus ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}
