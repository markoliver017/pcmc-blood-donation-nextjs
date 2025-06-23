import { z } from "zod";
const bloodPressureRegex = /^\d{2,3}\/\d{2,3}$/;
const hemoglobinRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;

export const physicalExaminationSchema = z
    .object({
        // donor_id: z.number().int().nonnegative(),
        // appointment_id: z.number().int().nonnegative(),
        // event_id: z.number().int().nonnegative(),
        // examiner_id: z.number().int().nonnegative(),
        blood_pressure: z.string().max(20).regex(bloodPressureRegex, {
            message: "Blood pressure must be in the format '###/###'",
        }),
        pulse_rate: z.coerce.number().int().nonnegative(),
        hemoglobin_level: z.string().regex(hemoglobinRegex, {
            message: "Hemoglobin level must be in the format '###/###'",
        }),
        weight: z.coerce
            .number()
            .min(50, {
                message: "Eligible weight must be greater or equal to 50.",
            })
            .max(999.99),
        temperature: z.coerce.number().nonnegative().max(99.9),
        eligibility_status: z.nativeEnum(
            ["ACCEPTED", "TEMPORARILY-DEFERRED", "PERMANENTLY-DEFERRED"],
            {
                errorMap: () => {
                    return {
                        message:
                            "Eligibility status cannot be empty. Please select a valid option.",
                    };
                },
            }
        ),
        deferral_reason: z.string().optional(),
        remarks: z.string().optional(),
        examiner_id: z
            .string({
                required_error: "User ID is required as the examiner.",
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
    })
    .refine(
        (data) => {
            if (data.eligibility_status !== "ACCEPTED") {
                return !!data.deferral_reason; //!!conversion to true / false
            }
            return true;
        },
        {
            message: "Please specify the reason for deferral to proceed.",
            path: ["deferral_reason"],
        }
    );
