import { z } from "zod";
import {
    donorBasicInformationSchema,
    userBasicWithCredentials2,
} from "./userSchema";

// const philippinePhoneRegex = /^(?:\+63|0)(\d{2,3})\d{6,7}$/;

const zodInputStringPipe = (zodPipe) =>
    z
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .pipe(zodPipe.nullable());

export const bloodtypeSchema = z.object({
    id: z.optional(z.number().int()), //donor's id
    blood_type_id: zodInputStringPipe(z.string().regex(/^\d+$/).or(z.null())),
    is_bloodtype_verified: z
        .literal(true, {
            errorMap: () => ({
                message:
                    "You must verify the donor's blood type before you proceed.",
            }),
        })
        .optional(),
});

export const donorSchema = z.object({
    id: z.optional(z.number().int()),
    agency_id: z.coerce.number().int(),
    user_id: z.string().uuid().optional(),
    date_of_birth: z
        .string({
            required_error: "Date of birth field is required.",
            invalid_type_error: "Please enter a valid date",
        })
        .nonempty("Date of birth field is required.")
        .date(),
    civil_status: z.nativeEnum(
        ["single", "married", "divorced", "separated", "widowed"],
        {
            errorMap: () => {
                return {
                    message:
                        "Civil status field cannot be empty. Please select a valid option.",
                };
            },
        }
    ),
    // contact_number: z
    //     .string({
    //         required_error: "Contact number field is required",
    //         invalid_type_error: "Please enter a valid contact number",
    //     })
    //     .min(
    //         12,
    //         "Contact number must be at least 12 characters long. Please include the country code. For landline numbers, include the area code."
    //     )
    //     .max(15, "Contact number must be at most 15 digits long.")
    //     .regex(
    //         philippinePhoneRegex,
    //         "Please enter a valid Philippine contact number"
    //     ),
    contact_number: z
        .string({
            required_error: "Contact number is required",
            invalid_type_error: "Please enter a valid contact number",
        })
        .regex(
            /^(9\d{9}|2\d{7}|[3-8]\d{6,7})$/,
            "Enter a valid mobile (9123456789) or landline (21234567 or 3456789) number"
        ),
    nationality: z
        .string({
            required_error: "Nationality field is required",
            invalid_type_error: "Please enter a valid Nationality",
        })
        .nonempty("Nationality field is required."),
    occupation: z
        .string({
            invalid_type_error: "Please enter a valid Occupation",
        })
        .optional(),

    address: z
        .string({
            required_error: "Address field is required",
            invalid_type_error: "Please enter a valid Address",
        })
        .nonempty("Address field is required.")
        .min(2, "Address must be at least 2 characters long.")
        .max(255, "Address must be at most 255 characters long."),
    barangay: z
        .string({
            required_error: "Barangay field is required",
            invalid_type_error: "Please enter a valid Barangay",
        })
        .nonempty("Barangay field is required.")
        .min(2, "Barangay must be at least 2 characters long.")
        .max(150, "Barangay must be at most 150 characters long."),
    city_municipality: z
        .string({
            required_error: "City/Municipality field is required",
            invalid_type_error: "Please enter a valid City/Municipality",
        })
        .nonempty("City/Municipality field is required.")
        .min(2, "City/Municipality must be at least 2 characters long.")
        .max(150, "City/Municipality must be at most 150 characters long."),
    province: z
        .string({
            required_error: "Area field is required",
            invalid_type_error: "Please enter a valid area",
        })
        .nonempty("Area field is required."),
    is_regular_donor: z.boolean({
        required_error: "Please select Yes or No",
    }),
    blood_type_id: zodInputStringPipe(z.string().regex(/^\d+$/).or(z.null())),
    last_donation_date: z.string().optional().nullable(),
    donation_history_donation_date: z.string().optional(),
    blood_service_facility: z.string().optional(),
    comments: z
        .string({
            invalid_type_error: "Please enter a valid comments",
        })
        .max(255, "Comments must be at most 255 characters long.")
        .optional()
        .nullable(),
    id_url: z.optional(
        z.string().url("Invalid URL of file uploads").nullable()
    ),
    file: z
        .any()
        .optional()
        .refine((file) => !file || file.size <= 1024 * 1024 * 2, {
            message: "File size should be less than 2MB",
        })
        .refine(
            (file) =>
                !file ||
                ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
            {
                message: "Only JPEG and PNG files are supported",
            }
        ),
    updated_by: z
        .string({
            required_error: "User ID is required as the editor.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid()
        .optional()
        .nullable(),
});

export const acceptTermsSchema = z.object({
    termsAccepted: z.literal(true, {
        errorMap: () => ({
            message: "You must accept the terms and conditions.",
        }),
    }),
    readEligibilityReq: z.literal(true, {
        errorMap: () => ({
            message: "You must read and accept the Eligibility Requirements.",
        }),
    }),
});

export const donorStatusSchema = z
    .object({
        id: z
            .number({
                required_error: "Agency ID is required",
                invalid_type_error: "Please enter a agency id",
            })
            .int(),
        verified_by: z
            .string({
                required_error: "User ID is required as the verifier.",
                invalid_type_error: "Invalid user ID format.",
            })
            .uuid(),
        status: z.nativeEnum(
            ["for approval", "rejected", "activated", "deactivated"],
            {
                errorMap: () => {
                    return {
                        message:
                            "Status type cannot be empty. Please select a valid option.",
                    };
                },
            }
        ),
        remarks: z
            .string({
                invalid_type_error: "Please enter a valid remarks",
            })
            .max(255, "Remarks must be at most 255 characters long.")
            .optional(),
    })
    .refine(
        (data) => {
            if (data.status === "rejected") {
                return !!data.remarks;
            }
            return true;
        },
        {
            message: "Please specify the reason for rejection to proceed.",
            path: ["remarks"],
        }
    );

export const donorRegistrationWithUser = donorSchema
    .merge(acceptTermsSchema)
    .merge(userBasicWithCredentials2)
    .refine((data) => data.password === data.password_confirmation, {
        path: ["password_confirmation"],
        message: "Passwords do not match. Re-enter your password",
    })
    .superRefine((data, ctx) => {
        if (data.is_regular_donor) {
            if (!data.blood_type_id) {
                ctx.addIssue({
                    path: ["blood_type_id"],
                    code: z.ZodIssueCode.custom,
                    message: "Blood type is required",
                });
            }
            if (!data.donation_history_donation_date) {
                ctx.addIssue({
                    path: ["donation_history_donation_date"],
                    code: z.ZodIssueCode.custom,
                    message: "For regular donors, donation date is required",
                });
            } else {
                // Check if donation_history_donation_date is in the future
                const lastDonation = new Date(
                    data.donation_history_donation_date
                );
                const now = new Date();
                // Remove time part for comparison (optional, if only date is stored)
                lastDonation.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);
                if (lastDonation > now) {
                    ctx.addIssue({
                        path: ["donation_history_donation_date"],
                        code: z.ZodIssueCode.custom,
                        message: "Last donation date cannot be in the future",
                    });
                }
            }

            if (!data.blood_service_facility) {
                ctx.addIssue({
                    path: ["blood_service_facility"],
                    code: z.ZodIssueCode.custom,
                    message: "Blood service facility is required",
                });
            }
        }
    });

export const donorWithVerifiedSchema = donorSchema.merge(
    z.object({
        is_data_verified: z.literal(true, {
            errorMap: () => ({
                message:
                    "You must verify the donor's information before you proceed.",
            }),
        }),
    })
);

export const userWithDonorSchema = donorWithVerifiedSchema.merge(
    donorBasicInformationSchema
);

// export const bloodTypeWithVerifiedSchema = bloodtypeSchema.merge(
//     z.object({
//         is_bloodtype_verified: z.literal(true, {
//             errorMap: () => ({
//                 message:
//                     "You must verify the donor's blood type before you proceed.",
//             }),
//         }),
//     })
// );
