import { z } from "zod";


export const bloodHistorySchema = z.object({
    previous_donation_count: z.coerce.number({
        message: "Number of donation must be a number"
    })
        .min(1, { message: "Number of donation must be at least 1" })
        .max(250, { message: "Number of donation must not exceed to 250" }),
    previous_donation_volume: z.coerce.number({
        message: "Volume must be a number"
    })
        .optional(),
    updated_by: z
        .string({
            required_error: "User ID is required as the editor.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid()
        .optional(),
});