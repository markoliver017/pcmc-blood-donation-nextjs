"use server";

import { userSchema } from "@lib/zod/userSchema";
import { sequelize, User } from "@lib/models";
import { redirect } from "next/navigation";

export async function createUser(state, formData) {
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
        const existing = await User.findOne({
            where: { email: data.email },
            transaction,
        });

        if (existing) {
            throw new Error("User already exists");
        }

        const newUser = await User.create(data, { transaction });

        await transaction.commit();

        return { success: true, data: newUser.get({ plain: true }) };
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
        const user = await User.findByApk(id);

        if (!user) {
            redirect("/users");
        }

        return { success: true, data: user.get({ plain: true }) };
    } catch (err) {
        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}
