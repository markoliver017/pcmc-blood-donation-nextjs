"use server";

import { z } from "zod";
import { AuditTrail, User } from "@lib/models";
import { Op } from "sequelize";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";

// Zod schemas
const fetchAuditTrailsSchema = z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(20),
    filters: z
        .object({
            user_id: z.string().uuid().optional(),
            controller: z.string().optional(),
            action: z.string().optional(),
            user_email: z.string().optional(),
            is_error: z.boolean().optional(),
            date_from: z.string().optional(), // ISO date
            date_to: z.string().optional(), // ISO date
        })
        .optional(),
    search: z.string().optional(),
});

const fetchAuditTrailByIdSchema = z.object({
    id: z.number().or(z.string()),
});

const deleteAuditTrailSchema = z.object({
    id: z.number().or(z.string()),
});

// Fetch paginated audit trails
export async function fetchAuditTrails(input) {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const { page, pageSize, filters, search } =
            fetchAuditTrailsSchema.safeParse(input).success
                ? fetchAuditTrailsSchema.parse(input)
                : { page: 1, pageSize: 20, filters: {}, search: "" };
        const where = {};
        const searchConditions = [];
        
        // Filters
        if (filters) {
            if (filters.user_id && filters.user_id !== "All") {
                where.user_id = filters.user_id;
            }
            if (filters.controller && filters.controller !== "All") {
                where.controller = filters.controller;
            }
            if (filters.action && filters.action !== "All") {
                where.action = filters.action;
            }
            if (typeof filters.is_error === "boolean") {
                where.is_error = filters.is_error;
            }

            
            if (filters.date_from || filters.date_to) {
                where.createdAt = {};
                if (filters.date_from) {
                    where.createdAt[Op.gte] = new Date(filters.date_from);
                }
                if (filters.date_to) {
                const dateToString = filters.date_to.length <= 10
                    ? `${filters.date_to}T23:59:59`
                    : filters.date_to;
                    where.createdAt[Op.lte] = new Date(dateToString);
                }
            }
        }

        // Search (details, stack_trace, user email)
        if (search && search.trim()) {
            const s = `%${search.trim()}%`;
            searchConditions.push(
                { details: { [Op.like]: s } },
                { stack_trace: { [Op.like]: s } },
                { '$user.email$': { [Op.like]: s } }
            );
        }

        // User email filter (separate from search)
        if (filters?.user_email && filters.user_email.trim()) {
            searchConditions.push({
                '$user.email$': { [Op.like]: `%${filters.user_email.trim()}%` }
            });
        }
        console.log("filters", filters);
        console.log("searchConditions", searchConditions);
        console.log("where", where);

        // Combine search conditions with other filters
        if (searchConditions.length > 0) {
            if (Object.keys(where).length > 0) {
                // We have both filters and search - use AND logic
                where[Op.and] = [
                    { ...where },
                    { [Op.or]: searchConditions }
                ];
                // Remove the original properties since we're using AND
                Object.keys(where).forEach(key => {
                    if (key !== Op.and) {
                        delete where[key];
                    }
                });
            } else {
                // Only search conditions - use OR logic
                where[Op.or] = searchConditions;
            }
        }

        const { count, rows } = await AuditTrail.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "first_name", "last_name"],
                },
            ],
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });

        return {
            success: true,
            data: formatSeqObj(rows),
            total: count,
            page,
            pageSize,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            return {
                success: false,
                type: "validation",
                message: "Please check your input and try again.",
                errorObj: error.flatten().fieldErrors,
                errorArr: Object.values(fieldErrors).flat(),
            };
        }
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(error),
        };
    }
}

// Fetch single audit trail by ID
export async function fetchAuditTrailById(input) {
    try {
        const parsed = fetchAuditTrailByIdSchema.safeParse(input);
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
        const { id } = parsed.data;
        const auditTrail = await AuditTrail.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "first_name", "last_name"],
                },
            ],
        });
        if (!auditTrail) {
            return {
                success: false,
                type: "not_found",
                message: "Audit trail not found",
            };
        }
        return {
            success: true,
            data: formatSeqObj(auditTrail),
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            return {
                success: false,
                type: "validation",
                message: "Please check your input and try again.",
                errorObj: error.flatten().fieldErrors,
                errorArr: Object.values(fieldErrors).flat(),
            };
        }
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(error),
        };
    }
}

// Delete audit trail by ID
export async function deleteAuditTrail(input) {
    try {
        const parsed = deleteAuditTrailSchema.safeParse(input);
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
        const { id } = parsed.data;
        const auditTrail = await AuditTrail.findByPk(id);
        if (!auditTrail) {
            return {
                success: false,
                type: "not_found",
                message: "Audit trail not found",
            };
        }
        await auditTrail.destroy();
        // Log audit trail for deletion (background, non-blocking)
        (async () => {
            try {
                await logAuditTrail({
                    userId: auditTrail.user_id,
                    controller: "audit_trails",
                    action: "DELETE",
                    details: `Audit trail deleted. ID#: ${auditTrail.id}`,
                });
            } catch (err) {
                console.error("Audit trail log failed:", err);
            }
        })();
        return {
            success: true,
            message: "Audit trail deleted successfully",
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            return {
                success: false,
                type: "validation",
                message: "Please check your input and try again.",
                errorObj: error.flatten().fieldErrors,
                errorArr: Object.values(fieldErrors).flat(),
            };
        }
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(error),
        };
    }
}
