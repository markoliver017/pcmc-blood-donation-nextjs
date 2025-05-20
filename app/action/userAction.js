"use server";

import { userSchema, userStatusSchema } from "@lib/zod/userSchema";
import { Role, sequelize, User } from "@lib/models";
import { redirect } from "next/navigation";
import { auth } from "@lib/auth";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { logErrorToFile } from "@lib/logger.server";
// import { formatPersonName } from "@lib/utils/string.utils";

export async function getUsers() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password", "email_verified"] },
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: ["role_name"],
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
    await new Promise((resolve) => setTimeout(resolve, 500));
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

    const transaction = await sequelize.transaction();

    try {
        const existing = await User.findOne({
            where: { email: data.email },
            transaction,
        });

        if (existing) {
            throw new Error("Email already exists");
        }

        const newUser = await User.create(data, { transaction });

        await transaction.commit();

        const userId = session ? session?.user?.id : newUser?.id;
        await logAuditTrail({
            userId: userId,
            controller: "users",
            action: "CREATE",
            details: `A new user has been successfully created. ID#: ${newUser.id}`,
        });

        return { success: true, data: newUser.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "CREATE USER");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}

export async function updateUser(formData) {
    console.log("updateUser formData", formData);
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
                    as: "role",
                    required: false,
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
