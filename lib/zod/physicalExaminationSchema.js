import { z } from "zod";
const bloodPressureRegex = /^\d{2,3}\/\d{2,3}$/;

export const physicalExaminationSchema = z.object({
    // donor_id: z.number().int().nonnegative(),
    // appointment_id: z.number().int().nonnegative(),
    // event_id: z.number().int().nonnegative(),
    // examiner_id: z.number().int().nonnegative(),
    blood_pressure: z.string().max(20).regex(bloodPressureRegex, {
        message: "Blood pressure must be in the format '###/###'",
    }),
    pulse_rate: z.number().int().nonnegative(),
    hemoglobin_level: z.number().nonnegative().max(999.99),
    weight: z.number().nonnegative().max(999.99),
    temperature: z.number().nonnegative().max(99.9),
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
    created_by: z
        .string({
            required_error: "User ID is required as the creater.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid()
        .optional(),
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
});
