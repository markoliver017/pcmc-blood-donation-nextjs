import { z } from "zod";


export const bloodCollectionchema = z.object({


    volume: z.coerce.number({
        message: "Volume must be a number"
    })
        .min(50, { message: "Volume must be at least 50 ml" })
        .max(1000, { message: "Volume must not exceed 1000 ml" }),
    remarks: z.string().optional(),
    collector_id: z
        .string({
            required_error: "User ID is required as the collector.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid()
        .optional(),
    updated_by: z
        .string({
            required_error: "User ID is required as the editor.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid()
        .optional(),
});