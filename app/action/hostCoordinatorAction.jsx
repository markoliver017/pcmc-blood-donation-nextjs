"use server";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { Agency, AgencyCoordinator, User } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";
import { Op } from "sequelize";

export async function getVerifiedCoordinatorsByAgency() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) throw "You are not authorized to access this page.";

    const { user } = session;

    try {
        const agency = await Agency.findOne({
            where: {
                head_id: user.id,
                status: "activated",
            },
            // include: [
            //     {
            //         model: User,
            //         as: "coordinators",
            //         through: {
            //             as: "coordinator",
            //             where: {
            //                 status: {
            //                     [Op.not]: "for approval",
            //                 },
            //             },
            //         },
            //     },
            // ],
        });
        if (!agency) {
            throw "Agency not found or not activated.";
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
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getHostCoordinatorsByStatus(status) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const session = await auth();
    if (!session) throw "You are not authorized to access this page.";

    const { user } = session;

    try {
        const agency = await Agency.findOne({
            where: {
                head_id: user.id,
                status: "activated",
            },
        });
        if (!agency) {
            throw "Agency not found or not activated.";
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
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}
