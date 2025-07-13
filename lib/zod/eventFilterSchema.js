import { z } from "zod";

export const eventFilterSchema = z.object({
    search: z.string().optional(),
    dateRange: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
    status: z.array(z.string()).optional(),
    agency_id: z.string().optional(),
}); 