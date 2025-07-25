"use server";

import { auth } from "@lib/auth";
import { ScreeningQuestion } from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";
import { validateScreeningQuestion } from "@lib/zod/screeningQuestionSchema";
import { revalidatePath } from "next/cache";

// Helper to check admin role
async function requireAdminRole() {
    const session = await auth();
    if (!session?.user || session.user.role_name !== "Admin") {
        return {
            success: false,
            message: "Unauthorized: Admin role required",
        };
    }
    return {
        success: true,
        user: session.user,
    };
}

// Get all screening questions with pagination
export async function getAllScreeningQuestions(page = 1, limit = 10) {
    try {
        const { success, message } = await requireAdminRole();
        if (!success) {
            return {
                success: false,
                message,
            };
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await ScreeningQuestion.findAndCountAll({
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });

        return {
            success: true,
            data: {
                questions: formatSeqObj(rows),
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit),
                },
            },
        };
    } catch (error) {
        console.error("Error fetching screening questions:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}

// Create new screening question
export async function createScreeningQuestion(data) {
    try {
        const { success, message } = await requireAdminRole();
        if (!success) {
            return {
                success: false,
                message,
            };
        }

        const validation = validateScreeningQuestion(data);
        if (!validation.success) {
            return {
                success: false,
                error: "Validation failed",
                details: validation.error,
            };
        }

        const question = await ScreeningQuestion.create(validation.data);

        revalidatePath("/portal/admin/screening-questions");

        return {
            success: true,
            data: formatSeqObj(question),
            message: "Screening question created successfully",
        };
    } catch (error) {
        console.error("Error creating screening question:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}

// Update screening question
export async function updateScreeningQuestion(id, data) {
    try {
        const { success, message } = await requireAdminRole();
        if (!success) {
            return {
                success: false,
                message,
            };
        }

        const validation = validateScreeningQuestion(data);
        if (!validation.success) {
            return {
                success: false,
                error: "Validation failed",
                details: validation.error,
            };
        }

        const question = await ScreeningQuestion.findByPk(id);
        if (!question) {
            return {
                success: false,
                error: "Screening question not found",
            };
        }

        await question.update(validation.data);

        revalidatePath("/portal/admin/screening-questions");

        return {
            success: true,
            data: formatSeqObj(question),
            message: "Screening question updated successfully",
        };
    } catch (error) {
        console.error("Error updating screening question:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}

// Delete screening question
export async function deleteScreeningQuestion(id) {
    try {
        const { success, message } = await requireAdminRole();
        if (!success) {
            return {
                success: false,
                message,
            };
        }

        const question = await ScreeningQuestion.findByPk(id);
        if (!question) {
            return {
                success: false,
                error: "Screening question not found",
            };
        }

        await question.destroy();

        revalidatePath("/portal/admin/screening-questions");

        return {
            success: true,
            message: "Screening question deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting screening question:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}
