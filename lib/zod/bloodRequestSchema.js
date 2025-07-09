import { z } from "zod";

export const bloodRequestSchema = z
    .object({
        blood_component: z.enum(
            ["whole blood", "plasma", "platelets"],
            {
                errorMap: () => {
                    return {
                        message: "Blood component is required",
                    };
                },
            },
            {
                required_error: "Blood component is required",
                invalid_type_error: "Blood component is required",
            }
        ),
        agency_id: z.coerce.number(),
        blood_type_id: z.string().min(1, "Blood type is required"),
        no_of_units: z
            .number({
                required_error: "Number of units is required",
                invalid_type_error:
                    "Number of units is required, must be a number",
            })
            .min(1, "Must request at least 1 unit"),
        diagnosis: z.string().min(1, "Diagnosis is required"),
        date: z.string().min(1, "Date needed is required"),
        hospital_name: z.string().min(2, "Hospital name is required").max(255),
        user_id: z.string().nullable(),
        patient_name: z.string().optional(),
        patient_date_of_birth: z.string().optional(),
        patient_gender: z.enum(["male", "female"]).optional(),
        file_url: z.optional(z.string().url("Invalid URL").nullable()),
        file: z
            .any()
            .optional()
            // .refine((file) => !file || file.size <= 1024 * 1024 * 2, {
            //     message: "File size should be less than 2MB",
            // })
            .refine(
                (file) => !file || ["application/pdf"].includes(file.type),
                {
                    message: "Only PDF files are supported",
                }
            ),
    })
    .superRefine((data, ctx) => {
        // If no user_id is provided, patient details are required
        if (!data.user_id) {
            if (!data.patient_name) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Patient name is required when no donor is selected",
                    path: ["patient_name"],
                });
            }
            if (!data.patient_date_of_birth) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Patient date of birth is required when no donor is selected",
                    path: ["patient_date_of_birth"],
                });
            }
            if (!data.patient_gender) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Patient gender is required when no donor is selected",
                    path: ["patient_gender"],
                });
            }
        }

        // Validate that date is not in the past
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Date needed cannot be in the past",
                path: ["date"],
            });
        }
    });
