import { z } from "zod";

const passwordSchema = z
    .object({
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
    })
    .refine((data) => data.password === data.password_confirmation, {
        path: ["password_confirmation"],
        message: "Passwords do not match.",
    });

export const userSchema = z
    .object({
        id: z.optional(z.string().uuid()),
        is_active: z.optional(z.boolean()),
        // role_id: z.number({
        //     required_error: "Role type field is required.",
        //     invalid_type_error: "Role type field is required.",
        // }),
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
        updated_by: z
            .string({
                required_error: "User ID is required as the creator.",
                invalid_type_error: "Invalid user ID format.",
            })
            .uuid()
            .optional(),
        isChangePassword: z.boolean(),
        password: z.string().optional(),
        password_confirmation: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.isChangePassword) {
            const result = passwordSchema.safeParse({
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            if (!result.success) {
                result.error.issues.forEach((issue) => ctx.addIssue(issue));
            }
        }
    });

export const userBasicWithCredentials = z.object({
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
            (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
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
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character."
        ),
    password_confirmation: z.string({
        required_error: "Password confirmation is required.",
        invalid_type_error: "Invalid password confirmation format.",
    }),
});

export const userBasicInformationSchema = z.object({
    id: z
        .string({
            required_error: "User ID is required",
        })
        .uuid(),

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
            (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
            {
                message: "Only JPEG and PNG files are supported",
            }
        ),
    updated_by: z
        .string({
            required_error: "User ID is required as the creator.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid()
        .optional(),
});

export const userAccountCredentialSchema = z
    .object({
        id: z
            .string({
                required_error: "User ID is required",
            })
            .uuid(),
        email: z
            .string({
                required_error: "Email field is required",
                invalid_type_error: "Please enter a valid email",
            })
            .email("Please enter a valid email."),

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
    })
    .refine((data) => data.password === data.password_confirmation, {
        path: ["password_confirmation"],
        message: "Passwords do not match.",
    });

export const userStatusSchema = z.object({
    id: z
        .string({
            required_error: "User UUID is required",
            invalid_type_error: "Please enter a user uuid",
        })
        .uuid(),
    is_active: z.boolean({
        required_error: "Status required",
        invalid_type_error: "Please enter a valid status",
    }),
    updated_by: z
        .string({
            required_error: "User ID is required as the verifier.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid(),
});
