import { z } from "zod";

const zodInputStringPipe = (zodPipe) =>
    z
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .pipe(zodPipe.nullable());

export const bloodtypeSchema = z.object({
    id: z.optional(z.number().int()),
    blood_type_id: zodInputStringPipe(z.string().regex(/^\d+$/).or(z.null())),
});

export const timeScheduleSchema = z
    .object({
        time_start: z.string().min(1, "Time start is required"),
        time_end: z.string().min(1, "Time end is required"),
        has_limit: z.boolean({
            required_error: "Please select Has limit or No limit",
        }),
        max_limit: z.coerce.number().optional(),
    })
    .refine(
        (data) => {
            if (data.has_limit && (!data.max_limit || data.max_limit < 1)) {
                return false;
            }
            return true;
        },
        {
            message:
                "Max limit is required and must be greater than 0 when has limit is true",
            path: ["max_limit"],
        }
    )
    .refine(
        (data) => {
            const startTime = new Date(`1970-01-01T${data.time_start}:00`);
            const endTime = new Date(`1970-01-01T${data.time_end}:00`);
            return endTime > startTime;
        },
        {
            message: "Time end must be greater than Time start",
            path: ["time_end"],
        }
    );

const checkTimeScheduleOverlaps = (schedules) => {
    const sortedSchedules = schedules
        .map((schedule) => ({
            start: new Date(`1970-01-01T${schedule.time_start}:00`),
            end: new Date(`1970-01-01T${schedule.time_end}:00`),
        }))
        .sort((a, b) => a.start.getTime() - b.start.getTime());

    for (let i = 0; i < sortedSchedules.length - 1; i++) {
        if (sortedSchedules[i].end >= sortedSchedules[i + 1].start) {
            return false;
        }
    }

    return true;
};

export const bloodDonationEventSchema = z
    .object({
        id: z.optional(z.number().int()),
        agency_id: z.coerce.number().int().optional(),
        requester_id: z.string().uuid().optional(),
        date: z
            .string({
                required_error: "Event date field is required.",
                invalid_type_error: "Please enter a valid date",
            })
            .nonempty("Date of event field is required.")
            .date(),

        title: z
            .string({
                required_error: "Title field is required",
                invalid_type_error: "Please enter a valid title",
            })
            .nonempty("Title field is required."),
        description: z
            .string({
                invalid_type_error: "Please enter a valid description",
            })
            .optional(),
        time_schedules: z
            .array(timeScheduleSchema)
            .min(1, "At least one time schedule is required"),
        file_url: z.optional(
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
                    ["image/jpeg", "image/jpg", "image/png"].includes(
                        file.type
                    ),
                {
                    message: "Only JPEG and PNG files are supported",
                }
            ),
    })
    // .refine(
    //     (data) => {
    //         const startDate = new Date(data.from_date);
    //         const endDate = new Date(data.to_date);
    //         return (
    //             !isNaN(startDate.getTime()) &&
    //             !isNaN(endDate.getTime()) &&
    //             endDate >= startDate
    //         );
    //     },
    //     {
    //         message:
    //             "Invalid date range. End date must be greater or equal to start date.",
    //         path: ["to_date"],
    //     }
    // )
    .refine((data) => checkTimeScheduleOverlaps(data.time_schedules), {
        message: "Each time schedule must end before the next one starts.",
        path: ["time_schedules"],
    });

export const eventStatusSchema = z
    .object({
        id: z
            .number({
                required_error: "Event ID is required",
                invalid_type_error: "Please enter a event id",
            })
            .int(),
        verified_by: z
            .string({
                required_error: "User ID is required as the verifier.",
                invalid_type_error: "Invalid user ID format.",
            })
            .uuid(),
        status: z.nativeEnum(
            ["approved", "for approval", "cancelled", "rejected"],
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

export const eventRegistrationStatusSchema = z.object({
    id: z
        .number({
            required_error: "Event ID is required",
            invalid_type_error: "Please enter a event id",
        })
        .int(),
    updated_by: z
        .string({
            required_error: "User ID is required as the verifier.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid(),
    registration_status: z.nativeEnum(
        ["not started", "ongoing", "closed", "completed"],
        {
            errorMap: () => {
                return {
                    message:
                        "Status type cannot be empty. Please select a valid option.",
                };
            },
        }
    ),
});

export const bookAppointmentSchema = z.object({
    donor_id: z
        .number({
            required_error: "Donor ID is required",
            invalid_type_error: "Please enter a Donor ID",
        })
        .int(),
    time_schedule_id: z
        .number({
            required_error: "Time schedule ID is required",
            invalid_type_error: "Please enter a time schedule ID",
        })
        .int(),
    event_id: z
        .number({
            required_error: "Event ID is required",
            invalid_type_error: "Please enter a Event ID",
        })
        .int(),
    updated_by: z
        .string({
            required_error: "User ID is required as the verifier.",
            invalid_type_error: "Invalid user ID format.",
        })
        .uuid()
        .optional(),
});
