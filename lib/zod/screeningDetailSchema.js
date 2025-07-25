import { z } from "zod";

export const screeningDetailSchema = z.object({
    donor_appointment_info_id: z.coerce.number({
        message: "Appointment ID is required.",
    }),
    question_id: z.number().int().positive({
        message: "Question ID is required.",
    }),
    response: z.enum(["YES", "NO", "N/A"], {
        required_error: "A response is required.",
    }),
    additional_info: z.string().optional(),
});

export const screeningQuestionnaireSchema = z.object({
    answers: z.array(screeningDetailSchema),
});
