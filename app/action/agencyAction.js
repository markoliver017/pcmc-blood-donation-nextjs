// https://psgc.gitlab.io/api/regions/130000000 NCR
// https://psgc.gitlab.io/api/island-groups/luzon/provinces Luzon
"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { getEmailToMBDT } from "@lib/email-html-template/getNewAgencyRegistrationEmailTemplate";
import { logErrorToFile } from "@lib/logger.server";
import { send_mail } from "@lib/mail.utils";
import { Agency, AgencyCoordinator, Role, sequelize, User } from "@lib/models";
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
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";
import { handleValidationError } from "@lib/utils/validationErrorHandler";
import { getAgencyId } from "./hostEventAction";

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

export async function fetchAllAgencies() {
    try {
        const agencies = await Agency.findAll({
            attributes: ["id", "name", "status"],
            where: {
                status: {
                    [Op.not]: "for approval",
                },
            },
            order: [["name", "ASC"]],
        });

        return {
            success: true,
            data: formatSeqObj(agencies),
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: extractErrorMessage(error),
        };
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

export async function fetchAgencyById(id) {
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

        return {
            success: true,
            data: formatSeqObj(agency),
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: extractErrorMessage(error),
        };
    }
}

export async function fetchAgencyByRole() {
    const agencyId = await getAgencyId();
    if (!agencyId || agencyId.success === false) {
        return {
            success: false,
            message: agencyId.message,
        };
    }

    try {
        const agency = await Agency.findByPk(agencyId, {
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

        return {
            success: true,
            data: formatSeqObj(agency),
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: extractErrorMessage(error),
        };
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

/* ill use this for testing purposes, will be removed later,
    used in the NewOrganizerForm component,
*/
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

/* For client user registration */
export async function storeAgency(formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("formData received on storeAgency", formData);
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

        // Use the new global utility for notifications and emails
        (async () => {
            // 1. Notify the registering user
            try {
                await sendNotificationAndEmail({
                    userIds: newUser.id,
                    notificationData: {
                        subject: "Registration Received",
                        message:
                            "Thank you for registering your agency. Your application is pending approval.",
                        type: "GENERAL",
                        reference_id: newAgency.id,
                        created_by: newUser.id,
                    },
                });
            } catch (err) {
                console.error("User notification failed:", err);
            }

            // 2. Send email to the registering user (template only)
            try {
                await sendNotificationAndEmail({
                    emailData: {
                        to: newUser.email,
                        templateCategory: "AGENCY_REGISTRATION",
                        templateData: {
                            user_first_name: newUser.first_name,
                            user_last_name: newUser.last_name,
                            user_email: newUser.email,
                            user_name: `${newUser.first_name} ${newUser.last_name}`,
                            agency_name: newAgency.name,
                            agency_address: newAgency.address,
                            system_name: "Blood Donation Management System",
                            support_email: "support@pcmc.gov.ph",
                            domain_url:
                                process.env.NEXT_PUBLIC_APP_URL ||
                                "https://blood-donation.pcmc.gov.ph",
                            registration_date: new Date().toLocaleDateString(),
                        },
                    },
                });
            } catch (err) {
                console.error("User email failed:", err);
            }

            // 3. Notify all admins
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
                                subject: "New Agency Registration",
                                message: `A new agency (${newAgency.name}) has registered and is pending approval.`,
                                type: "AGENCY_APPROVAL",
                                reference_id: newAgency.id,
                                created_by: newUser.id,
                            },
                        });

                        for (const adminUser of adminUsers) {
                            await sendNotificationAndEmail({
                                emailData: {
                                    to: adminUser.email,
                                    templateCategory: "MBDT_NOTIFICATION",
                                    templateData: {
                                        agency_name: newAgency.name,
                                        user_name: `${newUser.first_name} ${newUser.last_name}`,
                                        user_email: newUser.email,
                                        user_first_name: newUser.first_name,
                                        user_last_name: newUser.last_name,
                                        agency_address: newAgency.address,
                                        agency_contact:
                                            newAgency.contact_number ||
                                            "Not provided",
                                        registration_date:
                                            new Date().toLocaleDateString(),
                                        system_name:
                                            "Blood Donation Management System",
                                        support_email: "support@pcmc.gov.ph",
                                        domain_url:
                                            process.env.NEXT_PUBLIC_APP_URL ||
                                            "https://blood-donation.pcmc.gov.ph",
                                    },
                                },
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Admin notification failed:", err);
            }

            // 4. Log audit trail
            try {
                await logAuditTrail({
                    userId: newUser.id,
                    controller: "agencies",
                    action: "CREATE",
                    details: `A new agency has been successfully created. Agency ID#: ${newAgency.id} (${newAgency?.name}) with User account: ${newUser.id} (${newUser?.email})`,
                });
            } catch (err) {
                console.error("Audit trail failed:", err);
            }
        })();

        return {
            success: true,
            data,
            message:
                "Agency registration completed successfully. Notifications are being processed in the background.",
        };
    } catch (err) {
        // console.log("storeAgency error:", err);
        logErrorToFile(err, "CREATE AGENCY");
        await transaction.rollback();

        return handleValidationError(err);
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
        console.log("fieldErrors", fieldErrors);
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

    const agencyCurrentStatus = agency.status;

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
            message: "Database Error: Agency Head was Not found.",
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

        // Enhanced audit trail with detailed information
        await logAuditTrail({
            userId: user.id,
            controller: "agencies",
            action: "UPDATE AGENCY STATUS",
            details: `Agency status updated from "${agencyCurrentStatus}" to "${data.status
                }" for Agency ID#: ${updatedAgency.id} (${updatedAgency.name
                }). Agency Head: ${agency_head.first_name} ${agency_head.last_name
                } (${agency_head.email}). ${data.remarks ? `Remarks: "${data.remarks}"` : ""
                } Updated by: ${user?.name} (${user?.email})`,
        });

        // Handle notifications and emails for agency status changes (non-critical operations)
        if (
            agencyCurrentStatus === "for approval" &&
            data.status === "activated"
        ) {
            (async () => {
                // 1. Notify the agency head about approval
                try {
                    await sendNotificationAndEmail({
                        userIds: agency_head.id,
                        notificationData: {
                            subject: "Agency Approval Successful",
                            message: `Congratulations! Your agency "${updatedAgency.name}" has been approved and activated.`,
                            type: "GENERAL",
                            reference_id: updatedAgency.id,
                            created_by: user.id,
                        },
                    });
                } catch (err) {
                    console.error("Agency head notification failed:", err);
                }

                // 2. Send email to agency head using AGENCY_APPROVAL template
                try {
                    await sendNotificationAndEmail({
                        emailData: {
                            to: agency_head.email,
                            templateCategory: "AGENCY_APPROVAL",
                            templateData: {
                                user_name: `${agency_head.first_name} ${agency_head.last_name}`,
                                user_first_name: agency_head.first_name,
                                user_last_name: agency_head.last_name,
                                user_email: agency_head.email,
                                agency_name: updatedAgency.name,
                                agency_address: updatedAgency.agency_address,
                                agency_contact: updatedAgency.contact_number,
                                approval_date: new Date().toLocaleDateString(),
                                system_name: "PCMC Pediatric Blood Center",
                                support_email: "support@pcmc.gov.ph",
                                domain_url:
                                    process.env.NEXT_PUBLIC_APP_URL ||
                                    "https://blood-donation.pcmc.gov.ph",
                                approved_by: `${user?.email}`,
                            },
                        },
                    });
                } catch (err) {
                    console.error("Agency approval email failed:", err);
                }

                // 3. Notify all admins about the approval
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
                                    subject: "Agency Approved",
                                    message: `Agency "${updatedAgency.name}" has been approved and activated by ${user?.name} (${user?.email}).`,
                                    type: "AGENCY_STATUS_UPDATE",
                                    reference_id: updatedAgency.id,
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error("Admin notification failed:", err);
                }
            })();
        }

        // Handle notifications and emails for agency rejection (non-critical operations)
        if (
            agencyCurrentStatus === "for approval" &&
            data.status === "rejected"
        ) {
            (async () => {
                // 1. Send email to agency head using AGENCY_REJECTION template
                try {
                    await sendNotificationAndEmail({
                        emailData: {
                            to: agency_head.email,
                            templateCategory: "AGENCY_REJECTION",
                            templateData: {
                                user_name: `${agency_head.first_name} ${agency_head.last_name}`,
                                user_email: agency_head.email,
                                user_first_name: agency_head.first_name,
                                user_last_name: agency_head.last_name,
                                agency_name: updatedAgency.name,
                                agency_address: updatedAgency.agency_address,
                                agency_contact: updatedAgency.contact_number,
                                approval_status: "Rejected",
                                approval_date: new Date().toLocaleDateString(),
                                rejection_reason:
                                    data.remarks ||
                                    "Application requirements not met",
                                system_name: "PCMC Pediatric Blood Center",
                                support_email: "support@pcmc.gov.ph",
                                domain_url:
                                    process.env.NEXT_PUBLIC_APP_URL ||
                                    "https://blood-donation.pcmc.gov.ph",
                                rejected_by: `${user?.name}`,
                            },
                        },
                    });
                } catch (err) {
                    console.error("Agency rejection email failed:", err);
                }

                // 2. Notify all admins about the rejection
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
                                    subject: "Agency Application Rejected",
                                    message: `Agency "${updatedAgency.name
                                        }" has been rejected by ${user?.name} (${user?.email
                                        }). ${data.remarks
                                            ? `Reason: ${data.remarks}`
                                            : ""
                                        }`,
                                    type: "AGENCY_STATUS_UPDATE",
                                    reference_id: updatedAgency.id,
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error("Admin rejection notification failed:", err);
                }
            })();
        }

        const title = {
            rejected: "Agency Application Rejected",
            activated: "Agency Successfully Activated",
            deactivated: "Agency Successfully Deactivated",
        };
        const text = {
            rejected: `The agency "${updatedAgency.name
                }" has been rejected successfully. ${data.remarks
                    ? `Reason: ${data.remarks}`
                    : "No specific reason provided."
                } The agency head (${agency_head.first_name} ${agency_head.last_name
                }) will be notified of this decision.`,
            activated: `Congratulations! The agency "${updatedAgency.name}" has been successfully activated and is now operational in the blood donation system. Agency Head: ${agency_head.first_name} ${agency_head.last_name} (${agency_head.email}). The agency can now participate in blood donation events and manage their coordinators.`,
            deactivated: `The agency "${updatedAgency.name
                }" has been successfully deactivated. Agency Head: ${agency_head.first_name
                } ${agency_head.last_name} (${agency_head.email
                }). The agency will no longer be able to participate in blood donation activities until reactivated. ${data.remarks ? `Reason: ${data.remarks}` : ""
                }`,
        };

        return {
            success: true,
            data: updatedAgency.get({ plain: true }),
            title: title[data.status] || "Agency Status Updated",
            text:
                text[data.status] ||
                `The agency "${updatedAgency.name}" status has been updated successfully. Agency Head: ${agency_head.first_name} ${agency_head.last_name} (${agency_head.email}).`,
        };
    } catch (err) {
        console.lor("updateAgencyStatus error:", err);
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

        // Fetch agency and agency head for notifications/emails
        let agency = null;
        let agencyHead = null;
        try {
            agency = await Agency.findByPk(newCoordinator.agency_id);
            if (agency) {
                agencyHead = await User.findByPk(agency.head_id);
            }
        } catch (err) {
            console.error("Failed to fetch agency or agency head:", err);
        }

        await logAuditTrail({
            userId: newUser.id,
            controller: "agencies",
            action: "storeCoordinator",
            details: `A new coordinator has been successfully created. Coordinator ID#: ${newCoordinator.id} with User account: ${newUser.id} (${newUser?.email}) and Agency ID#: ${newCoordinator.agency_id} (${agency?.name})`,
        });

        // Notifications and emails (non-blocking)
        (async () => {
            // 1. Send system notification and email to the registering coordinator (template only)
            try {
                await sendNotificationAndEmail({
                    userIds: newUser.id,
                    notificationData: {
                        subject: "Coordinator Registration Received",
                        message:
                            "Thank you for registering as a coordinator. Your application is pending approval by your agency.",
                        type: "GENERAL",
                        reference_id: newCoordinator.id,
                        created_by: newUser.id,
                    },
                    emailData: {
                        to: newUser.email,
                        templateCategory: "AGENCY_COORDINATOR_REGISTRATION",
                        templateData: {
                            agency_name:
                                agency?.name || newCoordinator.agency_id,
                            user_name: `${newUser.first_name} ${newUser.last_name}`,
                            user_email: newUser.email,
                            user_first_name: newUser.first_name,
                            user_last_name: newUser.last_name,
                            contact_number: newCoordinator.contact_number,
                            registration_date: new Date().toLocaleDateString(),
                            system_name: "PCMC Pediatric Blood Center",
                            support_email: "support@pcmc.gov.ph",
                            domain_url:
                                process.env.NEXT_PUBLIC_APP_URL ||
                                "https://blood-donation.pcmc.gov.ph",
                        },
                    },
                });
            } catch (err) {
                console.error("Coordinator registration email failed:", err);
            }

            // 2. Notify all admins (MBDT team)
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
                                subject: "New Coordinator Registration",
                                message: `A new coordinator (${newUser.first_name
                                    } ${newUser.last_name
                                    }) has registered and is pending approval for agency (${agency?.name || newCoordinator.agency_id
                                    }).`,
                                type: "COORDINATOR_REGISTRATION",
                                reference_id: newCoordinator.id,
                                created_by: newUser.id,
                            },
                        });
                    }
                }
            } catch (err) {
                console.error("Admin notification failed:", err);
            }

            // 3. Send email to the agency head (administrator) about new coordinator registration
            try {
                if (agencyHead && agencyHead.email) {
                    await sendNotificationAndEmail({
                        userIds: agencyHead.id,
                        notificationData: {
                            subject: "New Coordinator Registration",
                            message: `A new coordinator (${newUser.first_name
                                } ${newUser.last_name
                                }) has registered and is awaiting for your approval (${agency?.name || newCoordinator.agency_id
                                }).`,
                            type: "AGENCY_COORDINATOR_APPROVAL",
                            reference_id: newCoordinator.id,
                            created_by: newUser.id,
                        },
                    });

                    await sendNotificationAndEmail({
                        emailData: {
                            to: agencyHead.email,
                            templateCategory:
                                "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
                            templateData: {
                                agency_name:
                                    agency?.name || newCoordinator.agency_id,
                                coordinator_name: `${newUser.first_name} ${newUser.last_name}`,
                                coordinator_email: newUser.email,
                                coordinator_contact:
                                    newCoordinator.contact_number,
                                registration_date:
                                    new Date().toLocaleDateString(),
                                system_name: "PCMC Pediatric Blood Center",
                                support_email: "support@pcmc.gov.ph",
                                domain_url:
                                    process.env.NEXT_PUBLIC_APP_URL ||
                                    "https://blood-donation.pcmc.gov.ph",
                            },
                        },
                    });
                }
            } catch (err) {
                console.error("Agency head notification email failed:", err);
            }
        })();

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

/**
 * Handle non-critical notifications and emails for agency registration
 * This function is designed to not throw errors that would affect the main registration flow
 */
// async function handleAgencyRegistrationNotifications(newUser, newAgency, data) {
//     const notificationResults = {
//         userNotification: false,
//         adminNotification: false,
//         emailSent: false,
//         mbdtNotification: false,
//         auditTrail: false,
//     };

//     try {
//         const { email } = data;

//         // 1. Notify the registering user
//         try {
//             await notifyUsers(newUser.id, {
//                 subject: "Registration Received",
//                 message:
//                     "Thank you for registering your agency. Your application is pending approval.",
//                 type: "GENERAL",
//                 reference_id: newAgency.id,
//                 created_by: newUser.id,
//             });
//             notificationResults.userNotification = true;
//             console.log("User notification sent successfully");
//         } catch (error) {
//             console.error("Failed to send user notification:", error);
//         }

//         // 2. Notify all admins
//         try {
//             const adminRole = await Role.findOne({
//                 where: { role_name: "Admin" },
//             });
//             if (adminRole) {
//                 const adminUsers = await User.findAll({
//                     include: [
//                         {
//                             model: Role,
//                             as: "roles",
//                             where: { id: adminRole.id },
//                             through: { attributes: [] },
//                         },
//                     ],
//                 });

//                 if (adminUsers.length > 0) {
//                     await notifyUsers(
//                         adminUsers.map((a) => a.id),
//                         {
//                             subject: "New Agency Registration",
//                             message: `A new agency (${newAgency.name}) has registered and is pending approval.`,
//                             type: "AGENCY_APPROVAL",
//                             reference_id: newAgency.id,
//                             created_by: newUser.id,
//                         }
//                     );
//                     notificationResults.adminNotification = true;
//                     console.log(
//                         `Admin notifications sent to ${adminUsers.length} admins`
//                     );
//                 }
//             }
//         } catch (error) {
//             console.error("Failed to send admin notifications:", error);
//         }

//         // 3. Send email to the registering user
//         try {
//             const emailData = {
//                 user_first_name: newUser.first_name,
//                 user_last_name: newUser.last_name,
//                 user_email: newUser.email,
//                 user_name: `${newUser.first_name} ${newUser.last_name}`,
//                 agency_name: newAgency.name,
//                 agency_address: newAgency.address,
//                 system_name: "Blood Donation Management System",
//                 registration_date: new Date().toLocaleDateString(),
//             };

//             // Try email template first, fallback to original method
//             const emailResult = await sendEmailByCategory(
//                 "AGENCY_REGISTRATION",
//                 email,
//                 emailData
//             );

//             if (!emailResult.success) {
//                 console.log("Email template send failed:", emailResult.message);

//             } else {
//                 console.log(
//                     "Email sent successfully using template:",
//                     emailResult.data.template
//                 );
//             }
//             notificationResults.emailSent = true;
//         } catch (error) {
//             console.error("Failed to send email:", error);
//         }

//         // 4. Create notification for MBDT approval
//         try {
//             await Notification.create({
//                 user_id: newUser.id,
//                 subject: "New Agency Registration",
//                 type: "AGENCY_APPROVAL",
//                 reference_id: newAgency.id,
//                 created_by: newUser.id,
//             });
//             notificationResults.mbdtNotification = true;
//             console.log("MBDT notification created successfully");
//         } catch (error) {
//             console.error("Failed to create MBDT notification:", error);
//         }

//         // 5. Log audit trail
//         try {
//             await logAuditTrail({
//                 userId: newUser.id,
//                 controller: "agencies",
//                 action: "CREATE",
//                 details: `A new agency has been successfully created. Agency ID#: ${newAgency.id} (${newAgency?.name}) with User account: ${newUser.id} (${newUser?.email})`,
//             });
//             notificationResults.auditTrail = true;
//             console.log("Audit trail logged successfully");
//         } catch (error) {
//             console.error("Failed to log audit trail:", error);
//         }

//         // Log summary of what succeeded/failed
//         const successCount =
//             Object.values(notificationResults).filter(Boolean).length;
//         const totalCount = Object.keys(notificationResults).length;
//         console.log(
//             `Notifications summary: ${successCount}/${totalCount} operations succeeded`
//         );
//         console.log("Notification results:", notificationResults);

//         return {
//             success: true,
//             results: notificationResults,
//             message: `Registration successful. ${successCount}/${totalCount} notifications completed.`,
//         };
//     } catch (error) {
//         // This should rarely happen since individual operations are wrapped in try-catch
//         console.error(
//             "Unexpected error in handleAgencyRegistrationNotifications:",
//             error
//         );
//         logErrorToFile(error, "AGENCY_REGISTRATION_NOTIFICATIONS");

//         // Still try to log the audit trail even if everything else fails
//         try {
//             await logAuditTrail({
//                 userId: newUser.id,
//                 controller: "agencies",
//                 action: "CREATE",
//                 details: `A new agency has been successfully created. Agency ID#: ${newAgency.id} (${newAgency?.name}) with User account: ${newUser.id} (${newUser?.email}) - Notifications may have failed`,
//             });
//             notificationResults.auditTrail = true;
//         } catch (auditError) {
//             console.error("Audit trail error:", auditError);
//         }

//         return {
//             success: false,
//             error: error.message,
//             results: notificationResults,
//         };
//     }
// }

// Notification helper for single or bulk notification creation
// async function notifyUsers(userIds, notificationData) {
//     if (!Array.isArray(userIds)) userIds = [userIds];
//     const notifications = userIds.map((user_id) => ({
//         ...notificationData,
//         user_id,
//     }));
//     await Notification.bulkCreate(notifications);
//     console.log(`Notifications sent to:`, userIds);
// }
