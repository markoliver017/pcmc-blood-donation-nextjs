// https://psgc.gitlab.io/api/regions/130000000 NCR
// https://psgc.gitlab.io/api/island-groups/luzon/provinces Luzon
"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import {
    getEmailToAgencyHead,
    getEmailToMBDT,
} from "@lib/email-html-template/getNewAgencyRegistrationEmailTemplate";
import { logErrorToFile } from "@lib/logger.server";
import { send_mail } from "@lib/mail.utils";
import {
    Agency,
    AgencyCoordinator,
    Notification,
    Role,
    sequelize,
    User,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import {
    agencyRegistrationWithUser,
    agencySchema,
    agencyStatusSchema,
    coordinatorRegistrationWithUser,
    coordinatorSchema,
} from "@lib/zod/agencySchema";
import { Op } from "sequelize";
import { sendEmailByCategory } from "./emailTemplateAction";

export async function fetchAgencies() {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const agencies = await Agency.findAll({
            // attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: { exclude: ["password", "email_verified"] },
                },
                {
                    model: User,
                    as: "creator",
                    attributes: { exclude: ["password", "email_verified"] },
                },
            ],
        });

        return JSON.parse(JSON.stringify(agencies));
    } catch (error) {
        console.error(error);
        return extractErrorMessage(error);
    }
}

export async function fetchVerifiedAgencies() {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const agencies = await Agency.findAll({
            where: {
                status: {
                    [Op.not]: "for approval",
                },
            },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: { exclude: ["password", "email_verified"] },
                },
                {
                    model: User,
                    as: "creator",
                    attributes: { exclude: ["password", "email_verified"] },
                },
            ],
        });

        return JSON.parse(JSON.stringify(agencies));
    } catch (error) {
        console.error(error);
        return extractErrorMessage(error);
    }
}

export async function fetchAgency(id) {
    try {
        const agency = await Agency.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: {
                        exclude: [
                            "password",
                            "email_verified",
                            "prefix",
                            "suffix",
                            "createdAt",
                            "updatedAt",
                            "updated_by",
                        ],
                    },
                },
                {
                    model: User,
                    as: "coordinators",
                    attributes: {
                        exclude: [
                            "password",
                            "email_verified",
                            "prefix",
                            "suffix",
                            "createdAt",
                            "updatedAt",
                            "updated_by",
                        ],
                    },
                    through: { attributes: ["contact_number"] },
                },
            ],
        });

        return formatSeqObj(agency);
    } catch (error) {
        console.error(error);
        return extractErrorMessage(error);
    }
}

export async function fetchActiveAgency() {
    try {
        const agencies = await Agency.findAll({
            where: { status: "activated" },
            attributes: {
                exclude: [
                    "remarks",
                    "verified_by",
                    "updated_by",
                    "createdAt",
                    "updatedAt",
                    "status",
                    "comments",
                    "head_id",
                ],
            },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: {
                        exclude: [
                            "password",
                            "email_verified",
                            "prefix",
                            "suffix",
                            "createdAt",
                            "updatedAt",
                            "updated_by",
                        ],
                    },
                },
            ],
        });

        return formatSeqObj(agencies);
    } catch (error) {
        console.error(error);
        return extractErrorMessage(error);
    }
}

export async function fetchAgencyByStatus(status) {
    try {
        const agencies = await Agency.findAll({
            where: { status },
            attributes: {
                exclude: [
                    "remarks",
                    "verified_by",
                    "updated_by",
                    "updatedAt",
                    "head_id",
                ],
            },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: {
                        exclude: [
                            "password",
                            "email_verified",
                            "prefix",
                            "suffix",
                            "createdAt",
                            "updatedAt",
                            "updated_by",
                        ],
                    },
                },
            ],
        });

        return formatSeqObj(agencies);
    } catch (error) {
        console.error(error);
        return extractErrorMessage(error);
    }
}

export async function fetchAgencyByName(agencyName) {
    try {
        const agencies = await Agency.findOne({
            where: { name: agencyName },
            attributes: {
                exclude: [
                    "remarks",
                    "verified_by",
                    "updated_by",
                    "createdAt",
                    "updatedAt",
                    "status",
                    "comments",
                    "head_id",
                ],
            },
            include: [
                {
                    model: User,
                    as: "head",
                    attributes: {
                        exclude: [
                            "password",
                            "email_verified",
                            "prefix",
                            "suffix",
                            "createdAt",
                            "updatedAt",
                            "updated_by",
                        ],
                    },
                },
            ],
        });

        if (!agencies) {
            return extractErrorMessage(error);
        }

        return { success: true, data: formatSeqObj(agencies) };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Unknown error" };
    }
}

/* For admin registration */
export async function createAgency(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;

    const role = await Role.findOne({
        where: { role_name: "Agency Administrator" },
        attributes: ["id", "role_name"],
    });

    if (!role) {
        return {
            success: false,
            message:
                "Database Error: Agency Administrator role is not set on the system.",
        };
    }

    formData.head_id = user.id;

    console.log("formData received on server", formData);
    const parsed = agencySchema.safeParse(formData);

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

    const userData = await User.findByPk(user.id, {
        include: [
            {
                model: sequelize.models.Role,
                attributes: ["id", "role_name"],
                as: "roles",
                through: { attributes: [] },
            },
            {
                model: sequelize.models.Agency,
                attributes: ["id", "name"],
                as: "headedAgency",
            },
        ],
    });

    if (!userData) {
        return {
            success: false,
            message: `User session expired: The user's session might have timed out or been invalidated.`,
        };
    }

    if (userData.headedAgency) {
        return {
            success: false,
            message: `Your account is currently linked to partner agency "${userData.headedAgency.name}".`,
        };
    }

    const existingRoles = userData?.roles.map((role) => role.id) || [];
    const isExistingRole = existingRoles.includes(role.id);

    const transaction = await sequelize.transaction();

    try {
        if (!isExistingRole) {
            await userData.addRoles(role.id);
            await logAuditTrail({
                userId: userData.id,
                controller: "agency_action",
                action: "CREATE",
                details: `A new user role (${role?.role_name}) has been successfully added to user ID#: ${userData.id}`,
            });
            await userData.reload();
        }

        const newAgency = await Agency.create(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "agencies",
            action: "CREATE",
            details: `A new agency has been successfully created. ID#: ${newAgency.id}`,
        });

        return { success: true, data: newAgency.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "CREATE AGENCY");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function sendEmail(data) {
    const { email } = data;
    data.agency_address = "Example address, Philippines";
    const subject =
        "🩸 Thank You for Registering – Your Agency Application is Pending Approval";
    console.log("email data", data);
    const html = getEmailToMBDT(data);
    const emailStatus = await send_mail({
        to: email,
        subject,
        html,
    });
    console.log("email status", emailStatus);
}

// Notification helper for single or bulk notification creation
async function notifyUsers(userIds, notificationData) {
    if (!Array.isArray(userIds)) userIds = [userIds];
    const notifications = userIds.map((user_id) => ({
        ...notificationData,
        user_id,
    }));
    await Notification.bulkCreate(notifications);
    console.log(`Notifications sent to:`, userIds);
}

/**
 * Handle non-critical notifications and emails for agency registration
 * This function is designed to not throw errors that would affect the main registration flow
 */
async function handleAgencyRegistrationNotifications(newUser, newAgency, data) {
    const notificationResults = {
        userNotification: false,
        adminNotification: false,
        emailSent: false,
        mbdtEmail: false,
        mbdtNotification: false,
        auditTrail: false,
    };

    try {
        const { email } = data;

        // 1. Notify the registering user
        try {
            await notifyUsers(newUser.id, {
                subject: "Registration Received",
                message:
                    "Thank you for registering your agency. Your application is pending approval.",
                type: "GENERAL",
                reference_id: newAgency.id,
                created_by: newUser.id,
            });
            notificationResults.userNotification = true;
            console.log("User notification sent successfully");
        } catch (error) {
            console.error("Failed to send user notification:", error);
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
                    await notifyUsers(
                        adminUsers.map((a) => a.id),
                        {
                            subject: "New Agency Registration",
                            message: `A new agency (${newAgency.name}) has registered and is pending approval.`,
                            type: "AGENCY_APPROVAL",
                            reference_id: newAgency.id,
                            created_by: newUser.id,
                        }
                    );
                    notificationResults.adminNotification = true;
                    console.log(
                        `Admin notifications sent to ${adminUsers.length} admins`
                    );
                }
            }
        } catch (error) {
            console.error("Failed to send admin notifications:", error);
        }

        // 3. Send email to the registering user
        try {
            const emailData = {
                user_first_name: newUser.first_name,
                user_last_name: newUser.last_name,
                user_email: newUser.email,
                user_name: `${newUser.first_name} ${newUser.last_name}`,
                agency_name: newAgency.name,
                agency_address: newAgency.address,
                system_name: "Blood Donation Management System",
                registration_date: new Date().toLocaleDateString(),
            };

            // Try email template first, fallback to original method
            const emailResult = await sendEmailByCategory(
                "AGENCY_REGISTRATION",
                email,
                emailData
            );

            if (!emailResult.success) {
                console.log("Email template send failed:", emailResult.message);
                // Fallback to original email method
                await send_mail({
                    to: email,
                    subject:
                        "🩸 Thank You for Registering - Your Agency Application is Pending Approval",
                    html: getEmailToAgencyHead(data),
                    user_id: newUser.id,
                });
                console.log("Fallback email sent successfully");
            } else {
                console.log(
                    "Email sent successfully using template:",
                    emailResult.data.template
                );
            }
            notificationResults.emailSent = true;
        } catch (error) {
            console.error("Failed to send email:", error);
        }

        // 4. Send notification to MBDT
        try {
            if (process.env.NEXT_PUBLIC_MBDT_EMAIL) {
                await send_mail({
                    to: process.env.NEXT_PUBLIC_MBDT_EMAIL,
                    subject:
                        "📥 New Agency Registration Request - Action Required",
                    html: getEmailToMBDT(data),
                    user_id: newUser.id,
                });
                notificationResults.mbdtEmail = true;
                console.log("MBDT email sent successfully");
            }
        } catch (error) {
            console.error("Failed to send MBDT email:", error);
        }

        // 5. Create notification for MBDT approval
        try {
            await Notification.create({
                user_id: newUser.id,
                subject: "New Agency Registration",
                type: "AGENCY_APPROVAL",
                reference_id: newAgency.id,
                created_by: newUser.id,
            });
            notificationResults.mbdtNotification = true;
            console.log("MBDT notification created successfully");
        } catch (error) {
            console.error("Failed to create MBDT notification:", error);
        }

        // 6. Log audit trail
        try {
            await logAuditTrail({
                userId: newUser.id,
                controller: "agencies",
                action: "CREATE",
                details: `A new agency has been successfully created. Agency ID#: ${newAgency.id} (${newAgency?.name}) with User account: ${newUser.id} (${newUser?.email})`,
            });
            notificationResults.auditTrail = true;
            console.log("Audit trail logged successfully");
        } catch (error) {
            console.error("Failed to log audit trail:", error);
        }

        // Log summary of what succeeded/failed
        const successCount =
            Object.values(notificationResults).filter(Boolean).length;
        const totalCount = Object.keys(notificationResults).length;
        console.log(
            `Notifications summary: ${successCount}/${totalCount} operations succeeded`
        );
        console.log("Notification results:", notificationResults);

        return {
            success: true,
            results: notificationResults,
            message: `Registration successful. ${successCount}/${totalCount} notifications completed.`,
        };
    } catch (error) {
        // This should rarely happen since individual operations are wrapped in try-catch
        console.error(
            "Unexpected error in handleAgencyRegistrationNotifications:",
            error
        );
        logErrorToFile(error, "AGENCY_REGISTRATION_NOTIFICATIONS");

        // Still try to log the audit trail even if everything else fails
        try {
            await logAuditTrail({
                userId: newUser.id,
                controller: "agencies",
                action: "CREATE",
                details: `A new agency has been successfully created. Agency ID#: ${newAgency.id} (${newAgency?.name}) with User account: ${newUser.id} (${newUser?.email}) - Notifications may have failed`,
            });
            notificationResults.auditTrail = true;
        } catch (auditError) {
            console.error("Audit trail error:", auditError);
        }

        return {
            success: false,
            error: error.message,
            results: notificationResults,
        };
    }
}

/* For client user registration */
export async function storeAgency(formData) {
    console.log("formData received on storeAgebcy", formData);
    const parsed = agencyRegistrationWithUser.safeParse(formData);

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

    const existingUser = await User.findOne({
        where: { email: data.email },
    });
    if (existingUser) {
        return {
            success: false,
            message: `The email is already associated with an existing account in the system.`,
        };
    }

    const roles = await Role.findAll({
        where: {
            id: {
                [Op.in]: data.role_ids,
            },
        },
        attributes: ["id", "role_name"],
    });

    if (roles.length !== data.role_ids.length) {
        return {
            success: false,
            message: "Database Error: One or more roles not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const newUser = await User.create(data, { transaction });
        if (!newUser) {
            return {
                success: false,
                message:
                    "Registration Failed: There was an error while trying to register a new user account!",
            };
        }

        await newUser.addRoles(data.role_ids, { transaction });

        data.head_id = newUser.id;

        const newAgency = await Agency.create(data, { transaction });

        await transaction.commit();

        // Registration is successful! Now handle notifications and emails as non-critical operations
        data.agency_address = newAgency.agency_address;

        // Handle notifications and emails in a non-blocking way
        // This ensures that even if notifications/emails fail, the user still gets a success response
        handleAgencyRegistrationNotifications(newUser, newAgency, data)
            .then((result) => {
                if (result.success) {
                    console.log("Notifications completed:", result.message);
                    if (result.results) {
                        const successCount = Object.values(
                            result.results
                        ).filter(Boolean).length;
                        const totalCount = Object.keys(result.results).length;
                        console.log(
                            `Notification success rate: ${successCount}/${totalCount}`
                        );
                    }
                } else {
                    console.log(
                        "Some notifications/emails failed:",
                        result.error
                    );
                }
            })
            .catch((error) => {
                console.error("Unexpected error in notifications:", error);
            });

        return {
            success: true,
            data,
            message:
                "Agency registration completed successfully. Notifications are being processed in the background.",
        };
    } catch (err) {
        console.log("storeAgency error:", err);
        logErrorToFile(err, "CREATE AGENCY");
        await transaction.rollback();

        return { success: false, message: extractErrorMessage(err) };
    }
}

export async function updateAgency(formData) {
    // await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("formData received on server", formData);
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    console.log("updateAgency session", session);
    const { user } = session;

    if (user.role_name !== "Agency Administrator") {
        return {
            success: false,
            message: "You are not authorized to update agency information.",
        };
    }
    formData.updated_by = user.id;

    const parsed = agencySchema.safeParse(formData);

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

    const transaction = await sequelize.transaction();

    try {
        const agency = await Agency.findByPk(data.id, {
            transaction,
        });

        if (!agency) {
            return {
                success: false,
                message: "Database Error: Agency ID Not found",
            };
        }

        const updatedAgency = await agency.update(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "agencies",
            action: "UPDATE",
            details: `Agency has been successfully updated. ID#: ${updatedAgency.id}`,
        });

        return { success: true, data: updatedAgency.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "UPDATE AGENCY");

        await transaction.rollback();

        return { success: true, message: extractErrorMessage(err) };
    }
}

export async function updateAgencyStatus(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    console.log("updateAgencyStatus", formData);
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
        return {
            success: false,
            message: "Database Error: Agency ID was not found.",
        };
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
        return {
            success: false,
            message: "Database Error: Agency Head was Not found",
        };
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

        return { success: false, message: extractErrorMessage(err) };
    }
}

export async function storeCoordinator(formData) {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("storeCoordinator formData received on server", formData);
    const parsed = coordinatorRegistrationWithUser.safeParse(formData);

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

    console.log("data parsed", data);

    const existingUser = await User.findOne({
        where: { email: data.email },
    });
    if (existingUser) {
        return {
            success: false,
            message: `The email is already associated with an existing account in the system.`,
        };
    }

    const roles = await Role.findAll({
        where: {
            id: {
                [Op.in]: data.role_ids,
            },
        },
        attributes: ["id", "role_name"],
    });

    if (roles.length !== data.role_ids.length) {
        return {
            success: false,
            message: "Database Error: The role was not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const newUser = await User.create(data, { transaction });
        if (!newUser) {
            return {
                success: false,
                message:
                    "Registration Failed: There was an error while trying to register a new user account!",
            };
        }

        await newUser.addRoles(data.role_ids, { transaction });

        data.user_id = newUser.id;

        const newCoordinator = await AgencyCoordinator.create(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: newUser.id,
            controller: "agencies",
            action: "storeCoordinator",
            details: `A new coordinator has been successfully created. Coordinator ID#: ${newCoordinator.id} with User account: ${newUser.id}`,
        });

        return { success: true, data: newCoordinator.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "storeCoordinator");
        await transaction.rollback();

        return { success: false, message: extractErrorMessage(err) };
    }
}

export async function updateCoordinator(formData) {
    console.log("updateCoordinator formData received on server", formData);
    const parsed = coordinatorSchema.safeParse(formData);

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

    console.log("updateCoordinator parsed on server", data);

    const transaction = await sequelize.transaction();

    try {
        const coordinator = await AgencyCoordinator.findByPk(data.id, {
            transaction,
        });

        if (!coordinator) {
            return {
                success: false,
                message: "Database Error: Coordinator ID Not found",
            };
        }

        const updatedCoordinator = await coordinator.update(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: updatedCoordinator.user_id,
            controller: "agencies",
            action: "updateCoordinator",
            details: `The coordinator data has been successfully updated. Coordinator ID#: ${updatedCoordinator.id}.`,
        });

        return { success: true, data: updatedCoordinator.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "updateCoordinator");
        await transaction.rollback();

        return { success: false, message: extractErrorMessage(err) };
    }
}
