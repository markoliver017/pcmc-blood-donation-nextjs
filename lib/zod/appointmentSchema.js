import { z } from "zod";

export const appointmentDetailsSchema = z
    .object({
        collection_method: z.nativeEnum(["whole blood", "apheresis"], {
            errorMap: () => {
                return {
                    message:
                        "Collection method cannot be empty. Please select a valid option.",
                };
            },
        }),
        donor_type: z
            .string()
            .min(1, "Donor type is required")
            .refine(
                (val) => ["replacement", "volunteer"].includes(val),
                "Invalid donor type"
            ),

        patient_name: z.string().optional(),
        relation: z.string().optional(),
        comments: z.string().optional(),

        status: z
            .string()
            .min(1, "Status is required")
            .refine(
                (val) => ["registered", "no show", "cancelled"].includes(val),
                "Invalid status"
            ),
        updated_by: z
            .string({
                required_error: "User ID is required as the editor.",
                invalid_type_error: "Invalid user ID format.",
            })
            .uuid()
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.donor_type === "replacement") {
            if (!data.patient_name?.trim()) {
                ctx.addIssue({
                    path: ["patient_name"],
                    code: z.ZodIssueCode.custom,
                    message: "Patient name is required for replacement donors",
                });
            }
            if (!data.relation?.trim()) {
                ctx.addIssue({
                    path: ["relation"],
                    code: z.ZodIssueCode.custom,
                    message: "Relation is required for replacement donors",
                });
            }
        }
    });
