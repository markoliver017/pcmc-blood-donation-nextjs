"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    Announcement,
    Agency,
    AgencyCoordinator,
    sequelize,
    User,
    Donor,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import {
    // announcementSchema,
    createAnnouncementSchema,
    updateAnnouncementSchema,
} from "@lib/zod/announcementSchema";

import { Op } from "sequelize";
import { handleValidationError } from "@lib/utils/validationErrorHandler";

export async function fetchAnnouncements() {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;
        let whereClause = {};
        let includeClause = [
            {
                model: User,
                as: "user",
                attributes: { exclude: ["password", "email_verified"] },
            },
        ];

        // Role-based data access
        if (user.role_name === "Admin") {
            // Admin can see all announcements
            includeClause.push({
                model: Agency,
                as: "agency",
                attributes: ["id", "name"],
            });
        } else if (user.role_name === "Agency Administrator") {
            // Agency users can see their agency's announcements and public ones
            const agency = await Agency.findOne({
                where: { head_id: user.id },
            });

            if (agency) {
                whereClause = {
                    [Op.or]: [{ agency_id: agency.id }, { is_public: true }],
                };
            } else {
                // If no agency found, only show public announcements
                whereClause = { is_public: true };
            }
        } else if (user.role_name === "Organizer") {
            // Organizers (Agency Coordinators) can see their agency's announcements and public ones
            const coordinator = await AgencyCoordinator.findOne({
                where: { user_id: user.id, status: "activated" },
                include: [
                    {
                        model: Agency,
                        as: "agency",
                        attributes: ["id", "name"],
                    },
                ],
            });

            if (coordinator && coordinator.agency) {
                whereClause = {
                    [Op.or]: [
                        { agency_id: coordinator.agency.id },
                        { is_public: true },
                    ],
                };
            } else {
                // If no agency found, only show public announcements
                whereClause = { is_public: true };
            }
        } else {
            // Other roles can only see public announcements
            whereClause = { is_public: true };
        }

        const announcements = await Announcement.findAll({
            where: whereClause,
            include: includeClause,
            order: [["createdAt", "DESC"]],
        });

        return { success: true, data: formatSeqObj(announcements) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function fetchAnnouncement(id) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;
        let whereClause = { id };

        // Role-based access control
        if (user.role_name !== "Admin") {
            if (user.role_name === "Agency Administrator") {
                const agency = await Agency.findOne({
                    where: { head_id: user.id },
                });

                if (agency) {
                    whereClause = {
                        id,
                        [Op.or]: [
                            { agency_id: agency.id },
                            { is_public: true },
                        ],
                    };
                } else {
                    whereClause = { id, is_public: true };
                }
            } else if (user.role_name === "Organizer") {
                const coordinator = await AgencyCoordinator.findOne({
                    where: { user_id: user.id, status: "activated" },
                    include: [
                        {
                            model: Agency,
                            as: "agency",
                            attributes: ["id", "name"],
                        },
                    ],
                });

                if (coordinator && coordinator.agency) {
                    whereClause = {
                        id,
                        [Op.or]: [
                            { agency_id: coordinator.agency.id },
                            { is_public: true },
                        ],
                    };
                }
            } else if (user.role_name === "Donor") {
                const donor = await Donor.findOne({
                    where: { user_id: user.id, status: "activated" },
                });

                if (donor && donor.agency) {
                    whereClause = {
                        id,
                        [Op.or]: [
                            { agency_id: donor.agency_id },
                            { is_public: true },
                        ],
                    };
                }
            } else {
                whereClause = { id, is_public: true };
            }
        }

        const announcement = await Announcement.findOne({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: { exclude: ["password", "email_verified"] },
                },
                {
                    model: Agency,
                    as: "agency",
                    attributes: [
                        "id",
                        "name",
                        "agency_address",
                        "address",
                        "barangay",
                        "city_municipality",
                        "province",
                        "file_url",
                    ],
                },
            ],
        });

        if (!announcement) {
            return {
                success: false,
                message:
                    "Announcement not found or you don't have permission to view it.",
            };
        }

        return { success: true, data: formatSeqObj(announcement) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function storeAnnouncement(formData) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        // Check if user has permission to create announcements
        if (
            !["Admin", "Agency Administrator", "Organizer"].includes(
                user.role_name
            )
        ) {
            return {
                success: false,
                message: "You are not authorized to create announcements.",
            };
        }

        console.log("storeAnnouncement formData received on server", formData);

        if (user.role_name === "Agency Administrator") {
            const agency = await Agency.findOne({
                where: { head_id: user.id },
            });

            if (!agency) {
                return {
                    success: false,
                    message:
                        "You must be associated with an agency to create announcements.",
                };
            }

            formData.agency_id = agency.id;
        } else if (user.role_name === "Organizer") {
            const coordinator = await AgencyCoordinator.findOne({
                where: { user_id: user.id, status: "activated" },
                include: [
                    {
                        model: Agency,
                        as: "agency",
                        attributes: ["id", "name"],
                    },
                ],
            });

            if (!coordinator || !coordinator.agency) {
                return {
                    success: false,
                    message:
                        "You must be an activated coordinator associated with an agency to create announcements.",
                };
            }

            formData.agency_id = coordinator.agency.id;
        }

        const parsed = createAnnouncementSchema.safeParse(formData);

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

        // Auto-assign user_id and agency_id based on role
        data.user_id = user.id;

        const transaction = await sequelize.transaction();

        try {
            const newAnnouncement = await Announcement.create(data, {
                transaction,
            });

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "announcements",
                action: "CREATE",
                details: `A new announcement has been successfully created. ID#: ${newAnnouncement.id} (${newAnnouncement.title}) by ${user?.name} (${user?.email})`,
            });

            return {
                success: true,
                data: newAnnouncement.get({ plain: true }),
                message: "Announcement created successfully.",
            };
        } catch (err) {
            logErrorToFile(err, "CREATE ANNOUNCEMENT");
            await transaction.rollback();

            return handleValidationError(err);
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function updateAnnouncement(id, formData) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        console.log("updateAnnouncement formData received on server", formData);
        const parsed = updateAnnouncementSchema.safeParse(formData);

        console.log("updateAnnouncement parse received on server", parsed);

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

        // Check if user has permission to update this announcement
        const existingAnnouncement = await Announcement.findByPk(id, {
            include: [
                {
                    model: Agency,
                    as: "agency",
                    attributes: ["id", "name"],
                },
            ],
        });

        if (!existingAnnouncement) {
            return {
                success: false,
                message: "Announcement not found.",
            };
        }

        // Authorization check
        if (user.role_name === "Admin") {
            // Admin can update any announcement
        } else if (user.role_name === "Agency Administrator") {
            const agency = await Agency.findOne({
                where: { head_id: user.id },
            });

            if (!agency || existingAnnouncement.agency_id !== agency.id) {
                return {
                    success: false,
                    message:
                        "You are not authorized to update this announcement.",
                };
            }
        } else if (user.role_name === "Organizer") {
            const coordinator = await AgencyCoordinator.findOne({
                where: { user_id: user.id, status: "activated" },
                include: [
                    {
                        model: Agency,
                        as: "agency",
                        attributes: ["id", "name"],
                    },
                ],
            });

            if (
                !coordinator ||
                !coordinator.agency ||
                existingAnnouncement.agency_id !== coordinator.agency.id
            ) {
                return {
                    success: false,
                    message:
                        "You are not authorized to update this announcement.",
                };
            }
        } else {
            return {
                success: false,
                message: "You are not authorized to update announcements.",
            };
        }

        const transaction = await sequelize.transaction();

        try {
            const updatedAnnouncement = await existingAnnouncement.update(
                data,
                { transaction }
            );

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "announcements",
                action: "UPDATE",
                details: `Announcement has been successfully updated. ID#: ${updatedAnnouncement.id} (${updatedAnnouncement.title}) by ${user?.name} (${user?.email})`,
            });

            return {
                success: true,
                data: updatedAnnouncement.get({ plain: true }),
                message: "Announcement updated successfully.",
            };
        } catch (err) {
            logErrorToFile(err, "UPDATE ANNOUNCEMENT");
            await transaction.rollback();

            return handleValidationError(err);
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function deleteAnnouncement(id) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        // Check if user has permission to delete this announcement
        const existingAnnouncement = await Announcement.findByPk(id, {
            include: [
                {
                    model: Agency,
                    as: "agency",
                    attributes: ["id", "name"],
                },
            ],
        });

        if (!existingAnnouncement) {
            return {
                success: false,
                message: "Announcement not found.",
            };
        }

        // Authorization check
        if (user.role_name === "Admin") {
            // Admin can delete any announcement
        } else if (user.role_name === "Agency Administrator") {
            const agency = await Agency.findOne({
                where: { head_id: user.id },
            });

            if (!agency || existingAnnouncement.agency_id !== agency.id) {
                return {
                    success: false,
                    message:
                        "You are not authorized to delete this announcement.",
                };
            }
        } else if (user.role_name === "Organizer") {
            const coordinator = await AgencyCoordinator.findOne({
                where: { user_id: user.id, status: "activated" },
                include: [
                    {
                        model: Agency,
                        as: "agency",
                        attributes: ["id", "name"],
                    },
                ],
            });

            if (
                !coordinator ||
                !coordinator.agency ||
                existingAnnouncement.agency_id !== coordinator.agency.id
            ) {
                return {
                    success: false,
                    message:
                        "You are not authorized to delete this announcement.",
                };
            }
        } else {
            return {
                success: false,
                message: "You are not authorized to delete announcements.",
            };
        }

        const transaction = await sequelize.transaction();

        try {
            await existingAnnouncement.destroy({ transaction });

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "announcements",
                action: "DELETE",
                details: `Announcement has been successfully deleted. ID#: ${existingAnnouncement.id} (${existingAnnouncement.title})`,
            });

            return {
                success: true,
                message: "Announcement deleted successfully.",
            };
        } catch (err) {
            logErrorToFile(err, "DELETE ANNOUNCEMENT");
            await transaction.rollback();

            return { success: false, message: extractErrorMessage(err) };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

// Helper function to get agency ID for current user
export async function getAgencyId() {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        if (user.role_name === "Agency Administrator") {
            const agency = await Agency.findOne({
                where: { head_id: user.id },
            });

            if (agency) {
                return { success: true, data: agency.id };
            }
        } else if (user.role_name === "Organizer") {
            const coordinator = await AgencyCoordinator.findOne({
                where: { user_id: user.id, status: "activated" },
                include: [
                    {
                        model: Agency,
                        as: "agency",
                        attributes: ["id", "name"],
                    },
                ],
            });

            if (coordinator && coordinator.agency) {
                return { success: true, data: coordinator.agency.id };
            }
        }

        return { success: false, message: "No agency found for current user." };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}
