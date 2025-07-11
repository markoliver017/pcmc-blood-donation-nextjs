import { z } from "zod";

export const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    subject: z.enum(
        [
            "General Inquiry",
            "Blood Donation Appointment",
            "Blood Drive Organization",
            "Emergency Blood Request",
            "Volunteer Opportunities",
            "Partnership Inquiry",
            "Technical Support",
            "Other",
        ],
        { required_error: "Please select a subject" }
    ),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message must be less than 2000 characters"),
});

export const contactFormStatusSchema = z.object({
    id: z.number().positive("Invalid contact form ID"),
    status: z.enum(["pending", "in_progress", "resolved", "closed"]),
    priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
    admin_notes: z.string().optional(),
});

export const contactFormAssignmentSchema = z.object({
    id: z.number().positive("Invalid contact form ID"),
    assigned_to: z.string().uuid("Invalid user ID"),
});
