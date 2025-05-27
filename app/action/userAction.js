"use server";

import {
    userAccountCredentialSchema,
    userBasicInformationSchema,
    userSchema,
    userStatusSchema,
} from "@lib/zod/userSchema";
import { Role, sequelize, User } from "@lib/models";
import { redirect } from "next/navigation";
import { auth, signIn } from "@lib/auth";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { logErrorToFile } from "@lib/logger.server";
import { formatSeqObj } from "@lib/utils/object.utils";
import { Op } from "sequelize";
// import { formatPersonName } from "@lib/utils/string.utils";

export async function getUsers() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password", "email_verified"] },
            include: [
                {
                    model: Role,
                    as: "roles",
                    attributes: ["role_name"],
                    through: { attributes: [] },
                },
                {
                    model: User,
                    as: "creator",
                    attributes: { exclude: ["password", "email_verified"] },
                },
            ],
        });
        // if (users.length === 0) throw "No Users Found";

        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createUser(formData) {
    const session = await auth();
    if (session) {
        const { user } = session;
        formData.updated_by = user.id;
    }

    console.log("formData received on server", formData);
    const parsed = userSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Validation Error",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const roles = await Role.findAll({
        where: {
            id: {
                [Op.in]: data.role_ids,
            },
        },
        attributes: ["id", "role_name"],
    });

    if (roles.length !== data.role_ids.length) {
        throw {
            success: false,
            message: "Database Error: One or more roles not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const existingUser = await User.findOne({
            where: { email: data.email },
            transaction,
        });

        if (existingUser) {
            console.log("Existing User");
            throw {
                success: false,
                message: `The email is already associated with an existing account in the system. Please login then proceed to registration.`,
            };
        }

        /***********************"New User"*************************** */
        console.log("New User");

        const newUser = await User.create(data, { transaction });
        await newUser.addRoles(data.role_ids, { transaction });

        await transaction.commit();

        await newUser.reload({
            include: [
                {
                    model: sequelize.models.Role,
                    attributes: ["id", "role_name"],
                    as: "roles",
                    through: { attributes: [] },
                },
            ],
        });

        const userId = session ? session?.user?.id : newUser?.id;

        await logAuditTrail({
            userId: userId,
            controller: "users",
            action: "CREATE",
            details: `A new user has been successfully created. ID#: ${newUser.id}.`,
        });

        return { success: true, data: formatSeqObj(newUser) };
    } catch (err) {
        logErrorToFile(err, "CREATE USER");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}

export async function updateUser(formData) {
    console.log("updateUser!! formData", formData);
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;
    formData.updated_by = user.id;

    const parsed = userSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Validation Error",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    console.log("Parsed success: Validated Data", data);

    const roles = await Role.findAll({
        where: {
            id: {
                [Op.in]: data.role_ids,
            },
        },
        attributes: ["id", "role_name"],
    });

    if (roles.length !== data.role_ids.length) {
        throw {
            success: false,
            message: "Database Error: One or more roles not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(data.id, {
            transaction,
        });

        if (!user) {
            throw new Error("User Not Found");
        }
        console.log("Validated data for update", data);

        if (!data?.isChangePassword) {
            console.log("data?.isChangePassword", data?.isChangePassword);
            delete data.password;
        }

        const updatedUser = await user.update(data, { transaction });
        await updatedUser.setRoles(data.role_ids, { transaction });
        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "users",
            action: "UPDATE",
            details: `User has been successfully updated. ID#: ${updatedUser.id}`,
        });

        return { success: true, data: updatedUser.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "UPDATE USER");
        await transaction.rollback();

        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function updateUserBasicInfo(formData) {
    console.log("updateUserBasicInfo formData", formData);
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;
    formData.updated_by = user.id;

    const parsed = userBasicInformationSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Validation Error",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(data.id, {
            transaction,
        });

        if (!user) {
            throw new Error("User Not Found");
        }

        const updatedUser = await user.update(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "users",
            action: "updateUserBasicInfo",
            details: `User has been successfully updated. ID#: ${updatedUser.id}`,
        });

        return { success: true, data: updatedUser.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "updateUserBasicInfo");
        await transaction.rollback();

        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function updateUserCredentials(formData) {
    console.log("updateUserCredentials formData", formData);
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;
    formData.updated_by = user.id;

    const parsed = userAccountCredentialSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Validation Error",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(data.id, {
            transaction,
        });

        if (!user) {
            throw new Error("User Not Found");
        }

        const updatedUser = await user.update(data, { transaction });

        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "users",
            action: "UPDATE",
            details: `User has been successfully updated. ID#: ${updatedUser.id}`,
        });

        return { success: true, data: updatedUser.get({ plain: true }) };
    } catch (err) {
        console.log("Error in updateUserCredentials", err);
        logErrorToFile(err, "UPDATE USER");
        await transaction.rollback();
        if (err.name === "CredentialsSignin") {
            return {
                success: false,
                type: "server",
                message: "Invalid credentials provided.",
            };
        }

        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function updateUserStatus(formData) {
    console.log("updateUserStatus formData", formData);
    const session = await auth();
    console.log("session", session);
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;
    formData.updated_by = user.id;

    const parsed = userStatusSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Validation Error",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(data.id, {
            transaction,
        });

        if (!user) {
            throw new Error("User Not Found");
        }
        console.log("Validated data for update", data);
        const updatedUser = await user.update(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "users",
            action: "UPDATE USER STATUS",
            details: "User status has been successfully updated.",
        });
        return { success: true, data: updatedUser.get({ plain: true }) };
    } catch (err) {
        await transaction.rollback();

        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getUser(id) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!id) redirect("/users");

    try {
        const user = await User.findByPk(id, {
            attributes: [
                "id",
                "email",
                "image",
                "gender",
                "name",
                "first_name",
                "middle_name",
                "last_name",
                "full_name",
                "is_active",
            ],
            include: [
                {
                    attributes: ["id", "role_name"],
                    model: Role,
                    as: "roles",
                    through: { attributes: [] },
                },
            ],
        });

        if (!user) {
            redirect("/users");
        }

        return { success: true, data: user.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "GET USER ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}
