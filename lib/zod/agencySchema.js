import { z } from "zod";
import { userBasicWithCredentials } from "./userSchema";

// const philippinePhoneRegex = /^(?:\+63|0)(\d{2,3})\d{6,7}$/;
// const philippinePhoneRegex = /^9\d{9}$/;

export const agencySchema = z.object({
    id: z.optional(z.number().int()),
    head_id: z.optional(z.string().uuid()),
    updated_by: z.optional(z.string().uuid()),
    is_active: z.optional(z.boolean()),
    name: z
        .string({
            required_error: "Agency Name field is required",
            invalid_type_error: "Please enter a valid Agency name",
        })
        .nonempty("Agency Name field is required.")
        .min(2, "Agency Name must be at least 2 characters long.")
        .max(100, "Agency Name must be at most 100 characters long."),

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
            required_error: "Province field is required",
            invalid_type_error: "Please enter a valid Province",
        })
        .nonempty("Province field is required.")
        .min(3, "Province must be at least 3 characters long.")
        .max(150, "Province must be at most 150 characters long."),
    organization_type: z.nativeEnum(
        [
            "business",
            "media",
            "government",
            "church",
            "education",
            "healthcare",
            "others",
        ],
        {
            errorMap: () => {
                return {
                    message:
                        "Organizational type field cannot be empty. Please select a valid option.",
                };
            },
        }
    ),
    other_organization_type: z
        .string({
            invalid_type_error: "Please enter a valid organization type",
        })
        .max(255, "Organization type must be at most 255 characters long.")
        .optional(),
    comments: z
        .string({
            invalid_type_error: "Please enter a valid comments",
        })
        .max(255, "Comments must be at most 255 characters long.")
        .optional(),
    file_url: z.optional(z.string().url("Invalid URL").nullable()),
    file: z
        .any()
        .optional()
        .refine((file) => !file || file.size <= 1024 * 1024 * 2, {
            message: "File size should be less than 2MB",
        })
        .refine(
            (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
            {
                message: "Only JPEG and PNG files are supported",
            }
        ),
});

export const coordinatorSchema = z.object({
    id: z.optional(z.number().int()),
    agency_id: z.coerce.number().int(),
    user_id: z.optional(z.string().uuid()),
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

    comments: z
        .string({
            invalid_type_error: "Please enter a valid comments",
        })
        .max(255, "Comments must be at most 255 characters long.")
        .optional(),
});

export const agencyStatusSchema = z
    .object({
        id: z.coerce
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

export const agencyRegistrationWithUser = agencySchema
    .merge(userBasicWithCredentials)
    .refine((data) => data.password === data.password_confirmation, {
        path: ["password_confirmation"],
        message: "Passwords do not match.",
    })
    .refine(
        (data) => {
            // If organization_type is "others", other_organization_type must be non-empty
            if (data.organization_type === "others") {
                return (
                    !!data.other_organization_type &&
                    data.other_organization_type.trim() !== ""
                );
            }
            return true;
        },
        {
            path: ["other_organization_type"],
            message: "Please specify the organization type.",
        }
    );

export const coordinatorRegistrationWithUser = coordinatorSchema
    .merge(userBasicWithCredentials)
    .refine((data) => data.password === data.password_confirmation, {
        path: ["password_confirmation"],
        message: "Passwords do not match.",
    });
