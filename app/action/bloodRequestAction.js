"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";
import { logErrorToFile } from "@lib/logger.server";
import {
    BloodRequest,
    BloodType,
    Donor,
    Role,
    User,
    sequelize,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { bloodRequestSchema } from "@lib/zod/bloodRequestSchema";
import { handleValidationError } from "@lib/utils/validationErrorHandler";
import { getAgencyId, getAgencyIdBySession } from "./hostEventAction";
import { format } from "date-fns";

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
                    model: User,
                    as: "creator",
                    attributes: [
                        "first_name",
                        "middle_name",
                        "last_name",
                        "full_name",
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

        formattedData.created_by = user.id;

        const { success, message, agency_id } = await getAgencyIdBySession();

        if (!success) {
            return {
                success: false,
                message,
            };
        }

        // If user_id is provided, verify it belongs to the current agency
        if (data.user_id) {
            if (agency_id) {
                const donor = await sequelize.models.Donor.findOne({
                    where: {
                        user_id: data.user_id,
                        agency_id,
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
                details: `A new blood request has been successfully created by ${
                    user.name || user.email
                }. ID#: ${newBloodRequest.id} - Component: ${
                    newBloodRequest.blood_component
                }, Units: ${newBloodRequest.no_of_units}, Hospital: ${
                    newBloodRequest.hospital_name
                }`,
            });

            // Notify all admins (system notification and email)
            (async () => {
                try {
                    // Find all admin users
                    const adminRole = await sequelize.models.Role.findOne({
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
                            // System notification
                            await sendNotificationAndEmail({
                                userIds: adminUsers.map((a) => a.id),
                                notificationData: {
                                    subject: "New Blood Request Submitted",
                                    message: `A new blood request (ID: ${
                                        newBloodRequest?.blood_request_reference_id
                                    }) has been submitted by ${
                                        user.name || user.email
                                    }. Please review and process the request.`,
                                    type: "BLOOD_REQUEST_APPROVAL",
                                    reference_id:
                                        newBloodRequest?.id.toString(),
                                    created_by: user.id,
                                },
                            });

                            let donor = null;
                            if (newBloodRequest?.user_id) {
                                donor = await Donor.findOne({
                                    where: {
                                        user_id: newBloodRequest.user_id,
                                    },
                                    attributes: [
                                        "id",
                                        "blood_type_id",
                                        "date_of_birth",
                                    ],
                                    include: [
                                        {
                                            model: sequelize.models.BloodType,
                                            as: "blood_type",
                                            attributes: ["blood_type"],
                                        },
                                        {
                                            model: User,
                                            as: "user",
                                            attributes: [
                                                "id",
                                                "first_name",
                                                "last_name",
                                                "full_name",
                                                "email",
                                                "gender",
                                            ],
                                        },
                                    ],
                                });
                            }

                            // Email notification
                            for (const admin of adminUsers) {
                                await sendNotificationAndEmail({
                                    emailData: {
                                        to: admin.email,
                                        templateCategory: "NEW_BLOOD_REQUEST",
                                        templateData: {
                                            blood_request_id:
                                                newBloodRequest?.blood_request_reference_id.toString(),
                                            blood_component:
                                                newBloodRequest?.blood_component,
                                            patient_name: donor
                                                ? donor.user.full_name
                                                : newBloodRequest?.patient_name ||
                                                  "Not specified",
                                            patient_gender: donor
                                                ? donor.user.gender
                                                : newBloodRequest?.patient_gender ||
                                                  "Not specified",
                                            patient_date_of_birth: donor
                                                ? format(
                                                      donor?.date_of_birth,
                                                      "PPPP"
                                                  )
                                                : newBloodRequest?.patient_date_of_birth
                                                ? format(
                                                      newBloodRequest?.patient_date_of_birth,
                                                      "PPPP"
                                                  )
                                                : "Not specified",
                                            blood_type:
                                                newBloodRequest?.blood_type_id
                                                    ? (
                                                          await sequelize.models.BloodType.findByPk(
                                                              newBloodRequest?.blood_type_id
                                                          )
                                                      )?.blood_type ||
                                                      "Not specified"
                                                    : "Not specified",
                                            no_of_units:
                                                newBloodRequest?.no_of_units.toString(),
                                            diagnosis:
                                                newBloodRequest?.diagnosis,
                                            hospital_name:
                                                newBloodRequest?.hospital_name,
                                            request_date: newBloodRequest?.date
                                                ? format(
                                                      newBloodRequest?.date,
                                                      "PPPP"
                                                  )
                                                : "Not specified",
                                            requested_by:
                                                user.name || user.email,
                                            system_name:
                                                process.env
                                                    .NEXT_PUBLIC_SYSTEM_NAME ||
                                                "",
                                            support_email:
                                                process.env
                                                    .NEXT_PUBLIC_SMTP_SUPPORT_EMAIL ||
                                                "",
                                            support_contact:
                                                process.env
                                                    .NEXT_PUBLIC_SMTP_SUPPORT_CONTACT ||
                                                "",
                                            domain_url:
                                                process.env
                                                    .NEXT_PUBLIC_APP_URL || "",
                                        },
                                    },
                                });
                            }
                        }
                    }
                } catch (err) {
                    console.error(
                        "Admin notification for new blood request failed:",
                        err
                    );
                }
            })();

            return {
                success: true,
                message:
                    "Your blood request has been submitted successfully. A notification has been sent to the blood donation team. You will be updated once the request is fulfilled.",
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

            const updatedBloodRequest = await bloodRequest.update(
                formattedData,
                {
                    transaction,
                }
            );

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "blood_requests",
                action: "UPDATE",
                details: `Blood request has been successfully updated by ${
                    user.name || user.email
                }. ID#: ${updatedBloodRequest.id}`,
            });

            // Notify all admins (system notification and email)
            (async () => {
                try {
                    // Find all admin users
                    const adminRole = await sequelize.models.Role.findOne({
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
                            // System notification
                            await sendNotificationAndEmail({
                                userIds: adminUsers.map((a) => a.id),
                                notificationData: {
                                    subject: "Updated Blood Request",
                                    message: `The blood request (ID: ${
                                        updatedBloodRequest.id
                                    }) has been updated by ${
                                        user.name || user.email
                                    }. Please review and process the request.`,
                                    type: "BLOOD_REQUEST_APPROVAL",
                                    reference_id:
                                        updatedBloodRequest.id.toString(),
                                    created_by: user.id,
                                },
                            });
                        }
                    }
                } catch (err) {
                    console.error(
                        "Admin notification for new blood request failed:",
                        err
                    );
                }
            })();

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
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "id",
                            "email",
                            "first_name",
                            "last_name",
                            "full_name",
                            "gender",
                        ],
                        include: [
                            {
                                model: sequelize.models.Donor,
                                as: "donor",
                                attributes: ["date_of_birth"],
                            },
                        ],
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: [
                            "id",
                            "email",
                            "first_name",
                            "middle_name",
                            "last_name",
                            "full_name",
                        ],
                    },
                    {
                        model: BloodType,
                        as: "blood_type",
                        attributes: ["blood_type"],
                    },
                ],
            });

            if (!bloodRequest) {
                return {
                    success: false,
                    message: "Database Error: Blood Request ID Not found",
                };
            }

            const currentStatus = bloodRequest.status;
            const updatedBloodRequest = await bloodRequest.update(
                { status, remarks, updated_by: user?.id },
                { transaction }
            );

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "blood_requests",
                action: "UPDATE STATUS",
                details: `Blood request status updated from "${currentStatus}" to "${status}" for ID#: ${
                    updatedBloodRequest.blood_request_reference_id ||
                    updatedBloodRequest.id
                }. ${remarks ? `Remarks: ${remarks}` : ""}`,
            });

            // Notifications and emails (non-blocking)

            (async () => {
                // Send system notification to blood request user
                try {
                    await sendNotificationAndEmail({
                        userIds: bloodRequest?.created_by,
                        notificationData: {
                            subject: "Blood Request Status Update",
                            message: `Your blood request (ID: ${
                                bloodRequest?.blood_request_reference_id ||
                                bloodRequest?.id
                            }) status has been updated from "${currentStatus}" to "${status}".`,
                            type: "BLOOD_REQUEST_APPROVAL",
                            reference_id: bloodRequest.id.toString(),
                            created_by: user.id,
                        },
                    });
                } catch (err) {
                    console.error("Blood request notification failed:", err);
                }

                // Send email notification to blood request user
                try {
                    let status_message = "";
                    let status_style = "";
                    switch (status.toUpperCase()) {
                        case "FULFILLED":
                            status_message =
                                "✅ Request Fulfilled<br>Your blood request has been successfully fulfilled. The blood units have been allocated and are ready for use.";
                            status_style =
                                "background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;";
                            break;
                        case "REJECTED":
                            status_message =
                                "❌ Request Rejected<br>Your blood request has been rejected. Please see remarks for more details.";
                            status_style =
                                "background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b;";
                            break;
                        case "CANCELLED":
                            status_message =
                                "❌ Request Cancelled<br>Your blood request has been cancelled. If you need to submit a new request, please contact us.";
                            status_style =
                                "background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b;";
                            break;
                        case "PENDING":
                        default:
                            status_message =
                                "⏳ Request Pending<br>Your blood request is currently being reviewed. We will notify you once the status changes.";
                            status_style =
                                "background-color: #fef3c7; border: 1px solid #fde68a; color: #92400e;";
                            break;
                    }

                    await sendNotificationAndEmail({
                        emailData: {
                            to: bloodRequest?.creator?.email,
                            templateCategory: "BLOOD_REQUEST_APPROVAL",
                            templateData: {
                                user_name: bloodRequest?.creator?.full_name,
                                user_email: bloodRequest?.creator?.email,
                                blood_request_id:
                                    bloodRequest?.blood_request_reference_id ||
                                    bloodRequest.id.toString(),
                                blood_component:
                                    bloodRequest?.blood_component?.toUpperCase(),
                                patient_name: bloodRequest?.user
                                    ? bloodRequest?.user?.full_name
                                    : bloodRequest?.patient_name ||
                                      "Not specified",
                                patient_gender: bloodRequest?.user
                                    ? bloodRequest?.user?.gender
                                    : bloodRequest?.patient_gender ||
                                      "Not specified",
                                patient_date_of_birth: bloodRequest?.user
                                    ? format(
                                          bloodRequest?.user?.donor
                                              ?.date_of_birth,
                                          "PPPP"
                                      )
                                    : bloodRequest?.patient_date_of_birth
                                    ? format(
                                          bloodRequest?.patient_date_of_birth,
                                          "PPPP"
                                      )
                                    : "Not specified",
                                blood_type:
                                    bloodRequest.blood_type?.blood_type ||
                                    "Not specified",
                                no_of_units:
                                    bloodRequest.no_of_units.toString(),
                                diagnosis: bloodRequest.diagnosis,
                                hospital_name: bloodRequest.hospital_name,
                                request_date: bloodRequest?.date
                                    ? format(bloodRequest.date, "PPPP")
                                    : "Not specified",
                                request_status: status.toUpperCase(),
                                status_update_date:
                                    new Date().toLocaleDateString(),
                                status_remarks:
                                    remarks || "No remarks provided",
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
                                status_message,
                                status_style,
                            },
                        },
                    });
                } catch (err) {
                    console.error("Blood request email failed:", err);
                }
            })();

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
