"use server";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { Agency, AgencyCoordinator, User } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { Op } from "sequelize";

export async function getVerifiedCoordinatorsByAgency() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this page.",
        };
    }

    const { user } = session;

    try {
        /* For Agency Administrator */
        let agency = await Agency.findOne({
            where: {
                head_id: user.id,
                status: "activated",
            },
        });

        /* For Organizer */
        if (user?.role_name == "Organizer") {
            agency = await AgencyCoordinator.findOne({
                where: {
                    user_id: user.id,
                    status: "activated",
                },
            });
        }

        if (!agency) {
            return {
                success: false,
                message: "Agency not found or not activated.",
            };
        }

        const coordinators = await AgencyCoordinator.findAll({
            where: {
                agency_id: agency.id,
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
            ],
        });

        return formatSeqObj(coordinators);
    } catch (err) {
        logErrorToFile(err, "getVerifiedCoordinators ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

/* for approval for head agency */
export async function getHostCoordinatorsByStatus(status) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;

    try {
        /* For Agency Administrator */
        let agency = await Agency.findOne({
            where: {
                head_id: user.id,
                status: "activated",
            },
        });

        /* For Organizer */
        if (user?.role_name == "Organizer") {
            agency = await AgencyCoordinator.findOne({
                where: {
                    user_id: user.id,
                    status: "activated",
                },
            });
        }

        if (!agency) {
            return {
                success: false,
                message: "Agency not found or not activated.",
            };
        }
        const coordinators = await AgencyCoordinator.findAll({
            where: { status, agency_id: agency.id },
            include: [
                {
                    model: User,
                    as: "user",
                },
                {
                    model: Agency,
                    as: "agency",
                },
            ],
        });

        return formatSeqObj(coordinators);
    } catch (err) {
        logErrorToFile(err, "getHostCoordinatorsByStatus ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getOrganizerProfile() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

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
                    model: Agency,
                    as: "headedAgency",
                    required: false,
                    include: {
                        model: User,
                        as: "head",
                        attributes: ["id", "name", "email", "image"],
                    },
                },
                {
                    model: AgencyCoordinator,
                    as: "coordinator",
                    attributes: [
                        "id",
                        "status",
                        "contact_number",
                        "comments",
                        "remarks",
                    ],
                    where: { status: "activated" },
                    required: false,
                    include: {
                        model: Agency,
                        as: "agency",
                        include: {
                            model: User,
                            as: "head",
                            attributes: ["id", "name", "email", "image"],
                        },
                    },
                },
            ],
        });

        /* For Organizer */
        // if (user?.role_name == "Organizer") {
        //     profile = await AgencyCoordinator.findOne({
        //         where: {
        //             user_id: user.id,
        //             status: "activated",
        //         },
        //     });
        // }

        if (!profile) {
            return {
                success: false,
                message: "User not found or not activated.",
            };
        }

        return formatSeqObj(profile);
    } catch (err) {
        logErrorToFile(err, "getHostCoordinatorsByStatus ERROR");

        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}
