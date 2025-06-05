"use server";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { Agency, BloodDonationEvent, User } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";
import { Op } from "sequelize";
// import { logAuditTrail } from "@lib/audit_trails.utils";

export async function getAllEventsByAgency() {
    // await new Promise((resolve) => setTimeout(resolve, 500));

    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";

    const { user } = session;

    let agency_id = null;

    try {
        if (user?.role_name == "Agency Administrator") {
            const response = await User.findByPk(user?.id, {
                attributes: ["id"],
                include: [
                    {
                        model: Agency,
                        as: "headedAgency",
                        attributes: ["id"],
                        required: true,
                    },
                ],
            });
            if (!response?.headedAgency) {
                throw "Agency not found or not activated.";
            }
            agency_id = response.agency.id;
        } else if (user?.role_name == "Organizer") {
            const response = await User.findByPk(user?.id, {
                attributes: ["id"],
                include: [
                    {
                        model: AgencyCoordinator,
                        as: "coordinator",
                        attributes: ["id"],
                        required: true,
                        include: {
                            model: Agency,
                            attributes: ["id", "name"],
                            as: "agency",
                            required: true,
                        },
                    },
                ],
            });
            if (!response?.coordinator?.agency) {
                throw "Agency not found or not activated.";
            }
            agency_id = response?.coordinator?.agency?.id;
        }

        if (agency_id) {
            const events = await BloodDonationEvent.findAll({
                where: {
                    agency_id,
                    status: {
                        [Op.not]: "for approval",
                    },
                },
                include: [
                    {
                        model: User,
                        as: "requester",
                        attributes: ["id", "name", "email", "image"],
                    },
                ],
            });

            const formattedEvents = formatSeqObj(events);

            return formattedEvents;
        }

        throw "Unauthorized access: You are not allowed to access this resources.";
    } catch (err) {
        logErrorToFile(err, "getAllEventsByAgency ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}
