import { z } from "zod";

export const userSchema = z.object({
    id: z.optional(z.string().uuid()),
    is_active: z.optional(z.boolean()),
    role_id: z.number({
        required_error: "Role type field is required.",
        invalid_type_error: "Role type field is required.",
    }),
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
});
