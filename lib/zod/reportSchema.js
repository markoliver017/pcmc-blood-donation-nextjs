import { z } from "zod";

export const createReportsSchema = z.object({
    report_date: z
        .string({
            required_error: "Medication Error Date field is required.",
            invalid_type_error: "Name must be a string",
        })
        .nonempty("Report Date is required.")
        .date(),
    error_date: z
        .string({
            required_error: "Medication Error Date field is required.",
            invalid_type_error: "Please enter a valid date",
        })
        .nonempty("Medication Error Date field is required.")
        .date(),

    patient_age: z.coerce
        .number({
            required_error: "Age is required",
            invalid_type_error: "Please enter a valid age",
        })
        .positive("Please enter a valid age."),

    patient_sex: z.enum(["male", "female", "unknown"], {
        errorMap: () => ({
            message: "Patient Sex must be either Male, Female or unknown.",
        }),
    }),

    patient_weight: z.coerce
        .number({
            required_error: "Weight is required",
            invalid_type_error: "Please enter a valid weight",
        })
        .positive("Please enter a valid weight."),

    patient_height: z
        .string()
        .trim()
        .nonempty("Patient Height is required.")
        .refine(
            (value) => {
                if (!value || value === "") {
                    return false;
                }
                if (value.toLowerCase() === "n/a") {
                    return true;
                }
                if (!isNaN(Number(value)) && Number(value) > 0) {
                    return true;
                }
                return false;
            },
            {
                message:
                    "Please enter a valid height or type 'N/A' if not applicable.",
            }
        ),

    age_unit: z.enum(["Year", "Month", "Week", "Day", "Hour"], {
        errorMap: () => ({ message: "Invalid age unit." }),
    }),

    weight_unit: z.enum(["kg", "lb"], {
        errorMap: () => ({ message: "Invalid weight unit." }),
    }),

    height_unit: z.enum(["cm", "m", "in", "ft"], {
        errorMap: () => ({ message: "Invalid height unit." }),
    }),

    exact_prescription: z
        .string({
            required_error: "Exact prescription field is required.",
            invalid_type_error: "Exact prescription must be a string",
        })
        .nonempty("Exact Prescription is required."),

    form_2_details: z
        .object({
            other_error_type: z.optional(z.string()),
            selected_error_type: z.object({
                id: z.number(),
                label: z.string(),
                value: z.string(),
                is_medicine_needed: z.boolean(),
            }),
            medicines: z.array(
                z.object({
                    medicine_generic_id: z.optional(z.number().nullable()),
                    medicine_route_id: z.optional(z.number().nullable()),
                })
            ),
        })
        .superRefine((data, ctx) => {
            const { value: error_type_label, is_medicine_needed } =
                data.selected_error_type;

            if (
                error_type_label === "Others" &&
                (!data.other_error_type || data.other_error_type.trim() === "")
            ) {
                ctx.addIssue({
                    path: ["other_error_type"],
                    message: "Specify other error type is required.",
                    code: z.ZodIssueCode.custom,
                });
            }

            if (is_medicine_needed) {
                if (data.medicines.length === 0) {
                    ctx.addIssue({
                        path: ["medicines"],
                        message: "At least one medicine is required.",
                        code: z.ZodIssueCode.custom,
                    });
                } else {
                    data.medicines.forEach((med, index) => {
                        if (med.medicine_generic_id == null) {
                            ctx.addIssue({
                                path: [
                                    "medicines",
                                    index,
                                    "medicine_generic_id",
                                ],
                                message: "Generic medicine is required.",
                                code: z.ZodIssueCode.custom,
                            });
                        }
                        if (med.medicine_route_id == null) {
                            ctx.addIssue({
                                path: ["medicines", index, "medicine_route_id"],
                                message: "Route of medicine is required.",
                                code: z.ZodIssueCode.custom,
                            });
                        }
                    });
                }
            }
        }),

    selected_error_type: z.object({
        id: z.number(),
        label: z.string(),
        value: z.string(),
        is_medicine_needed: z.boolean(),
    }),

    other_error_type: z.string().optional(),

    incident_description: z
        .string()
        .nonempty("Description of the medication error incident is required."),
    workplace_environment: z
        .string()
        .nonempty("Description of the workplace environment is required."),
    patient_condition: z
        .string()
        .nonempty("Description of the patient condition is required."),
    immediate_actions: z
        .string()
        .nonempty("Description of the immediate action/s done is required."),
    corrective_actions: z
        .string()
        .nonempty("Description of the corrective action/s done is required."),
    preventive_actions: z
        .string()
        .nonempty("Description of the preventive action/s done is required."),
    is_verified: z.boolean().optional(),

    // medicines: z.array(
    //     z.object({
    //         medicine_generic_id: z.number({
    //             required_error: "Generic medicine field is required.",
    //             invalid_type_error: "Generic medicine field is required.",
    //         }),
    //         medicine_route_id: z.number({
    //             required_error: "Medicine route field is required.",
    //             invalid_type_error: "Medicine route field is required.",
    //         }),
    //     })
    // ),
    medicines: z.array(
        z.object({
            medicine_generic_id: z.optional(z.number().nullable()),
            medicine_route_id: z.optional(z.number().nullable()),
        })
    ),

    error_type_id: z.number({
        required_error: "Medication Error type field is required.",
        invalid_type_error: "Medication Error type field is required.",
    }),
});
// .superRefine((data, ctx) => {
//     const selected_error_type = data.selected_error_type;
//     console.log("data.selected_error_type?!!????", selected_error_type);
//     if (
//         data.error_type_id === 13 &&
//         (!data.other_error_type || data.other_error_type.trim() === "")
//     ) {
//         ctx.addIssue({
//             path: ["other_error_type"],
//             message: "Specify other error type is required.",
//             code: z.ZodIssueCode.custom,
//         });
//     }
// });

// import createReportSchema and use in your code like this:
// const result = createReportsSchema.safeParse({
//     patient_height: "N/A",
//     report_date: "",
//     error_date: "",
// });
// console.log("createReportsSchema", result.error.format());
// console.log(result.error.flatten().fieldErrors);
