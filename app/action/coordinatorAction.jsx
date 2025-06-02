"use server";
import { logErrorToFile } from "@lib/logger.server";
import { Agency, AgencyCoordinator, User } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";

export async function getVerifiedCoordinators() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const users = await AgencyCoordinator.findAll({
            // where: {
            //     status: {
            //         [Op.not]: "for approval",
            //     },
            // },
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

    const agency = await Agency.findByPk(data.id);

    if (!agency) {
        throw new Error("Database Error: Agency ID was not found");
    }

    const agency_head = await User.findByPk(agency.head_id, {
        include: [
            {
                where: { role_name: "Agency Administrator" },
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

    if (!agency_head) {
        throw new Error("Database Error: Agency Head was Not found");
    }

    const agency_head_role = agency_head?.roles[0].role;

    const transaction = await sequelize.transaction();

    try {
        const updatedAgency = await agency.update(data, { transaction });

        const agency_head_status = updatedAgency.status == "activated";

        if (updatedAgency) {
            await agency_head_role.update(
                { is_active: agency_head_status },
                { transaction }
            );
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "agencies",
            action: "UPDATE AGENCY STATUS",
            details: `User status has been successfully updated. ID#: ${updatedAgency.id}`,
        });

        const title = {
            rejected: "Rejection Successful",
            activated: "Status Update",
            deactivated: "Status Update",
        };
        const text = {
            rejected: "Agency application rejected successfully.",
            activated: "The agency activated successfully.",
            deactivated: "The agency deactivated successfully.",
        };

        return {
            success: true,
            data: updatedAgency.get({ plain: true }),
            title: title[data.status] || "Update!",
            text:
                text[data.status] || "Agency application updated successfully.",
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE AGENCY STATUS");
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}
