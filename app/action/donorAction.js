"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";
import { logErrorToFile } from "@lib/logger.server";
import {
    Agency,
    AgencyCoordinator,
    BloodDonationCollection,
    BloodDonationEvent,
    BloodType,
    Donor,
    DonorAppointmentInfo,
    EventTimeSchedule,
    Role,
    sequelize,
    User,
    Announcement,
    BloodDonationHistory,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import {
    bloodtypeSchema,
    donorRegistrationWithUser,
    donorSchema,
    donorStatusSchema,
    donorWithVerifiedSchema,
} from "@lib/zod/donorSchema";
import { donorBasicInformationSchema } from "@lib/zod/userSchema";
import moment from "moment";
import { Op } from "sequelize";
import { handleValidationError } from "@lib/utils/validationErrorHandler";
import { getAgencyIdBySession } from "./hostEventAction";

export async function getApprovedEventsByAgency() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const currentDate = moment().format("YYYY-MM-DD");
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    const donor = await Donor.findOne({
        where: {
            user_id: user.id,
            status: "activated",
        },
    });

    if (!donor) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const events = await BloodDonationEvent.findAll({
            where: {
                agency_id: donor.agency_id,
                status: {
                    [Op.eq]: "approved",
                },
                date: {
                    [Op.gte]: currentDate,
                },
            },
            order: [["date", "ASC"]],
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedules",
                    attributes: [
                        "id",
                        "blood_donation_event_id",
                        "time_start",
                        "time_end",
                        "status",
                        "has_limit",
                        "max_limit",
                    ],
                    include: {
                        model: DonorAppointmentInfo,
                        as: "donors",
                        required: false,
                        where: {
                            status: {
                                [Op.not]: "cancelled",
                            },
                        },
                    },
                },
                {
                    model: User,
                    as: "requester",
                    attributes: ["id", "name", "email", "image"],
                    include: {
                        model: AgencyCoordinator,
                        as: "coordinator",
                        attributes: ["contact_number"],
                        required: false,
                    },
                },
                {
                    model: Agency,
                    as: "agency",
                    attributes: [
                        "head_id",
                        "name",
                        "contact_number",
                        "address",
                        "barangay",
                        "city_municipality",
                        "province",
                        "agency_address",
                    ],
                },
            ],
        });

        const formattedEvents = formatSeqObj(events);

        return { success: true, data: formattedEvents };
    } catch (err) {
        logErrorToFile(err, "getApprovedEventsByAgency ERROR");
        return {
            success: false,
            type: "server",
            message: err || "Unknown error",
        };
    }
}

/* For client user registration */
export async function storeDonor(formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("formData received on server", formData);
    if (!formData.blood_type_id) formData.blood_type_id = null;
    const parsed = donorRegistrationWithUser.safeParse(formData);

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

    // Convert empty strings in parsed data to null
    Object.keys(data).forEach((key) => {
        if (data[key] === "") {
            data[key] = null;
        }
    });

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

        data.user_id = newUser.id;

        const newDonor = await Donor.create(data, { transaction });

        await transaction.commit();

        // Fetch agency and blood type for notifications/emails
        let agency = null;
        let bloodType = null;
        try {
            agency = await Agency.findByPk(newDonor.agency_id);
            if (newDonor.blood_type_id) {
                bloodType = await BloodType.findByPk(newDonor.blood_type_id);
            }
        } catch (err) {
            console.error("Failed to fetch agency or blood type:", err);
        }

        await logAuditTrail({
            userId: newUser.id,
            controller: "donors",
            action: "CREATE",
            details: `A new donor has been successfully created. Donor ID#: ${newDonor.id} with User account: ${newUser.id} (${newUser?.email}) and Agency ID#: ${newDonor.agency_id} (${agency?.name})`,
        });

        // Notifications and emails (non-blocking)
        (async () => {
            // 1. Notify the registering donor
            try {
                await sendNotificationAndEmail({
                    userIds: newUser.id,
                    notificationData: {
                        subject: "Donor Registration Received",
                        message:
                            "Thank you for registering as a blood donor. Your application is pending approval by your agency.",
                        type: "GENERAL",
                        reference_id: newDonor.id,
                        created_by: newUser.id,
                    },
                });
            } catch (err) {
                console.error("Donor notification failed:", err);
            }

            // 2. Send email to the registering donor (template only)
            try {
                await sendNotificationAndEmail({
                    emailData: {
                        to: newUser.email,
                        templateCategory: "DONOR_REGISTRATION",
                        templateData: {
                            user_name: `${newUser.first_name} ${newUser.last_name}`,
                            user_email: newUser.email,
                            user_first_name: newUser.first_name,
                            user_last_name: newUser.last_name,
                            contact_number: newDonor?.contact_number,
                            blood_type:
                                bloodType?.blood_type || "Not specified",
                            agency_name: agency?.name || "Your agency",
                            registration_date: new Date().toLocaleDateString(),
                            system_name:
                                process.env.NEXT_PUBLIC_SYSTEM_NAME || "",
                            support_email:
                                process.env.NEXT_PUBLIC_SMTP_SUPPORT_EMAIL ||
                                "",
                            support_contact:
                                process.env.NEXT_PUBLIC_SMTP_SUPPORT_CONTACT ||
                                "",
                            domain_url: process.env.NEXT_PUBLIC_APP_URL || "",
                        },
                    },
                });
            } catch (err) {
                console.error("Donor registration email failed:", err);
            }

            // 3. Notify all admins (MBDT team)
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
                                subject: "New Donor Registration",
                                message: `A new donor (${newUser.first_name} ${
                                    newUser.last_name
                                }) has registered and is pending approval for agency (${
                                    agency?.name || newDonor.agency_id
                                }).`,
                                type: "DONOR_REGISTRATION",
                                reference_id: newDonor.id,
                                created_by: newUser.id,
                            },
                        });
                    }
                }
            } catch (err) {
                console.error("Admin notification failed:", err);
            }

            // 4. Send system notification and email to agency head and active coordinators
            try {
                if (agency) {
                    // Get agency head
                    const agencyHead = await User.findByPk(agency.head_id);

                    // Get active coordinators
                    const activeCoordinators = await AgencyCoordinator.findAll({
                        where: {
                            agency_id: agency.id,
                            status: "activated",
                        },
                        include: {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "email",
                                "first_name",
                                "last_name",
                            ],
                        },
                    });

                    // Collect all recipients (agency head + active coordinators)
                    const recipients = [];
                    if (agencyHead) {
                        recipients.push(agencyHead);
                    }
                    activeCoordinators.forEach((coordinator) => {
                        if (coordinator.user) {
                            recipients.push(coordinator.user);
                        }
                    });

                    if (recipients.length > 0) {
                        // Send system notification to all recipients
                        await sendNotificationAndEmail({
                            userIds: recipients.map((r) => r.id),
                            notificationData: {
                                subject: "New Donor Registration",
                                message: `A new donor (${newUser.first_name} ${
                                    newUser.last_name
                                }) has registered and is awaiting approval for agency (${
                                    agency?.name || newDonor.agency_id
                                }).`,
                                type: "AGENCY_DONOR_APPROVAL",
                                reference_id: newDonor.id,
                                created_by: newUser.id,
                            },
                        });

                        // Send email to each recipient
                        for (const recipient of recipients) {
                            await sendNotificationAndEmail({
                                emailData: {
                                    to: recipient.email,
                                    templateCategory:
                                        "AGENCY_DONOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
                                    templateData: {
                                        agency_name:
                                            agency?.name || newDonor.agency_id,
                                        donor_name: `${newUser.first_name} ${newUser.last_name}`,
                                        donor_email: newUser.email,
                                        donor_contact: newUser.contact_number,
                                        blood_type:
                                            bloodType?.blood_type ||
                                            "Not specified",
                                        registration_date:
                                            new Date().toLocaleDateString(),
                                        system_name:
                                            process.env
                                                .NEXT_PUBLIC_SYSTEM_NAME || "",
                                        support_email:
                                            process.env
                                                .NEXT_PUBLIC_SMTP_SUPPORT_EMAIL ||
                                            "",
                                        support_contact:
                                            process.env
                                                .NEXT_PUBLIC_SMTP_SUPPORT_CONTACT ||
                                            "",
                                        domain_url:
                                            process.env.NEXT_PUBLIC_APP_URL ||
                                            "",
                                    },
                                },
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Agency notification email failed:", err);
            }
        })();

        return { success: true, data: newDonor.get({ plain: true }) };
    } catch (err) {
        console.log("create donor error>>>>>>>", err);
        logErrorToFile(err, "CREATE DONOR");
        await transaction.rollback();

        return handleValidationError(err);
        // return { success: false, message: extractErrorMessage(err) };
    }
}

export async function getVerifiedDonors() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const donors = await Donor.findAll({
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
                {
                    model: BloodType,
                    as: "blood_type",
                },
            ],
        });

        return formatSeqObj(donors);
    } catch (err) {
        logErrorToFile(err, "getVerifiedDonors ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getDonorsByStatus(status) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const donors = await Donor.findAll({
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
                {
                    model: BloodType,
                    as: "blood_type",
                },
            ],
        });

        return formatSeqObj(donors);
    } catch (err) {
        logErrorToFile(err, "getCoordinatorsByStatus ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}
export async function getDonorById(id) {
    // await new Promise((resolve) => setTimeout(resolve, 500));
    if (!id) {
        return {
            success: false,
            message: "Invalid Donor Id provided!",
        };
    }

    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;

    const {
        success: agencySuccess,
        agency_id,
        message,
    } = await getAgencyIdBySession();
    if (!agencySuccess) {
        return {
            success: false,
            message,
        };
    }

    if (!id) {
        return {
            success: false,
            message: "Invalid Donor Id provided!",
        };
    }

    let whereCondition = {};
    if (user?.role_name !== "Admin") {
        whereCondition.agency_id = agency_id;
    }

    try {
        const donor = await Donor.findByPk(id, {
            where: whereCondition,
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
                {
                    model: DonorAppointmentInfo,
                    as: "appointments",
                    attributes: [
                        "id",
                        "donor_type",
                        "collection_method",
                        "status",
                        "comments",
                        "feedback_average",
                    ],
                    include: {
                        model: BloodDonationEvent,
                        as: "event",
                        attributes: ["date", "title"],
                        required: true,
                    },
                },
                {
                    model: BloodDonationCollection,
                    as: "blood_collections",
                    include: {
                        model: DonorAppointmentInfo,
                        as: "appointment",
                        attributes: ["collection_method"],
                    },
                },
                {
                    model: BloodDonationHistory,
                    as: "blood_history",
                    attributes: [
                        "previous_donation_count",
                        "previous_donation_volume",
                    ],
                },
            ],
            order: [
                [
                    { model: DonorAppointmentInfo, as: "appointments" },
                    { model: BloodDonationEvent, as: "event" },
                    "date",
                    "DESC",
                ],
            ],
        });

        if (!donor) {
            return {
                success: false,
                message:
                    "Donor not found/inactive or you are not authorized to access the donor information.",
            };
        }

        return formatSeqObj(donor);
    } catch (err) {
        logErrorToFile(err, "getDonorById ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function updateDonor(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    formData.updated_by = user.id;

    const parsed = donorSchema.safeParse(formData);

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

    const donor = await Donor.findByPk(data.id);

    if (!donor) {
        return {
            success: false,
            message: "Database Error: Donor ID was not found",
        };
    }

    const transaction = await sequelize.transaction();

    data.is_data_verified = false;
    data.data_verified_by = null;

    try {
        const updatedDonor = await donor.update(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donors",
            action: "UPDATE DONOR",
            details: `The Donor's profile has been successfully updated. ID#: ${updatedDonor.id}`,
        });

        return {
            success: true,
            data: updatedDonor.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE DONOR");
        await transaction.rollback();

        return handleValidationError(err);
    }
}

export async function updateUserDonor(user_id, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    formData.updated_by = user.id;

    const parsedDonor = donorWithVerifiedSchema.safeParse(formData);
    const parsedUser = donorBasicInformationSchema.safeParse(formData);

    if (!parsedDonor.success || !parsedUser.success) {
        const errorObj = {
            ...parsedDonor.error?.flatten().fieldErrors,
            ...parsedUser.error?.flatten().fieldErrors,
        };

        return {
            success: false,
            type: "validation",
            message:
                "Validation Error: Please try again. If the issue persists, contact your administrator for assistance.",
            errorObj,
            errorArr: Object.values(errorObj).flat(),
        };
    }

    const { data: donorData } = parsedDonor;
    const { data: userData } = parsedUser;

    const donor = await Donor.findByPk(donorData.id);
    const userDonor = await User.findByPk(user_id);

    if (!donor) {
        return {
            success: false,
            message: "Database Error: Donor ID was not found.",
        };
    }

    if (!userDonor) {
        return {
            success: false,
            message: "Database Error: User ID was not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedDonor = await donor.update(donorData, {
            transaction,
        });

        await userDonor.update(userData, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donors",
            action: "UPDATE USERDONOR",
            details: `The Donor's profile has been successfully verified. ID#: ${updatedDonor.id}`,
        });

        return {
            success: true,
            data: updatedDonor.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE USERDONOR");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function updateDonorBloodType(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    formData.updated_by = user.id;

    const parsed = bloodtypeSchema.safeParse(formData);

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

    const donor = await Donor.findByPk(data.id);

    if (!donor) {
        return {
            success: false,
            message: "Database Error: Donor ID was not found",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedDonor = await donor.update(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donors",
            action: "UPDATE DONOR BLOOD TYPE",
            details: `The Donor's blood type has been successfully updated. ID#: ${updatedDonor.id}`,
        });

        return {
            success: true,
            data: updatedDonor.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE DONOR");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function updateDonorStatus(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    console.log("updateDonorStatus", formData);
    const { user } = session;
    formData.verified_by = user.id;

    const parsed = donorStatusSchema.safeParse(formData);

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

    const donor = await Donor.findByPk(data.id);

    if (!donor) {
        return {
            success: false,
            message: "Database Error: Donor ID was not found",
        };
    }

    const currentDonorStatus = donor?.status;
    const user_donor = await User.findByPk(donor.user_id, {
        include: [
            {
                where: { role_name: "Donor" },
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

    if (!user_donor) {
        return {
            success: false,
            message: "Database Error: User with role donor was not found!",
        };
    }

    const donor_role = user_donor?.roles[0].role;

    const transaction = await sequelize.transaction();

    try {
        // Check if status is changing from "for approval" to "activated"
        const isActivation =
            donor.status === "for approval" && data.status === "activated";

        const updatedDonor = await donor.update(data, {
            transaction,
        });

        const donor_status = updatedDonor.status == "activated";

        if (updatedDonor) {
            await donor_role.update(
                { is_active: donor_status },
                { transaction }
            );
        }

        await transaction.commit();

        // Fetch additional data for notifications/emails
        let agency = null;
        let bloodType = null;
        try {
            agency = await Agency.findByPk(updatedDonor.agency_id);
            if (updatedDonor.blood_type_id) {
                bloodType = await BloodType.findByPk(
                    updatedDonor.blood_type_id
                );
            }
        } catch (err) {
            console.error("Failed to fetch agency or blood type:", err);
        }

        await logAuditTrail({
            userId: user.id,
            controller: "donors",
            action: "UPDATE DONOR STATUS",
            details: `Donor status updated from "${donor.status}" to "${
                data.status
            }" for Donor ID#: ${updatedDonor.id} (${user_donor.first_name} ${
                user_donor.last_name
            } - ${user_donor.email}). Agency: ${
                agency?.name || updatedDonor.agency_id
            }. ${
                data.remarks ? `Rejection reason: "${data.remarks}"` : ""
            } Updated by: ${user?.name} (${user.id})`,
        });

        // Notifications and emails (only for activation from "for approval")
        if (isActivation) {
            (async () => {
                // 1. Send system notification to donor
                try {
                    await sendNotificationAndEmail({
                        userIds: updatedDonor.user_id,
                        notificationData: {
                            subject: "Donor Account Activated",
                            message:
                                "Congratulations! Your donor account has been activated. You can now participate in blood donation events.",
                            type: "GENERAL",
                            reference_id: updatedDonor.id,
                            created_by: user.id,
                        },
                    });
                } catch (err) {
                    console.error("Donor notification failed:", err);
                }

                // 2. Send email notification to donor
                try {
                    await sendNotificationAndEmail({
                        emailData: {
                            to: user_donor.email,
                            templateCategory: "DONOR_APPROVAL",
                            templateData: {
                                user_name: `${user_donor.first_name} ${user_donor.last_name}`,
                                user_email: user_donor.email,
                                user_first_name: user_donor.first_name,
                                user_last_name: user_donor.last_name,
                                contact_number: donor.contact_number,
                                approval_status: "Approved",
                                approval_date: new Date().toLocaleDateString(),
                                approval_reason: "All requirements met",
                                agency_name: agency?.name || "Your agency",
                                blood_type:
                                    bloodType?.blood_type || "Not specified",
                                system_name:
                                    process.env.NEXT_PUBLIC_SYSTEM_NAME || "",
                                support_email:
                                    process.env
                                        .NEXT_PUBLIC_SMTP_SUPPORT_EMAIL || "",
                                support_contact:
                                    process.env
                                        .NEXT_PUBLIC_SMTP_SUPPORT_CONTACT || "",
                                domain_url:
                                    process.env.NEXT_PUBLIC_APP_URL || "",
                            },
                        },
                    });
                } catch (err) {
                    console.error("Donor approval email failed:", err);
                }

                // 3. Send system notification to all admins (MBDT team)
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
                                    subject: "Donor Account Activated",
                                    message: `A donor (${
                                        user_donor.first_name
                                    } ${
                                        user_donor.last_name
                                    }) has been activated for agency (${
                                        agency?.name || updatedDonor.agency_id
                                    }).`,
                                    type: "DONOR_STATUS_UPDATE",
                                    reference_id: updatedDonor.id,
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error("Admin notification failed:", err);
                }

                // 4. Send system notification to agency head and active coordinators
                try {
                    if (agency) {
                        // Get agency head
                        const agencyHead = await User.findByPk(agency.head_id);

                        // Get active coordinators
                        const activeCoordinators =
                            await AgencyCoordinator.findAll({
                                where: {
                                    agency_id: agency.id,
                                    status: "activated",
                                },
                                include: {
                                    model: User,
                                    as: "user",
                                    attributes: [
                                        "id",
                                        "email",
                                        "first_name",
                                        "last_name",
                                    ],
                                },
                            });

                        // Collect all recipients (agency head + active coordinators)
                        const recipients = [];
                        if (agencyHead) {
                            recipients.push(agencyHead);
                        }
                        activeCoordinators.forEach((coordinator) => {
                            if (coordinator.user) {
                                recipients.push(coordinator.user);
                            }
                        });

                        if (recipients.length > 0) {
                            await sendNotificationAndEmail({
                                userIds: recipients.map((r) => r.id),
                                notificationData: {
                                    subject: "Donor Account Activated",
                                    message: `A donor (${user_donor.first_name} ${user_donor.last_name}) has been activated for your agency (${agency.name}).`,
                                    type: "DONOR_STATUS_UPDATE",
                                    reference_id: updatedDonor.id,
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error("Agency notification failed:", err);
                }
            })();
        }

        // Notifications and emails for rejection
        if (data.status === "rejected") {
            (async () => {
                // 1. Send system notification to donor
                try {
                    await sendNotificationAndEmail({
                        userIds: updatedDonor.user_id,
                        notificationData: {
                            subject: "Donor Application Status Update",
                            message:
                                "Your donor application has been reviewed. Please check your email for details.",
                            type: "GENERAL",
                            reference_id: updatedDonor.id,
                            created_by: user.id,
                        },
                    });
                } catch (err) {
                    console.error("Donor rejection notification failed:", err);
                }

                // 2. Send email notification to donor
                try {
                    await sendNotificationAndEmail({
                        emailData: {
                            to: user_donor.email,
                            templateCategory: "DONOR_REJECTION",
                            templateData: {
                                user_name: `${user_donor.first_name} ${user_donor.last_name}`,
                                user_email: user_donor.email,
                                user_first_name: user_donor.first_name,
                                user_last_name: user_donor.last_name,
                                agency_name: agency?.name || "Your agency",
                                approval_status: "Rejected",
                                approval_date: new Date().toLocaleDateString(),
                                approval_reason:
                                    data.remarks ||
                                    "Application requirements not met",
                                system_name:
                                    process.env.NEXT_PUBLIC_SYSTEM_NAME || "",
                                support_email:
                                    process.env
                                        .NEXT_PUBLIC_SMTP_SUPPORT_EMAIL || "",
                                support_contact:
                                    process.env
                                        .NEXT_PUBLIC_SMTP_SUPPORT_CONTACT || "",
                                domain_url:
                                    process.env.NEXT_PUBLIC_APP_URL || "",
                            },
                        },
                    });
                } catch (err) {
                    console.error("Donor rejection email failed:", err);
                }

                // 3. Send system notification to all admins (MBDT team)
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
                                    subject: "Donor Application Rejected",
                                    message: `A donor (${
                                        user_donor.first_name
                                    } ${
                                        user_donor.last_name
                                    }) has been rejected for agency (${
                                        agency?.name || updatedDonor.agency_id
                                    }).`,
                                    type: "DONOR_STATUS_UPDATE",
                                    reference_id: updatedDonor.id,
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error("Admin rejection notification failed:", err);
                }

                // 4. Send system notification to agency head and active coordinators
                try {
                    if (agency) {
                        // Get agency head
                        const agencyHead = await User.findByPk(agency.head_id);

                        // Get active coordinators
                        const activeCoordinators =
                            await AgencyCoordinator.findAll({
                                where: {
                                    agency_id: agency.id,
                                    status: "activated",
                                },
                                include: {
                                    model: User,
                                    as: "user",
                                    attributes: [
                                        "id",
                                        "email",
                                        "first_name",
                                        "last_name",
                                    ],
                                },
                            });

                        // Collect all recipients (agency head + active coordinators)
                        const recipients = [];
                        if (agencyHead) {
                            recipients.push(agencyHead);
                        }
                        activeCoordinators.forEach((coordinator) => {
                            if (coordinator.user) {
                                recipients.push(coordinator.user);
                            }
                        });

                        if (recipients.length > 0) {
                            await sendNotificationAndEmail({
                                userIds: recipients.map((r) => r.id),
                                notificationData: {
                                    subject: "Donor Application Rejected",
                                    message: `A donor (${user_donor.first_name} ${user_donor.last_name}) has been rejected for your agency (${agency.name}).`,
                                    type: "DONOR_STATUS_UPDATE",
                                    reference_id: updatedDonor.id,
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error("Agency rejection notification failed:", err);
                }
            })();
        }

        // Notifications and emails for deactivation
        if (
            currentDonorStatus === "activated" &&
            data.status === "deactivated"
        ) {
            (async () => {
                // 1. Send email notification to donor
                try {
                    await sendNotificationAndEmail({
                        emailData: {
                            to: user_donor.email,
                            templateCategory: "DONOR_DEACTIVATION",
                            templateData: {
                                user_name: `${user_donor.first_name} ${user_donor.last_name}`,
                                user_email: user_donor.email,
                                user_first_name: user_donor.first_name,
                                user_last_name: user_donor.last_name,
                                agency_name: agency?.name || "Your agency",
                                deactivation_date:
                                    new Date().toLocaleDateString(),
                                deactivation_reason:
                                    data.remarks ||
                                    "Account deactivated by agency/admin.",
                                system_name:
                                    process.env.NEXT_PUBLIC_SYSTEM_NAME || "",
                                support_email:
                                    process.env
                                        .NEXT_PUBLIC_SMTP_SUPPORT_EMAIL || "",
                                support_contact:
                                    process.env
                                        .NEXT_PUBLIC_SMTP_SUPPORT_CONTACT || "",
                                domain_url:
                                    process.env.NEXT_PUBLIC_APP_URL || "",
                            },
                        },
                    });
                } catch (err) {
                    console.error("Donor deactivation email failed:", err);
                }
                // 2. Send system notification to all admins
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
                                    subject: "Donor Account Deactivated",
                                    message: `A donor (${
                                        user_donor.first_name
                                    } ${
                                        user_donor.last_name
                                    }) has been deactivated for agency (${
                                        agency?.name || updatedDonor.agency_id
                                    }).`,
                                    type: "DONOR_STATUS_UPDATE",
                                    reference_id: updatedDonor.id,
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error(
                        "Admin deactivation notification failed:",
                        err
                    );
                }
            })();
        }

        // Notifications and emails for reactivation
        if (
            currentDonorStatus === "deactivated" &&
            data.status === "activated"
        ) {
            (async () => {
                // 1. Send email notification to donor
                try {
                    await sendNotificationAndEmail({
                        emailData: {
                            to: user_donor.email,
                            templateCategory: "DONOR_REACTIVATION",
                            templateData: {
                                user_name: `${user_donor.first_name} ${user_donor.last_name}`,
                                user_email: user_donor.email,
                                user_first_name: user_donor.first_name,
                                user_last_name: user_donor.last_name,
                                agency_name: agency?.name || "Your agency",
                                reactivation_date:
                                    new Date().toLocaleDateString(),
                                system_name:
                                    process.env.NEXT_PUBLIC_SYSTEM_NAME || "",
                                support_email:
                                    process.env
                                        .NEXT_PUBLIC_SMTP_SUPPORT_EMAIL || "",
                                support_contact:
                                    process.env
                                        .NEXT_PUBLIC_SMTP_SUPPORT_CONTACT || "",
                                domain_url:
                                    process.env.NEXT_PUBLIC_APP_URL || "",
                            },
                        },
                    });
                } catch (err) {
                    console.error("Donor reactivation email failed:", err);
                }
                // 2. Send system notification to all admins
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
                                    subject: "Donor Account Reactivated",
                                    message: `A donor (${
                                        user_donor.first_name
                                    } ${
                                        user_donor.last_name
                                    }) has been reactivated for agency (${
                                        agency?.name || updatedDonor.agency_id
                                    }).`,
                                    type: "DONOR_STATUS_UPDATE",
                                    reference_id: updatedDonor.id,
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error(
                        "Admin reactivation notification failed:",
                        err
                    );
                }
            })();
        }

        const title = {
            rejected: "Donor Application Rejected",
            activated: "Donor Successfully Activated",
            deactivated: "Donor Account Deactivated",
        };
        const text = {
            rejected:
                "The donor's application has been reviewed and rejected. The applicant will be notified of this decision. ",
            activated:
                "The donor's account has been approved and activated. They can now log in and participate in blood donation activities. A notification and email have been sent to inform them of their new status.",
            deactivated:
                "The donor's account has been deactivated. They will no longer be able to access the system until reactivated. A notification has been sent to inform them of this change.",
        };

        return {
            success: true,
            data: updatedDonor.get({ plain: true }),
            title: title[data.status] || "Update!",
            text:
                text[data.status] || "Donor application updated successfully.",
        };
    } catch (err) {
        logErrorToFile(err, "UPDATE DONOR STATUS");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function getDonorProfile() {
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
                    model: Donor,
                    as: "donor",
                    required: false,
                    include: [
                        {
                            model: Agency,
                            as: "agency",
                            required: false,
                            include: {
                                model: User,
                                as: "head",
                                attributes: ["id", "name", "email", "image"],
                            },
                        },
                        {
                            model: BloodType,
                            as: "blood_type",
                        },
                    ],
                },
            ],
        });

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

export async function getDonorDashboard() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this page.",
        };
    }

    const { user } = session;

    try {
        const donor = await Donor.findOne({
            where: { user_id: user?.id }, // assuming this association
            attributes: ["id", "is_bloodtype_verified"],
            include: [
                {
                    model: BloodType,
                    as: "blood_type",
                    required: false,
                },
                {
                    model: BloodDonationHistory,
                    as: "blood_history",
                    attributes: [
                        "previous_donation_count",
                        "previous_donation_volume",
                    ],
                },
            ],
        });

        if (!donor) {
            return {
                success: false,
                message: "You are not authorized to access this page.",
            };
        }

        const donationCount = await BloodDonationCollection.count({
            where: {
                donor_id: donor?.id,
            },
        });

        let nextEligibleDate = moment();
        let daysRemaining = 0;
        let donateNow = true;
        let latestDonationDate = null;

        const latestDonation = await getLastDonationDateDonated(user?.id);
        if (latestDonation.success) {
            latestDonationDate = latestDonation?.last_donation_date;
        }

        if (latestDonationDate) {
            const lastDate = moment(latestDonationDate).startOf("day");

            // Add 90 days
            nextEligibleDate = lastDate.clone().add(90, "days");

            // Today at start of day
            const today = moment().startOf("day");

            // Calculate remaining days
            daysRemaining = nextEligibleDate.diff(today, "days");

            donateNow = daysRemaining <= 0; // true or false
        }

        return {
            success: true,
            data: {
                blood_type: donor?.blood_type?.blood_type,
                is_bloodtype_verified: donor?.is_bloodtype_verified,
                no_donations:
                    donationCount +
                    (donor?.blood_history?.previous_donation_count || 0),
                next_eligible_date: nextEligibleDate.format("MMM.DD, YYYY"),
                days_remaining: donateNow ? 0 : daysRemaining,
                latest_donation_date: latestDonationDate,
                donateNow,
            },
        };
    } catch (err) {
        logErrorToFile(err, "getHostCoordinatorsByStatus ERROR");
        return {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function getLastDonationDateDonated(user_id) {
    if (!user_id) {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this page.",
            };
        }

        const { user } = session;
        user_id = user?.id;
    }

    try {
        // Verify donor exists
        const donor = await Donor.findOne({
            where: { user_id },
            attributes: [
                "id",
                "is_regular_donor",
                "last_donation_date",
                "donation_history_donation_date",
                "last_donation_event_id",
            ],
        });

        if (!donor) {
            return {
                success: false,
                message: "You are not authorized to access this page.",
            };
        }

        // Fetch latest donation date
        // const latestDonation = await DonorAppointmentInfo.findOne({
        //     where: {
        //         donor_id: donor.id,
        //     },
        //     attributes: ["id"],
        //     include: [
        //         {
        //             model: PhysicalExamination,
        //             as: "physical_exam",
        //             where: { eligibility_status: "ACCEPTED" },
        //             attributes: ["id", "eligibility_status"],
        //             required: true,
        //             include: [
        //                 {
        //                     model: BloodDonationEvent,
        //                     as: "event",
        //                     attributes: ["date"],
        //                 },
        //                 {
        //                     model: BloodDonationCollection,
        //                     as: "blood_collection",
        //                     required: true,
        //                 },
        //             ],
        //         },
        //     ],
        //     order: [
        //         [
        //             { model: PhysicalExamination, as: "physical_exam" },
        //             { model: BloodDonationEvent, as: "event" },
        //             "date",
        //             "DESC",
        //         ],
        //     ],
        //     raw: true, // Optimize by returning plain object
        // });

        let last_donation_date = null;

        //default the last donation date to the donation history date (registration data)
        if (donor?.is_regular_donor) {
            last_donation_date = donor?.donation_history_donation_date;
        }

        if (donor?.last_donation_date) {
            last_donation_date = donor?.last_donation_date;
        }

        return {
            success: true,
            last_donation_date,
            data: {
                last_donation_date,
            },
        };
    } catch (err) {
        logErrorToFile(err, "getLastDonationDateDonated ERROR"); // Your error logging function
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function notifyRegistrationOpen(donor, eventData = null) {
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!donor || !donor?.user) {
        return {
            success: false,
            type: "error_notify_email",
            message: "Sending failed. Donor not found.",
            data: donor,
        };
    }

    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        // Send system notification to donor
        try {
            await sendNotificationAndEmail({
                userIds: donor.user.id,
                notificationData: {
                    subject: "New Blood Donation Event Available",
                    message: eventData
                        ? `A new blood donation event "${eventData.title}" is now open for registration. Check your email for details.`
                        : "A new blood donation event is now open for registration. Check your email for details.",
                    type: "NEW_EVENT",
                    reference_id: eventData?.id || null,
                    created_by: session.user.id,
                },
            });
        } catch (err) {
            console.error("Donor notification failed:", err);
        }

        // Send email notification to donor
        if (eventData) {
            try {
                await sendNotificationAndEmail({
                    emailData: {
                        to: donor.user.email,
                        templateCategory: "EVENT_DONOR_INVITATION",
                        templateData: {
                            event_name: eventData.title,
                            event_date: new Date(
                                eventData.date
                            ).toLocaleDateString(),
                            event_time: eventData.time_schedules?.[0]
                                ? `${eventData.time_schedules[0].time_start} - ${eventData.time_schedules[0].time_end}`
                                : "TBD",
                            agency_name: eventData?.agency?.name,
                            event_location: eventData?.agency?.agency_address,
                            event_organizer:
                                eventData.requester?.name || "Event Organizer",
                            system_name:
                                process.env.NEXT_PUBLIC_SYSTEM_NAME || "",
                            support_email:
                                process.env.NEXT_PUBLIC_SMTP_SUPPORT_EMAIL ||
                                "",
                            support_contact:
                                process.env.NEXT_PUBLIC_SMTP_SUPPORT_CONTACT ||
                                "",
                            domain_url: process.env.NEXT_PUBLIC_APP_URL || "",
                        },
                    },
                });
            } catch (err) {
                console.error("Event invitation email failed:", err);
            }
        }

        // Audit trail logging
        try {
            await logAuditTrail({
                userId: session.user.id,
                controller: "events",
                action: "NOTIFY_DONORS",
                details: `Event invitation sent to donor ${
                    donor.user?.full_name
                } (${donor.user.email}) for event: ${
                    eventData?.title || "Unknown Event"
                }`,
            });
        } catch (err) {
            console.error("Audit trail failed:", err);
        }

        return {
            success: true,
            message: "Send Successfully to " + donor?.user?.full_name,
            data: donor,
        };
    } catch (err) {
        console.error("Notification process failed:", err);
        return {
            success: false,
            type: "error_notify_email",
            message: "Sending failed. Please try again.",
            data: donor,
        };
    }
}

export async function getDonorAnnouncements(limit = 5) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    const donor = await Donor.findOne({
        where: { user_id: user.id, status: "activated" },
    });

    if (!donor) {
        return {
            success: false,
            message: "Donor profile not found.",
        };
    }

    try {
        const announcements = await Announcement.findAll({
            where: {
                [Op.or]: [{ agency_id: donor.agency_id }, { is_public: true }],
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                        "full_name",
                        "name",
                        "image",
                    ],
                },
                {
                    model: Agency,
                    as: "agency",
                    attributes: ["id", "name", "file_url"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit: limit,
        });

        return { success: true, data: formatSeqObj(announcements) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}
