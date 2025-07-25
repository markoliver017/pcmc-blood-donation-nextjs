import { z } from "zod";

export const ScreeningQuestionSchema = z.object({
    question_text: z.string().min(1),
    question_type: z.enum(["GENERAL", "MEDICAL", "TRAVEL", "LIFESTYLE"]),
    expected_response: z.enum(["YES", "NO", "N/A"]),
    is_active: z.boolean().optional(),
});

// Validation helper for server actions
export const validateScreeningQuestion = (input) => {
    try {
        return {
            success: true,
            data: ScreeningQuestionSchema.parse(input),
        };
    } catch (error) {
        return {
            success: false,
            error: error.errors,
        };
    }
};
