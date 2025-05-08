"use server";

import { Admin, File } from "@lib/models";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export async function getAdmin(email) {
    const admin = await Admin.findOne({
        where: { email },
        attributes: ["id", "first_name", "last_name", "gender", "email"],
        include: [
            {
                attributes: ["id", "url", "type"],
                model: File,
                required: false,
            },
        ],
    });
    if (!admin) return null;
    return admin.get({ plain: true });
}

export async function createAdmin(formData) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Handle form data here
        const data = Object.fromEntries(formData);
        console.log("createAdminnnnnnnnnnn", data);

        const file = formData.get("profile_picture");

        if (data.password && data.password !== data.passwordConfirmation) {
            throw new Error("Passwords do not match.");
        }
        const newAdmin = await Admin.create(data);

        let avatarUrl = "";
        if (newAdmin && file) {
            avatarUrl = await handleProfilePictureUpload(newAdmin, file);
        }

        return {
            error: null,
            success: true,
            isSubmitting: false,
            avatarUrl,
            details: newAdmin.get({ plain: true }),
        };
    } catch (error) {
        if (
            error.name === "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError"
        ) {
            const validationErrors = error.errors.map((err) => {
                if (error.name === "SequelizeUniqueConstraintError") {
                    return `${err.path} already exists!`;
                } else {
                    return err.message;
                }
            });

            return {
                error: null,
                success: false,
                isSubmitting: false,
                avatarUrl: "",
                details: validationErrors,
            };
        }

        return {
            error: error.message,
            isSubmitting: false,
            success: false,
            avatarUrl: "",
        };
    }
}

export async function updateAdmin(formData) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Handle form data here
        const data = Object.fromEntries(formData);
        console.log("updateAdminnnnnnnnnnn", data);
        const { id } = data;

        const file = formData.get("profile_picture"); // "avatar" is the name attribute

        const admin = await Admin.findByPk(id);

        if (!admin) {
            throw new Error("User not found.");
        }

        const updatedAdmin = await admin.update(data);

        let avatarUrl = "";
        if (updateAdmin && file) {
            avatarUrl = await handleProfilePictureUpload(admin, file);
        }

        return {
            error: null,
            success: true,
            isSubmitting: false,
            avatarUrl,
            details: updatedAdmin.get({ plain: true }),
        };
    } catch (error) {
        if (
            error.name === "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError"
        ) {
            const validationErrors = error.errors.map((err) => {
                if (error.name === "SequelizeUniqueConstraintError") {
                    return `${err.path} already exists!`;
                } else {
                    return err.message;
                }
            });

            return {
                error: null,
                success: false,
                isSubmitting: false,
                avatarUrl: "",
                details: validationErrors,
            };
        }

        return {
            error: error.message,
            isSubmitting: false,
            success: false,
            avatarUrl: "",
        };
    }
}

export async function changePassword(formData) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Handle form data here
        const data = Object.fromEntries(formData);
        console.log("changePasswwwwwwwwworrrd", data);
        const { id } = data;

        const admin = await Admin.findByPk(id);

        if (!admin) {
            throw new Error("User not found.");
        }

        const updatedAdmin = await admin.update(data);

        return {
            error: null,
            success: true,
            isSubmitting: false,
            details: updatedAdmin.get({ plain: true }),
        };
    } catch (error) {
        if (
            error.name === "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError"
        ) {
            const validationErrors = error.errors.map((err) => {
                if (error.name === "SequelizeUniqueConstraintError") {
                    return `${err.path} already exists!`;
                } else {
                    return err.message;
                }
            });

            return {
                error: null,
                success: false,
                isSubmitting: false,
                details: validationErrors,
            };
        }

        return {
            error: error.message,
            isSubmitting: false,
            success: false,
        };
    }
}

export async function handleProfilePictureUpload(admin, file) {
    const upload_type = "file_upload";
    let avatarUrl = "";
    console.log(file);
    if (
        file &&
        typeof file === "object" &&
        typeof file.arrayBuffer === "function" &&
        typeof file.name === "string"
    ) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}-${file.name}`;
        const uploadPath = path.join(
            process.cwd(),
            "public",
            "uploads",
            filename
        );

        await writeFile(uploadPath, buffer);

        avatarUrl = `/uploads/${filename}`;

        if (!admin.photo_id) {
            const newFile = await File.create({
                url: avatarUrl,
                table_name: "admins",
                type: upload_type,
            });

            admin.photo_id = newFile.id;
            await admin.save();
        } else {
            const existingFile = await File.findByPk(admin.photo_id);

            if (existingFile?.url) {
                const deletePath = path.join(
                    process.cwd(),
                    "public",
                    existingFile.url
                );

                if (fs.existsSync(deletePath)) {
                    fs.unlinkSync(deletePath);
                }
            }

            if (existingFile) {
                existingFile.url = avatarUrl;
                existingFile.type = upload_type;
                await existingFile.save();
            }
        }

        return avatarUrl;
    }
}
