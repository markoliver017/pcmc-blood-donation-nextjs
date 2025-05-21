"use server";

import { userSchema, userStatusSchema } from "@lib/zod/userSchema";
import { Role, sequelize, User } from "@lib/models";
import { redirect } from "next/navigation";
import { auth } from "@lib/auth";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { logErrorToFile } from "@lib/logger.server";
import { formatSeqObj } from "@lib/utils/object.utils";
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

    const role = await Role.findByPk(data.role_id, {
        attributes: ['id', 'role_name']
    });

    if (!role) {
        throw {
            success: false,
            message: "Database Error: Role not found."
        }
    }

    const transaction = await sequelize.transaction();

    try {
        const existingUser = await User.findOne({
            where: { email: data.email },
            include: [
                {
                    model: sequelize.models.Role,
                    attributes: ['id', 'role_name'],
                    as: 'roles',
                    through: { attributes: [] }
                }
            ],
            transaction,
        });

        if (existingUser) {
            console.log("Existing User")
            const existingRoles = existingUser.roles.map((role) => role.id);
            const isExistingRole = existingRoles.includes(data.role_id);
            if (isExistingRole) {
                throw {
                    success: false,
                    message: `The email is already associated with an existing ${role?.role_name} role in the system.`
                }
            }

            // if the roles is not exists; proceed
            await existingUser.addRoles(data.role_id);
            await existingUser.reload();

            await transaction.commit();

            const userId = session ? session?.user?.id : existingUser?.id;
            await logAuditTrail({
                userId: userId,
                controller: "users",
                action: "CREATE",
                details: `A new user role (${role?.role_name}) has been successfully added to user ID#: ${existingUser.id}`,
            });

            return {
                success: true,
                data: {
                    user: existingUser.get({ plain: true }),
                    roles: existingRoles,
                    isExistingRole: isExistingRole
                }
            }
        }


        /***********************"New User"*************************** */
        console.log("New User")

        const newUser = await User.create(data, { transaction });
        await transaction.commit();

        await newUser.addRoles(data.role_id);
        await newUser.reload({
            include: [
                {
                    model: sequelize.models.Role,
                    attributes: ['id', 'role_name'],
                    as: 'roles',
                    through: { attributes: [] }
                }
            ]
        });

        const userId = session ? session?.user?.id : newUser?.id;

        await logAuditTrail({
            userId: userId,
            controller: "users",
            action: "CREATE",
            details: `A new user has been successfully created. ID#: ${newUser.id} with role ${role?.role_name}`,
        });

        return { success: true, data: formatSeqObj(newUser) };

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
