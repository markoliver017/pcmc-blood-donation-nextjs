"use server";

import { userSchema } from "@lib/zod/userSchema";
import { Role, sequelize, User } from "@lib/models";
import { redirect } from "next/navigation";
// import { formatPersonName } from "@lib/utils/string.utils";

export async function getUsers() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const users = await User.findAll({
            attributes: ["id", "name", "email"],
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: ["role_name"]
                }
            ]
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

        return { success: true, data: newUser.get({ plain: true }) };
    } catch (err) {
        console.error("error?????", err);
        await transaction.rollback();

        throw err.message || "Unknown error";

    }
}

export async function updateUser(state, formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("prev", state);
    console.log("formData", formData);
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

        return { success: true, data: updatedUser.get({ plain: true }) };
    } catch (err) {
        console.error("error?????", err);
        await transaction.rollback();

        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getUser(id) {
    if (!id) redirect("/users");

    try {
        const user = await User.findByPk(id, {
            attributes: [
                "id",
                "email",
                "image",
                "gender",
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
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}
