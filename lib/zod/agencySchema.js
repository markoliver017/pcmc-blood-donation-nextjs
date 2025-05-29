import { z } from "zod";

const philippinePhoneRegex = /^(?:\+63|0)(\d{2,3})\d{6,7}$/;

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

    contact_number: z
        .string({
            required_error: "Contact number field is required",
            invalid_type_error: "Please enter a valid contact number",
        })
        .min(
            12,
            "Contact number must be at least 12 characters long. Please include the country code. For landline numbers, include the area code."
        )
        .max(15, "Contact number must be at most 15 digits long.")
        .regex(
            philippinePhoneRegex,
            "Please enter a valid Philippine contact number"
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

export const agencyStatusSchema = z
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

export const agencyRegistrationWithUser = agencySchema.merge(z
    .object({
        role_ids: z
            .array(
                z.number({
                    required_error: "Role type field is required.",
                    invalid_type_error: "Role type field is required.",
                })
            )
            .min(1, "At least one role is required."),
        email: z
            .string({
                required_error: "Email field is required",
                invalid_type_error: "Please enter a valid email",
            })
            .email("Please enter a valid email."),

        first_name: z
            .string({
                required_error: "First Name field is required",
                invalid_type_error: "Please enter a valid first name",
            })
            .nonempty("First Name field is required.")
            .min(2, "First Name must be at least 2 characters long.")
            .max(100, "First Name must be at most 100 characters long.")
            .regex(/^[A-Za-z\s]+$/, "Invalid characters."),
        middle_name: z
            .string({
                required_error: "Middle Name field is required",
                invalid_type_error: "Please enter a valid middle name",
            })
            .max(100, "Middle Name must be at most 100 characters long.")
            .regex(/^[A-Za-z\s]*$/, "Invalid characters.") // Allows empty strings
            .optional(),

        last_name: z
            .string({
                required_error: "Last Name field is required",
                invalid_type_error: "Please enter a valid Last Name",
            })
            .nonempty("Last Name field is required.")
            .min(2, "Last Name must be at least 2 characters long.")
            .max(100, "Last Name must be at most 100 characters long.")
            .regex(/^[A-Za-z\s]+$/, "Invalid characters."),
        gender: z.nativeEnum(["male", "female"], {
            errorMap: () => {
                return {
                    message:
                        "Gender field cannot be empty. Please select a valid option.",
                };
            },
        }),
        image: z.optional(z.string().url("Invalid URL").nullable()),
        profile_picture: z
            .any()
            .optional()
            .refine((file) => !file || file.size <= 1024 * 1024 * 2, {
                message: "File size should be less than 2MB",
            })
            .refine(
                (file) =>
                    !file || ["image/jpeg", "image/png"].includes(file.type),
                {
                    message: "Only JPEG and PNG files are supported",
                }
            ),
        password: z
            .string({
                required_error: "Password is required.",
                invalid_type_error: "Invalid password format.",
            })
            .min(8, "Password must be at least 8 characters long.")
            .max(100, "Password must be at most 100 characters long.")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter."
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter."
            )
            .regex(/[0-9]/, "Password must contain at least one number.")
            .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least one special character."
            ),
        password_confirmation: z.string({
            required_error: "Password confirmation is required.",
            invalid_type_error: "Invalid password confirmation format.",
        }),
    }),


)
