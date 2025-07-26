import { z } from "zod";

export const feedbackResponseSchema = z.object({
    responses: z.array(
        z.object({
            feedback_question_id: z.string().uuid(),
            rating: z.number().min(1, "Rating must be at least 1.").max(5, "Rating must be at most 5."),
        })
    ).min(1, "At least one feedback response is required."),
    donor_appointment_id: z.number().int().positive("Invalid appointment ID."),
});
