import { z } from "zod";

export const ScreeningDetailSchema = z.object({
    physical_examination_id: z.number().int().nonnegative(),
    question_id: z.number().int().nonnegative(),
    response: z.enum(["YES", "NO", "N/A"]),
    additional_info: z.string().optional(),
});
