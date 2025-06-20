import { z } from "zod";

export const ScreeningQuestionSchema = z.object({
    question_text: z.string().min(1),
    question_type: z.enum(["GENERAL", "MEDICAL", "TRAVEL", "LIFESTYLE"]),
    is_active: z.boolean().optional(),
});
