"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";

import { logErrorToFile } from "@lib/logger.server";
import {
    Agency,
    AgencyCoordinator,
    BloodDonationEvent,
    BloodType,
    Donor,
    DonorAppointmentInfo,
    EventTimeSchedule,
    Role,
    sequelize,
    User,
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

    console.log("data parsed", data);

    const existingUser = await User.findOne({
        where: { email: data.email },
    });
    if (existingUser) {
        throw `The email is already associated with an existing account in the system.`;
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
        throw "Database Error: One or more roles not found.";
    }

    const transaction = await sequelize.transaction();

    try {
        const newUser = await User.create(data, { transaction });
        if (!newUser) {
            throw "Registration Failed: There was an error while trying to register a new user account!";
        }

        await newUser.addRoles(data.role_ids, { transaction });

        data.user_id = newUser.id;

        const newDonor = await Donor.create(data, { transaction });

        await transaction.commit();

        await logAuditTrail({
            userId: newUser.id,
            controller: "agencies",
            action: "CREATE",
            details: `A new donor has been successfully created. Donor ID#: ${newDonor.id} with User account: ${newUser.id}`,
        });

        return { success: true, data: newDonor.get({ plain: true }) };
    } catch (err) {
        logErrorToFile(err, "CREATE DONOR");
        await transaction.rollback();

        throw err.message || "Unknown error";
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
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
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
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}
export async function getDonorById(id) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!id) throw "Invalid Donor Id provided!";

    try {
        const donor = await Donor.findByPk(id, {
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

        return formatSeqObj(donor);
    } catch (err) {
        logErrorToFile(err, "getDonorById ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
        };
    }
}

export async function updateDonor(formData) {
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";
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
        throw new Error("Database Error: Donor ID was not found");
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

        throw err.message || "Unknown error";
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
    if (!session) throw "You are not authorized to access this request.";

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
        throw new Error("Database Error: Donor ID was not found");
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

        throw err.message || "Unknown error";
    }
}

export async function updateDonorStatus(formData) {
    const session = await auth();
    if (!session) throw "You are not authorized to access this request.";
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
        throw new Error("Database Error: Donor ID was not found");
    }

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
        throw new Error("Database Error: User with role donor was not found!");
    }

    const donor_role = user_donor?.roles[0].role;

    const transaction = await sequelize.transaction();

    try {
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

        await logAuditTrail({
            userId: user.id,
            controller: "donors",
            action: "UPDATE DONOR STATUS",
            details: `The Donor status has been successfully updated. ID#: ${updatedDonor.id}`,
        });

        const title = {
            rejected: "Donor Rejected",
            activated: "Donor Activated",
            deactivated: "Donor Deactivated",
        };
        const text = {
            rejected: "The Donor was rejected successfully.",
            activated: "The Donor was activated successfully.",
            deactivated: "The Donor was deactivated successfully.",
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

        throw err.message || "Unknown error";
    }
}

export async function getDonorProfile() {
    const session = await auth();
    if (!session) throw "You are not authorized to access this page.";

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
            throw "User not found or not activated.";
        }

        return formatSeqObj(profile);
    } catch (err) {
        logErrorToFile(err, "getHostCoordinatorsByStatus ERROR");
        throw {
            success: false,
            type: "server",
            message: err.message || "Unknown error",
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
            include: {
                model: BloodType,
                as: "blood_type",
                required: false,
            },
        });

        if (!donor) {
            return {
                success: false,
                message: "You are not authorized to access this page.",
            };
        }

        const appointmentCount = await DonorAppointmentInfo.count({
            where: {
                donor_id: donor?.id,
                status: {
                    [Op.in]: ["registered", "donated"],
                },
            },
        });

        let nextEligibleDate = null;
        let daysRemaining = null;
        let donateNow = true;
        let latestDonationDate = null;

        const latestDonation = await getLastDonationDateBooked(user?.id);
        if (latestDonation.success) {
            latestDonationDate = latestDonation?.data?.last_donation_date;
        }

        if (latestDonationDate) {
            const lastDate = moment(latestDonationDate).startOf("day");

            // Add 90 days
            nextEligibleDate = lastDate.clone().add(90, "days");

            // Today at start of day
            const today = moment().startOf("day");

            // Calculate remaining days
            daysRemaining = nextEligibleDate.diff(today, "days");

            if (daysRemaining > 0) {
                donateNow = false;
            }
        }

        return {
            success: true,
            data: {
                blood_type: donor?.blood_type?.blood_type,
                is_bloodtype_verified: donor?.is_bloodtype_verified,
                no_donations: appointmentCount,
                next_eligible_date: donateNow
                    ? "Donate now"
                    : nextEligibleDate
                    ? moment(nextEligibleDate).format("MMM.DD, YYYY")
                    : null,
                days_remaining: donateNow ? 0 : daysRemaining,
                latest_donation_date: latestDonationDate,
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

export async function getLastDonationDateBooked(user_id) {
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
            attributes: ["id"],
        });

        if (!donor) {
            return {
                success: false,
                message: "You are not authorized to access this page.",
            };
        }

        // Fetch latest donation date
        const latestDonation = await DonorAppointmentInfo.findOne({
            where: {
                donor_id: donor.id,
                status: {
                    [Op.in]: ["registered", "donated"],
                },
            },
            attributes: [], // No direct attributes from DonorAppointmentInfo
            include: [
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    attributes: [],
                    include: [
                        {
                            model: BloodDonationEvent,
                            as: "event",
                            attributes: ["date"],
                        },
                    ],
                },
            ],
            order: [
                [
                    { model: EventTimeSchedule, as: "time_schedule" },
                    { model: BloodDonationEvent, as: "event" },
                    "date",
                    "DESC",
                ],
            ],
            raw: true, // Optimize by returning plain object
        });

        return {
            success: true,
            data: {
                last_donation_date:
                    latestDonation?.["time_schedule.event.date"] || null,
            },
        };
    } catch (err) {
        logErrorToFile(err, "getLastDonationDateBooked ERROR"); // Your error logging function
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}
