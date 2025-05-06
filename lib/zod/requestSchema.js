import { z } from "zod";

export const requestSchema = z.object({
    request_date: z
        .string({
            required_error: "Request Date field is required.",
            invalid_type_error: "Request date must be a valid date",
        })
        .nonempty("Request Date field is required.")
        .date(),

    email: z
        .string({
            required_error: "Email field is required",
            invalid_type_error: "Please enter a valid email",
        })
        .email("Please enter a valid email."),

    company: z
        .string({
            required_error: "Company / Agency / Institution field is required",
            invalid_type_error:
                "Please enter a valid Company / Agency / Institution",
        })
        .nonempty("Company / Agency / Institution field is required.")
        .min(
            2,
            "Company / Agency / Institution must be at least 2 characters long."
        )
        .max(
            100,
            "Company / Agency / Institution must be at most 100 characters long."
        ),

    profession: z
        .string({
            required_error: "Profession field is required",
            invalid_type_error: "Please enter a valid Profession",
        })
        .nonempty("Profession field is required.")
        .min(2, "Profession must be at least 2 characters long.")
        .max(100, "Profession must be at most 100 characters long."),
    purpose: z
        .string({
            required_error: "Request Purpose field is required",
            invalid_type_error: "Please enter a valid purpose",
        })
        .nonempty("Request purpose field is required.")
        .min(2, "Request purpose must be at least 2 characters long.")
        .max(250, "Request purpose must be at most 250 characters long."),
});
