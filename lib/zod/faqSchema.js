import { z } from "zod";

// Base FAQ schema
export const faqSchema = z.object({
    id: z.optional(z.number().int()),
    question: z
        .string({
            required_error: "Question is required",
            invalid_type_error: "Please enter a valid question",
        })
        .min(10, "Question must be at least 10 characters long")
        .max(500, "Question must not exceed 500 characters"),
    answer: z
        .string({
            required_error: "Answer is required",
            invalid_type_error: "Please enter a valid answer",
        })
        .min(20, "Answer must be at least 20 characters long")
        .max(5000, "Answer must not exceed 5000 characters"),
    category: z.enum(
        [
            "general",
            "donation_process",
            "eligibility",
            "health_safety",
            "appointments",
            "account",
            "blood_types",
            "after_donation",
        ],
        {
            required_error: "Category is required",
            invalid_type_error: "Please select a valid category",
        }
    ),
    keywords: z
        .array(z.string())
        .optional()
        .default([])
        .refine((keywords) => keywords.length <= 10, {
            message: "Maximum 10 keywords allowed",
        }),
    display_order: z
        .number()
        .int()
        .min(0, "Display order must be a positive number")
        .optional()
        .default(0),
    is_active: z.boolean().optional().default(true),
    created_by: z.optional(z.string().uuid()),
    updated_by: z.optional(z.string().uuid().nullable()),
});

// Create FAQ schema (excludes id, created_by, updated_by)
export const createFaqSchema = faqSchema.omit({
    id: true,
    created_by: true,
    updated_by: true,
});

// Update FAQ schema (requires id)
export const updateFaqSchema = faqSchema
    .omit({
        created_by: true,
    })
    .extend({
        id: z.number().int().positive("FAQ ID is required"),
    });
