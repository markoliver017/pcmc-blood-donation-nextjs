"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { BloodRequest, BloodType, User, sequelize } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { bloodRequestSchema } from "@lib/zod/bloodRequestSchema";
import { Op } from "sequelize";
import { handleValidationError } from "@lib/utils/validationErrorHandler";
import { getAgencyId } from "./hostEventAction";

export async function fetchBloodRequests() {
    try {
        const agency = await getAgencyId();
        console.log("agency", agency);
        if (agency?.success == false || !agency) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }
        

        const requests = await BloodRequest.findAll({
            where: {
                agency_id: agency,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: { exclude: ["password", "email_verified"] },
                },
                {
                    model: BloodType,
                    as: "blood_type",
                    attributes: ["id", "blood_type"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return { success: true, data: formatSeqObj(requests) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function fetchBloodRequest(id) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const request = await BloodRequest.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: { exclude: ["password", "email_verified"] },
                },
                {
                    model: BloodType,
                    as: "blood_type",
                    attributes: ["id", "blood_type"],
                },
            ],
        });

        if (!request) {
            return {
                success: false,
                message: "Blood request not found.",
            };
        }

        return { success: true, data: formatSeqObj(request) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function fetchBloodTypes() {
    try {
        const bloodTypes = await BloodType.findAll({
            attributes: ["id", "blood_type"],
            order: [["blood_type", "ASC"]],
        });

        return { success: true, data: formatSeqObj(bloodTypes) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function fetchAgencyDonors() {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;
        let agencyId = null;

        // If user is an agency head, get their agency ID
        if (user.role_name === "Agency Administrator") {
            const agency = await sequelize.models.Agency.findOne({
                where: { head_id: user.id },
            });
            if (agency) {
                agencyId = agency.id;
            }
        }

        if (!agencyId) {
            return { success: true, data: [] };
        }

        const donors = await sequelize.models.Donor.findAll({
            where: {
                agency_id: agencyId,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "first_name",
                        "middle_name",
                        "last_name",
                        "full_name",
                        "email",
                    ],
                },
                {
                    model: BloodType,
                    as: "blood_type",
                    attributes: ["id", "blood_type"],
                },
            ],
        });

        return { success: true, data: formatSeqObj(donors) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function fetchAllBloodRequests() {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }
        // Only allow admin roles
        const { user } = session;
        if (user.role_name !== "Admin") {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }
        const requests = await BloodRequest.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: { exclude: ["password", "email_verified"] },
                    include: [
                        {
                            model: sequelize.models.Donor,
                            as: "donor",
                            include: [
                                {
                                    model: sequelize.models.Agency,
                                    as: "agency",
                                    attributes: ["id", "name"],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: BloodType,
                    as: "blood_type",
                    attributes: ["id", "blood_type"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return { success: true, data: formatSeqObj(requests) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function storeBloodRequest(formData) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        console.log("storeBloodRequest formData received on server", formData);
        const parsed = bloodRequestSchema.safeParse(formData);

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

        // Convert empty strings in data to null
        const formattedData = Object.fromEntries(
            Object.entries(parsed.data).map(([key, value]) => [
                key,
                value === "" ? null : value,
            ])
        );

        // If user_id is provided, verify it belongs to the current agency
        if (data.user_id) {
            const agency = await sequelize.models.Agency.findOne({
                where: { head_id: user.id },
            });

            if (agency) {
                const donor = await sequelize.models.Donor.findOne({
                    where: {
                        user_id: data.user_id,
                        agency_id: agency.id,
                    },
                });

                if (!donor) {
                    return {
                        success: false,
                        message:
                            "Selected donor does not belong to your agency.",
                    };
                }
            }
        }

        const transaction = await sequelize.transaction();

        try {
            const newBloodRequest = await BloodRequest.create(formattedData, {
                transaction,
            });

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "blood_requests",
                action: "CREATE",
                details: `A new blood request has been successfully created. ID#: ${newBloodRequest.id} - Component: ${newBloodRequest.blood_component}, Units: ${newBloodRequest.no_of_units}, Hospital: ${newBloodRequest.hospital_name}`,
            });

            return {
                success: true,
                message: "Blood request created successfully",
                data: newBloodRequest.get({ plain: true }),
            };
        } catch (err) {
            console.log("err", err);
            logErrorToFile(err, "CREATE BLOOD REQUEST");
            await transaction.rollback();

            return handleValidationError(err);
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function updateBloodRequest(requestId, formData) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        console.log("updateBloodRequest formData received on server", formData);
        const parsed = bloodRequestSchema.safeParse(formData);

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
                // Convert empty strings in data to null
        const formattedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                value === "" ? null : value,
            ])
        );

        const transaction = await sequelize.transaction();

        try {
            const bloodRequest = await BloodRequest.findByPk(requestId, {
                transaction,
            });

            if (!bloodRequest) {
                return {
                    success: false,
                    message: "Database Error: Blood Request ID Not found",
                };
            }

            if (bloodRequest?.status !== "pending") {
                return {
                    success: false,
                    message: `You are not allowed to update this request if the status is already "${bloodRequest?.status}".`,
                };
            }

            const updatedBloodRequest = await bloodRequest.update(formattedData, {
                transaction,
            });

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "blood_requests",
                action: "UPDATE",
                details: `Blood request has been successfully updated. ID#: ${updatedBloodRequest.id}`,
            });

            return {
                success: true,
                data: updatedBloodRequest.get({ plain: true }),
            };
        } catch (err) {
            logErrorToFile(err, "UPDATE BLOOD REQUEST");
            await transaction.rollback();

            return handleValidationError(err);
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function updateBloodRequestStatus(formData) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        const { id, status, remarks } = formData;

        if (!id || !status) {
            return {
                success: false,
                message: "Blood request ID and status are required.",
            };
        }

        const transaction = await sequelize.transaction();

        try {
            const bloodRequest = await BloodRequest.findByPk(id, {
                transaction,
            });

            if (!bloodRequest) {
                return {
                    success: false,
                    message: "Database Error: Blood Request ID Not found",
                };
            }

            const currentStatus = bloodRequest.status;
            const updatedBloodRequest = await bloodRequest.update(
                { status, remarks },
                { transaction }
            );

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "blood_requests",
                action: "UPDATE STATUS",
                details: `Blood request status updated from "${currentStatus}" to "${status}" for ID#: ${
                    updatedBloodRequest.id
                }. ${remarks ? `Remarks: ${remarks}` : ""}`,
            });

            return {
                success: true,
                data: updatedBloodRequest.get({ plain: true }),
            };
        } catch (err) {
            logErrorToFile(err, "UPDATE BLOOD REQUEST STATUS");
            await transaction.rollback();

            return handleValidationError(err);
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

export async function deleteBloodRequest(id) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        const transaction = await sequelize.transaction();

        try {
            const bloodRequest = await BloodRequest.findByPk(id, {
                transaction,
            });

            if (!bloodRequest) {
                return {
                    success: false,
                    message: "Database Error: Blood Request ID Not found",
                };
            }

            await bloodRequest.destroy({ transaction });

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "blood_requests",
                action: "DELETE",
                details: `Blood request has been successfully deleted. ID#: ${id}`,
            });

            return {
                success: true,
                message: "Blood request deleted successfully",
            };
        } catch (err) {
            logErrorToFile(err, "DELETE BLOOD REQUEST");
            await transaction.rollback();

            return handleValidationError(err);
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}
