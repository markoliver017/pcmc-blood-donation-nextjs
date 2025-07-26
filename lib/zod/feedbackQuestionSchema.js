import { z } from "zod";

export const createFeedbackQuestionSchema = z.object({
    question_text: z.string().min(1, "Question text is required."),
});

export const updateFeedbackQuestionSchema = z.object({
    question_text: z.string().min(1, "Question text is required.").optional(),
    is_active: z.optional(z.boolean()),
});
