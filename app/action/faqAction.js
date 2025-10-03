"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import { Faq, sequelize, User } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { createFaqSchema, updateFaqSchema } from "@lib/zod/faqSchema";
import { Op } from "sequelize";
import { handleValidationError } from "@lib/utils/validationErrorHandler";

/**
 * Fetch all FAQs with optional filtering
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Filter by category
 * @param {boolean} filters.is_active - Filter by active status
 * @param {string} filters.search - Search in question, answer, and keywords
 * @returns {Promise<Object>} Response object with FAQs data
 */
export async function fetchFaqs(filters = {}) {
    try {
        const session = await auth();

        // Public access for active FAQs, admin access for all
        const isAdmin = session?.user?.role_name === "Admin";

        let whereClause = {};

        // If not admin, only show active FAQs
        if (!isAdmin) {
            whereClause.is_active = true;
        } else if (
            filters.is_active !== undefined &&
            filters.is_active !== null
        ) {
            // Admin can filter by active status
            whereClause.is_active = filters.is_active;
        }

        // Filter by category
        if (filters.category) {
            whereClause.category = filters.category;
        }

        // Search functionality
        if (filters.search) {
            const searchTerm = `%${filters.search}%`;
            const escapedSearch = filters.search.replace(/'/g, "\\'");
            whereClause[Op.or] = [
                { question: { [Op.like]: searchTerm } },
                { answer: { [Op.like]: searchTerm } },
                sequelize.literal(
                    `JSON_SEARCH(keywords, 'one', '${escapedSearch}') IS NOT NULL`
                ),
            ];
        }

        const includeClause = [];

        // Include creator and updater info for admin
        if (isAdmin) {
            includeClause.push(
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: User,
                    as: "updater",
                    attributes: ["id", "name", "email"],
                }
            );
        }

        const faqs = await Faq.findAll({
            where: whereClause,
            include: includeClause,
            order: [
                ["display_order", "ASC"],
                ["createdAt", "DESC"],
            ],
        });

        return { success: true, data: formatSeqObj(faqs) };
    } catch (error) {
        console.error("fetchFaqs error:", error);
        logErrorToFile(error, "FETCH FAQS");
        return { success: false, message: extractErrorMessage(error) };
    }
}

/**
 * Fetch a single FAQ by ID
 * @param {number} id - FAQ ID
 * @returns {Promise<Object>} Response object with FAQ data
 */
export async function fetchFaqById(id) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        // Only admin can fetch FAQ details
        if (user.role_name !== "Admin") {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const faq = await Faq.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: User,
                    as: "updater",
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        if (!faq) {
            return {
                success: false,
                message: "FAQ not found.",
            };
        }

        return { success: true, data: formatSeqObj(faq) };
    } catch (error) {
        console.error("fetchFaqById error:", error);
        logErrorToFile(error, "FETCH FAQ BY ID");
        return { success: false, message: extractErrorMessage(error) };
    }
}

/**
 * Create a new FAQ
 * @param {Object} formData - FAQ data
 * @returns {Promise<Object>} Response object
 */
export async function storeFaq(formData) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        // Only admin can create FAQs
        if (user.role_name !== "Admin") {
            return {
                success: false,
                message: "You are not authorized to create FAQs.",
            };
        }

        console.log("storeFaq formData received on server", formData);

        // Validate form data
        const parsed = createFaqSchema.safeParse(formData);

        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            return {
                success: false,
                type: "validation",
                message: "Please check your input and try again.",
                errorObj: fieldErrors,
                errorArr: Object.values(fieldErrors).flat(),
            };
        }

        const { data } = parsed;

        // Set created_by
        data.created_by = user.id;

        const transaction = await sequelize.transaction();

        try {
            const newFaq = await Faq.create(data, { transaction });

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "faqs",
                action: "CREATE",
                details: `A new FAQ has been successfully created. ID#: ${
                    newFaq.id
                } (${newFaq.question.substring(0, 50)}...) by ${user?.name} (${
                    user?.email
                })`,
            });

            return {
                success: true,
                data: newFaq.get({ plain: true }),
                message: "FAQ created successfully.",
            };
        } catch (err) {
            logErrorToFile(err, "CREATE FAQ");
            await transaction.rollback();
            return handleValidationError(err);
        }
    } catch (error) {
        console.error("storeFaq error:", error);
        logErrorToFile(error, "STORE FAQ");
        return { success: false, message: extractErrorMessage(error) };
    }
}

/**
 * Update an existing FAQ
 * @param {number} id - FAQ ID
 * @param {Object} formData - Updated FAQ data
 * @returns {Promise<Object>} Response object
 */
export async function updateFaq(id, formData) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        // Only admin can update FAQs
        if (user.role_name !== "Admin") {
            return {
                success: false,
                message: "You are not authorized to update FAQs.",
            };
        }

        console.log("updateFaq formData received on server", formData);

        // Add id to formData for validation
        formData.id = id;

        // Validate form data
        const parsed = updateFaqSchema.safeParse(formData);

        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            return {
                success: false,
                type: "validation",
                message: "Please check your input and try again.",
                errorObj: fieldErrors,
                errorArr: Object.values(fieldErrors).flat(),
            };
        }

        const { data } = parsed;

        // Check if FAQ exists
        const existingFaq = await Faq.findByPk(id);

        if (!existingFaq) {
            return {
                success: false,
                message: "FAQ not found.",
            };
        }

        // Set updated_by
        data.updated_by = user.id;

        // Remove id from data object before update
        delete data.id;

        const transaction = await sequelize.transaction();

        try {
            await existingFaq.update(data, { transaction });

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "faqs",
                action: "UPDATE",
                details: `FAQ has been successfully updated. ID#: ${
                    existingFaq.id
                } (${existingFaq.question.substring(0, 50)}...) by ${
                    user?.name
                } (${user?.email})`,
            });

            return {
                success: true,
                data: existingFaq.get({ plain: true }),
                message: "FAQ updated successfully.",
            };
        } catch (err) {
            logErrorToFile(err, "UPDATE FAQ");
            await transaction.rollback();
            return handleValidationError(err);
        }
    } catch (error) {
        console.error("updateFaq error:", error);
        logErrorToFile(error, "UPDATE FAQ");
        return { success: false, message: extractErrorMessage(error) };
    }
}

/**
 * Delete a FAQ (soft delete by setting is_active to false)
 * @param {number} id - FAQ ID
 * @returns {Promise<Object>} Response object
 */
export async function deleteFaq(id) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        // Only admin can delete FAQs
        if (user.role_name !== "Admin") {
            return {
                success: false,
                message: "You are not authorized to delete FAQs.",
            };
        }

        const faq = await Faq.findByPk(id);

        if (!faq) {
            return {
                success: false,
                message: "FAQ not found.",
            };
        }

        const transaction = await sequelize.transaction();

        try {
            // Soft delete by setting is_active to false
            await faq.destroy({ transaction });

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "faqs",
                action: "DELETE",
                details: `FAQ has been successfully deleted. ID#: ${
                    faq.id
                } (${faq.question.substring(0, 50)}...) by ${user?.name} (${
                    user?.email
                })`,
            });

            return {
                success: true,
                message: "FAQ deleted successfully.",
            };
        } catch (err) {
            logErrorToFile(err, "DELETE FAQ");
            await transaction.rollback();
            return handleValidationError(err);
        }
    } catch (error) {
        console.error("deleteFaq error:", error);
        logErrorToFile(error, "DELETE FAQ");
        return { success: false, message: extractErrorMessage(error) };
    }
}

/**
 * Reorder FAQs by updating display_order
 * @param {Array} faqOrders - Array of {id, display_order}
 * @returns {Promise<Object>} Response object
 */
export async function reorderFaqs(faqOrders) {
    try {
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: "You are not authorized to access this request.",
            };
        }

        const { user } = session;

        // Only admin can reorder FAQs
        if (user.role_name !== "Admin") {
            return {
                success: false,
                message: "You are not authorized to reorder FAQs.",
            };
        }

        if (!Array.isArray(faqOrders) || faqOrders.length === 0) {
            return {
                success: false,
                message: "Invalid FAQ order data.",
            };
        }

        const transaction = await sequelize.transaction();

        try {
            // Update each FAQ's display_order
            const updatePromises = faqOrders.map(({ id, display_order }) =>
                Faq.update(
                    { display_order, updated_by: user.id },
                    { where: { id }, transaction }
                )
            );

            await Promise.all(updatePromises);

            await transaction.commit();

            await logAuditTrail({
                userId: user.id,
                controller: "faqs",
                action: "REORDER",
                details: `FAQs have been successfully reordered. ${faqOrders.length} FAQs updated by ${user?.name} (${user?.email})`,
            });

            return {
                success: true,
                message: "FAQs reordered successfully.",
            };
        } catch (err) {
            logErrorToFile(err, "REORDER FAQS");
            await transaction.rollback();
            return handleValidationError(err);
        }
    } catch (error) {
        console.error("reorderFaqs error:", error);
        logErrorToFile(error, "REORDER FAQS");
        return { success: false, message: extractErrorMessage(error) };
    }
}
