"use server";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { Agency, AgencyCoordinator, Role, sequelize, User } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";
import { agencyStatusSchema } from "@lib/zod/agencySchema";
import { Op } from "sequelize";

export async function getVerifiedCoordinators() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const users = await AgencyCoordinator.findAll({
            where: {
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

        return formatSeqObj(users);
    } catch (err) {
        logErrorToFile(err, "getVerifiedCoordinators ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getCoordinatorById(id) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!id) throw "Invalid Id provided!";

    try {
        const coordinator = await AgencyCoordinator.findByPk(id, {
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

        return formatSeqObj(coordinator);
    } catch (err) {
        logErrorToFile(err, "getCoordinatorById ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getCoordinatorsByStatus(status) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const users = await AgencyCoordinator.findAll({
            where: { status },
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

        return formatSeqObj(users);
    } catch (err) {
        logErrorToFile(err, "getCoordinatorsByStatus ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function updateCoordinatorStatus(formData) {
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";
    console.log("updateCoordinatorStatus", formData);
    const { user } = session;
    formData.verified_by = user.id;

    const parsed = agencyStatusSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message:
                "Validation Error: Please try again. If the issue persists, contact your administrator for assistance.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const agencyCoordinator = await AgencyCoordinator.findByPk(data.id);

    if (!agencyCoordinator) {
        throw new Error("Database Error: Agency coordinator ID was not found");
    }

    const coordinator = await User.findByPk(agencyCoordinator.user_id, {
        include: [
            {
                where: { role_name: "Organizer" },
                model: Role,
                attributes: ["id", "role_name"],
                as: "roles",
                required: true,
                through: {
                    attributes: ["id", "is_active"],
                    as: "role",
                },
            },
        ],
    });

    if (!coordinator) {
        throw new Error("Database Error: Agency Head was Not found");
    }

    const coordinator_role = coordinator?.roles[0].role;

    const transaction = await sequelize.transaction();

    try {
        const updatedCoordinator = await agencyCoordinator.update(data, {
            transaction,
        });

        const coordinator_status = updatedCoordinator.status == "activated";

        if (updatedCoordinator) {
            await coordinator_role.update(
                { is_active: coordinator_status },
                { transaction }
            );
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "agencies",
            action: "UPDATE COORDINATOR STATUS",
            details: `Coordinator status has been successfully updated. ID#: ${updatedCoordinator.id}`,
        });

        const title = {
            rejected: "Coordinator Rejected",
            activated: "Coordinator Activated",
            deactivated: "Coordinator Deactivated",
        };
        const text = {
            rejected: "The coordinator was rejected successfully.",
            activated: "The coordinator was activated successfully.",
            deactivated: "The coordinator was deactivated successfully.",
        };

        return {
            success: true,
            data: updatedCoordinator.get({ plain: true }),
            title: title[data.status] || "Update!",
            text:
                text[data.status] ||
                "Coordinator application updated successfully.",
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE COORDINATOR STATUS");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}
