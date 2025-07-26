"use server";

import { revalidatePath } from "next/cache";
import { FeedbackQuestion } from "@lib/models";
import { createFeedbackQuestionSchema, updateFeedbackQuestionSchema } from "@lib/zod/feedbackQuestionSchema";
import { auth } from "@lib/auth";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { extractErrorMessage, handleValidationError } from "@lib/utils/validationErrorHandler";
import { logErrorToFile } from "@lib/logger.server";
import { formatSeqObj } from "@lib/utils/object.utils";

export async function createFeedbackQuestion(formData) {
    try {
        const validatedData = createFeedbackQuestionSchema.parse(formData);
        const newFeedbackQuestion = await FeedbackQuestion.create(validatedData);

        revalidatePath("/portal/admin/feedbacks");
        return {
            success: true,
            message: "Successfully created a new feedback question.",
            data: formatSeqObj(newFeedbackQuestion),
        };
    } catch (error) {
        if (error.name === "ZodError") {
            return { success: false, message: "Validation failed", errors: error.errors };
        }
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
}

export async function updateFeedbackQuestion(id, formData) {
    console.log("id", id);
    console.log("formData", formData);

    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;

    const parsed = updateFeedbackQuestionSchema.safeParse(formData);

    if (!parsed.success) {
        return handleValidationError(parsed.error);
    }

    const { data } = parsed;
    
    const question = await FeedbackQuestion.findByPk(id);
    if (!question) {
        return {
            success: false,
            message: "Feedback question not found.",
        };
    }

    try {
        await question.update(data);

        await logAuditTrail({
            userId: user.id,
            controller: "feedbackQuestionAction",
            action: "UPDATE FeedbackQuestion",
            details: `Feedback question (ID: ${id}) updated.`,
        });

        revalidatePath("/portal/admin/feedbacks");

        return {
            success: true,
            message: "Successfully updated the feedback question.",
        };
    } catch (err) {
        logErrorToFile(err, "updateFeedbackQuestion");
        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function getFeedbackQuestions() {
    try {
        const questions = await FeedbackQuestion.findAll({
            order: [["createdAt", "DESC"]],
        });
        return { success: true, data: JSON.parse(JSON.stringify(questions)) };
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch questions." };
    }
}

export async function deleteFeedbackQuestion(id) {
    try {
        const question = await FeedbackQuestion.findByPk(id);

        if (!question) {
            return { success: false, message: "Question not found." };
        }

        await question.destroy();

        revalidatePath("/portal/admin/feedbacks");
        return { success: true, message: "Question deleted successfully." };
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
}
