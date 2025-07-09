
import { z } from "zod";

export const announcementSchema = z.object({
    id: z.optional(z.number().int()),
    user_id: z.optional(z.string().uuid()),
    agency_id: z.optional(z.number().int().nullable()),
    title: z
        .string({
            required_error: "Title field is required",
            invalid_type_error: "Please enter a valid title",
        })
        .nonempty("Title field is required.")
        .min(3, "Title must be at least 3 characters long.")
        .max(255, "Title must be at most 255 characters long."),
    body: z
        .string({
            required_error: "Body field is required",
            invalid_type_error: "Please enter a valid body content",
        })
        .nonempty("Body field is required.")
        .min(10, "Body must be at least 10 characters long.")
        .max(5000, "Body must be at most 5000 characters long."),
    is_public: z
        .boolean({
            required_error: "Public status is required",
            invalid_type_error: "Please select a valid public status",
        })
        .default(false),
    file_url: z.optional(z.string().url("Invalid URL").nullable()),
    file: z
        .any()
        .optional()
        
        .refine((file) => !file || file.size <= 1024 * 1024 * 5, {
            message: "File size should be less than 5MB",
        })
        .refine(
            (file) =>
                !file ||
                [
                    "application/pdf",
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                ].includes(file.type),
            {
                message: "Only PDF, JPEG, PNG, and GIF files are supported",
            }
        ),
});

// Schema for creating announcements (admin can specify agency_id, agency users cannot)
export const createAnnouncementSchema = announcementSchema
    .omit({ id: true, user_id: true })
    // Check: If is_public is true, agency_id must be null
    .refine(
        (data) =>
            !(
                data.is_public &&
                data.agency_id !== null &&
                data.agency_id !== undefined
            ),
        {
            message:
                "Public announcements cannot be assigned to specific agencies.",
            path: ["agency_id"],
        }
    )
    // Check: If is_public is false, agency_id must be provided
    .refine(
        (data) =>
            !(
                data.is_public === false &&
                (data.agency_id === null || data.agency_id === undefined)
            ),
        {
            message: "Non-public announcements must be assigned to an agency.",
            path: ["agency_id"],
        }
    );

// Schema for updating announcements
export const updateAnnouncementSchema = announcementSchema
    .omit({ user_id: true })
    .refine(
        (data) =>
            !(
                data.is_public &&
                data.agency_id !== null &&
                data.agency_id !== undefined
            ),
        {
            message:
                "Public announcements cannot be assigned to specific agencies.",
            path: ["agency_id"],
        }
    )
    // Check: If is_public is false, agency_id must be provided
    .refine(
        (data) =>
            !(
                data.is_public === false &&
                (data.agency_id === null || data.agency_id === undefined)
            ),
        {
            message: "Non-public announcements must be assigned to an agency.",
            path: ["agency_id"],
        }
    );

// Schema for admin-specific operations (can set agency_id)
export const adminAnnouncementSchema = announcementSchema
    .omit({ user_id: true })
    .extend({
        agency_id: z
            .number()
            .int()
            .nullable()
            .optional()
            .describe(
                "Agency ID for agency-specific announcements (null for public)"
            ),
    });

// Schema for agency user operations (agency_id auto-assigned)
export const agencyAnnouncementSchema = announcementSchema
    .omit({ user_id: true, agency_id: true })
    .extend({
        agency_id: z
            .number()
            .int()
            .describe("Agency ID will be auto-assigned based on current user"),
    });
