"use server";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { Agency, AgencyCoordinator, Role, sequelize, User } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { agencyStatusSchema } from "@lib/zod/agencySchema";
import { Op } from "sequelize";
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";

export async function getVerifiedCoordinators() {
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
        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getCoordinatorById(id) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!id) {
        return {
            success: false,
            message: "Invalid Id provided!",
        };
    }

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
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
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
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function updateCoordinatorStatus(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
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
        return {
            success: false,
            message: "Database Error: Agency coordinator ID was not found",
        };
    }

    const currentCoordinatorStatus = agencyCoordinator.status;

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
        return {
            success: false,
            message: "Database Error: Coordinator account was not found!",
        };
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
            controller: "coordinatorAction",
            action: "updateCoordinatorStatus",
            details: `Coordinator ${coordinator?.full_name || coordinator?.name} has been successfully updated. ID#: ${updatedCoordinator.id} from ${currentCoordinatorStatus} to ${data.status}. Updated by: ${user?.name} (${user?.email})`,
        });

        // Send email notification to coordinator if approved
        (async () => {
            const coordinatorWithDetails = await AgencyCoordinator.findByPk(
                data.id,
                {
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
                }
            );
            if (currentCoordinatorStatus === "for approval" && coordinatorWithDetails) {
                
                // 1. Handle approved application. Send system notification and email to the registering coordinator (template only) and notify all admins
                if(data.status === "activated"){

                    try {
    
                        await sendNotificationAndEmail({
                            userIds: coordinatorWithDetails?.user_id,
                            notificationData: {
                                subject: "You have been approved as a coordinator",
                                message: `Your account has been approved. You can now login to the system and start using it.`,
                                type: "GENERAL",
                                created_by: user.id,
                            },
                            emailData: {
                                to: coordinatorWithDetails.user.email,
                                templateCategory: "AGENCY_COORDINATOR_APPROVAL",
                                templateData: {
                                    agency_name: coordinatorWithDetails.agency.name,
                                    user_name:
                                        coordinatorWithDetails.user.full_name,
                                    user_email: coordinatorWithDetails.user.email,
                                    user_first_name:
                                        coordinatorWithDetails.user.first_name,
                                    user_last_name:
                                        coordinatorWithDetails.user.last_name,
                                    contact_number:
                                        coordinatorWithDetails.contact_number,
                                    approval_date: new Date().toLocaleDateString(),
                                    system_name: "PCMC Pediatric Blood Center",
                                    support_email: "support@pcmc.gov.ph",
                                    domain_url:
                                        process.env.NEXT_PUBLIC_APP_URL ||
                                        "https://blood-donation.pcmc.gov.ph",
                                },
                            },
                        });
                        
                    } catch (err) {
                        console.error("Coordinator approval email failed:", err);
                        // Don't fail the main operation if email fails
                    }

                    // 2. Notify all admins
                    try {
                        const adminRole = await Role.findOne({
                            where: { role_name: "Admin" },
                        });
                        if (adminRole) {
                            const adminUsers = await User.findAll({
                                include: [
                                    {
                                        model: Role,
                                        as: "roles",
                                        where: { id: adminRole.id },
                                        through: { attributes: [] },
                                    },
                                ],
                            });
                            if (adminUsers.length > 0) {
                                await sendNotificationAndEmail({
                                    userIds: adminUsers.map((a) => a.id),
                                    notificationData: {
                                        subject: "A coordinator application was approved",
                                        message: `A coordinator - ${coordinator?.full_name || coordinator?.name} (${coordinator?.email}) was approved by ${user?.name} (${user?.email}).`,
                                        type: "COORDINATOR_STATUS_UPDATE",
                                        reference_id: updatedCoordinator?.id,
                                        created_by: user?.id,
                                    },
                                });
                            }
                        }
                    } catch (err) {
                        console.error("Admin notification (approval) failed:", err);
                    }

                }

                // 2. Handle rejection: send email to coordinator, system notification to all admins
                if ( data.status === "rejected") {
                    try {
                        const coordinatorWithDetails = await AgencyCoordinator.findByPk(
                            data.id,
                            {
                                include: [
                                    { model: User, as: "user" },
                                    { model: Agency, as: "agency" },
                                ],
                            }
                        );
                        if (coordinatorWithDetails) {
                            await sendNotificationAndEmail({
                                // No system notification to coordinator (rejected)
                                emailData: {
                                    to: coordinatorWithDetails.user.email,
                                    templateCategory: "COORDINATOR_REJECTION",
                                    templateData: {
                                        agency_name: coordinatorWithDetails.agency.name,
                                        user_name: coordinatorWithDetails.user.full_name,
                                        user_email: coordinatorWithDetails.user.email,
                                        user_first_name: coordinatorWithDetails.user.first_name,
                                        user_last_name: coordinatorWithDetails.user.last_name,
                                        approval_status: "Rejected",
                                        approval_date: new Date().toLocaleDateString(),
                                        approval_reason: data.remarks || "Application requirements not met.",
                                        system_name: "PCMC Pediatric Blood Center",
                                        support_email: "support@pcmc.gov.ph",
                                        domain_url: process.env.NEXT_PUBLIC_APP_URL || "https://blood-donation.pcmc.gov.ph",
                                    },
                                },
                            });
                        }
                    } catch (err) {
                        console.error("Coordinator rejection email failed:", err);
                    }
                    // Notify all admins (MBDT team)
                    try {
                        const adminRole = await Role.findOne({
                            where: { role_name: "Admin" },
                        });
                        if (adminRole) {
                            const adminUsers = await User.findAll({
                                include: [
                                    {
                                        model: Role,
                                        as: "roles",
                                        where: { id: adminRole.id },
                                        through: { attributes: [] },
                                    },
                                ],
                            });
                            if (adminUsers.length > 0) {
                                await sendNotificationAndEmail({
                                    userIds: adminUsers.map((a) => a.id),
                                    notificationData: {
                                        subject: "A coordinator application was rejected",
                                        message: `A coordinator - ${coordinator?.full_name || coordinator?.name} (${coordinator?.email}) was rejected by ${user?.name} (${user?.email}).`,
                                        type: "COORDINATOR_STATUS_UPDATE",
                                        reference_id: updatedCoordinator?.id,
                                        created_by: user?.id,
                                    },
                                });
                            }
                        }
                    } catch (err) {
                        console.error("Admin notification (rejection) failed:", err);
                    }
                }

                
            }else if(currentCoordinatorStatus === "activated" && data.status === "deactivated"){
                // 3. Handle deactivation: send email to coordinator, system notification to all admins
                if (data.status === "deactivated") {
                    try {
                        await sendNotificationAndEmail({
                            emailData: {
                                to: coordinatorWithDetails.user.email,
                                templateCategory: "COORDINATOR_DEACTIVATION",
                                templateData: {
                                    agency_name: coordinatorWithDetails.agency.name,
                                    user_name: coordinatorWithDetails.user.full_name,
                                    user_email: coordinatorWithDetails.user.email,
                                    user_first_name: coordinatorWithDetails.user.first_name,
                                    user_last_name: coordinatorWithDetails.user.last_name,
                                    deactivation_date: new Date().toLocaleDateString(),
                                    deactivation_reason: data.remarks || "Account deactivated by agency/admin.",
                                    system_name: "PCMC Pediatric Blood Center",
                                    support_email: "support@pcmc.gov.ph",
                                    domain_url: process.env.NEXT_PUBLIC_APP_URL || "https://blood-donation.pcmc.gov.ph",
                                },
                            },
                        });
                    } catch (err) {
                        console.error("Coordinator deactivation email failed:", err);
                    }
                    // Notify all admins (MBDT team)
                    try {
                        const adminRole = await Role.findOne({
                            where: { role_name: "Admin" },
                        });
                        if (adminRole) {
                            const adminUsers = await User.findAll({
                                include: [
                                    {
                                        model: Role,
                                        as: "roles",
                                        where: { id: adminRole.id },
                                        through: { attributes: [] },
                                    },
                                ],
                            });
                            if (adminUsers.length > 0) {
                                await sendNotificationAndEmail({
                                    userIds: adminUsers.map((a) => a.id),
                                    notificationData: {
                                        subject: "A coordinator account was deactivated",
                                        message: `A coordinator - ${coordinator?.full_name || coordinator?.name} (${coordinator?.email}) was deactivated by ${user?.name} (${user?.email}).`,
                                        type: "COORDINATOR_STATUS_UPDATE",
                                        reference_id: updatedCoordinator?.id,
                                        created_by: user?.id,
                                    },
                                });
                            }
                        }
                    } catch (err) {
                        console.error("Admin notification (deactivation) failed:", err);
                    }
                }

            }else if(currentCoordinatorStatus === "deactivated" && data.status === "activated"){
                // 4. Handle reactivation: send email to coordinator, system notification to all admins
                if (currentCoordinatorStatus === "deactivated" && data.status === "activated") {
                    try {
                        await sendNotificationAndEmail({
                            emailData: {
                                to: coordinatorWithDetails.user.email,
                                templateCategory: "COORDINATOR_REACTIVATION",
                                templateData: {
                                    agency_name: coordinatorWithDetails.agency.name,
                                    user_name: coordinatorWithDetails.user.full_name,
                                    user_email: coordinatorWithDetails.user.email,
                                    user_first_name: coordinatorWithDetails.user.first_name,
                                    user_last_name: coordinatorWithDetails.user.last_name,
                                    reactivation_date: new Date().toLocaleDateString(),
                                    system_name: "PCMC Pediatric Blood Center",
                                    support_email: "support@pcmc.gov.ph",
                                    domain_url: process.env.NEXT_PUBLIC_APP_URL || "https://blood-donation.pcmc.gov.ph",
                                },
                            },
                        });
                    } catch (err) {
                        console.error("Coordinator reactivation email failed:", err);
                    }
                    // Notify all admins (MBDT team)
                    try {
                        const adminRole = await Role.findOne({
                            where: { role_name: "Admin" },
                        });
                        if (adminRole) {
                            const adminUsers = await User.findAll({
                                include: [
                                    {
                                        model: Role,
                                        as: "roles",
                                        where: { id: adminRole.id },
                                        through: { attributes: [] },
                                    },
                                ],
                            });
                            if (adminUsers.length > 0) {
                                await sendNotificationAndEmail({
                                    userIds: adminUsers.map((a) => a.id),
                                    notificationData: {
                                        subject: "A coordinator account was reactivated",
                                        message: `A coordinator - ${coordinator?.full_name || coordinator?.name} (${coordinator?.email}) was reactivated by ${user?.name} (${user?.email}).`,
                                        type: "COORDINATOR_STATUS_UPDATE",
                                        reference_id: updatedCoordinator?.id,
                                        created_by: user?.id,
                                    },
                                });
                            }
                        }
                    } catch (err) {
                        console.error("Admin notification (reactivation) failed:", err);
                    }
                }
            }
        })();

        const title = {
            rejected: "Coordinator Application Rejected",
            activated: "Coordinator Successfully Activated",
            deactivated: "Coordinator Account Deactivated",
        };

        const text = {
            rejected: "The coordinator's application has been reviewed and rejected. The applicant will be notified of this decision.",
            activated: "The coordinator's account has been approved and activated. They can now log in and access the system. A notification and email have been sent to inform them of their new status.",
            deactivated: "The coordinator's account has been deactivated. They will no longer be able to access the system until reactivated. A notification has been sent to inform them of this change.",
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

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}
