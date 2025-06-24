"use server";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { Agency, AgencyCoordinator, BloodType, Donor, User } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { Op } from "sequelize";

export async function getVerifiedDonorsByAgency() {
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
        let agency_id = agency?.id;

        /* For Organizer */
        if (user?.role_name == "Organizer") {
            agency = await AgencyCoordinator.findOne({
                where: {
                    user_id: user.id,
                    status: "activated",
                },
            });
            agency_id = agency?.agency_id;
        }

        if (!agency) {
            return {
                success: false,
                message: "Agency not found or not activated.",
            };
        }

        const donors = await Donor.findAll({
            where: {
                agency_id,
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
        logErrorToFile(err, "hostDonorAction ERROR");
        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getVerifiedDonorsCount() {
    const session = await auth();
    if (!session)
        return {
            success: false,
            message: "You are not authorized to access this page.",
        };

    const { user } = session;

    try {
        /* For Agency Administrator */
        let agency = await Agency.findOne({
            where: {
                head_id: user.id,
                status: "activated",
            },
        });
        let agency_id = agency?.id;

        /* For Organizer */
        if (user?.role_name == "Organizer") {
            agency = await AgencyCoordinator.findOne({
                where: {
                    user_id: user.id,
                    status: "activated",
                },
            });
            agency_id = agency?.agency_id;
        }

        if (!agency) {
            return {
                success: false,
                message: "Agency not found or not activated.",
            };
        }

        const donorCount = await Donor.count({
            where: {
                agency_id,
                status: {
                    [Op.not]: "for approval",
                },
            },
        });

        return { success: true, data: donorCount };
    } catch (err) {
        logErrorToFile(err, "getVerifiedDonorsCount ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

/* for approval for head agency */
export async function getHostDonorsByStatus(status) {
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
        let agency_id = agency?.id;

        /* For Organizer */
        if (user?.role_name == "Organizer") {
            agency = await AgencyCoordinator.findOne({
                where: {
                    user_id: user.id,
                    status: "activated",
                },
            });
            agency_id = agency?.agency_id;
        }

        if (!agency) {
            return {
                success: false,
                message: "Agency not found or not activated.",
            };
        }

        const donors = await Donor.findAll({
            where: { status, agency_id },
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
        console.log(">>>>>>>>>>>>>>>>>>agency", agency.id);
        console.log(">>>>>>>>>>>>>>>>>>donors", donors);
        return formatSeqObj(donors);
    } catch (err) {
        logErrorToFile(err, "getHostDonorsByStatus ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}
