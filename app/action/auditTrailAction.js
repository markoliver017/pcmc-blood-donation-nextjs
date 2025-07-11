"use server";

import { z } from "zod";
import { AuditTrail, User } from "@lib/models";
import { Op } from "sequelize";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";

// Zod schemas
const fetchAuditTrailsSchema = z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(20),
    filters: z
        .object({
            user_id: z.string().uuid().optional(),
            controller: z.string().optional(),
            action: z.string().optional(),
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
        // Filters
        if (filters) {
            if (filters.user_id) where.user_id = filters.user_id;
            if (filters.controller) where.controller = filters.controller;
            if (filters.action) where.action = filters.action;
            if (typeof filters.is_error === "boolean")
                where.is_error = filters.is_error;
            if (filters.date_from || filters.date_to) {
                where.createdAt = {};
                if (filters.date_from)
                    where.createdAt[Op.gte] = new Date(filters.date_from);
                if (filters.date_to)
                    where.createdAt[Op.lte] = new Date(filters.date_to);
            }
        }
        // Search (details, stack_trace, user email)
        if (search && search.trim()) {
            const s = `%${search.trim()}%`;
            where[Op.or] = [
                { details: { [Op.iLike]: s } },
                { stack_trace: { [Op.iLike]: s } },
            ];
        }
        const { count, rows } = await AuditTrail.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ["id", "email", "first_name", "last_name"],
                },
            ],
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });
        return {
            success: true,
            data: rows,
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
            data: auditTrail,
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
