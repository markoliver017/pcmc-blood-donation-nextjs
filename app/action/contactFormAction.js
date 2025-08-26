"use server";

import { auth } from "@lib/auth";
import { ContactForm, User, Role } from "@lib/models";
import {
    contactFormSchema,
    contactFormStatusSchema,
    contactFormAssignmentSchema,
} from "@lib/zod/contactFormSchema";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { logAuditTrail } from "@lib/audit_trails.utils";
import { sendNotificationAndEmail } from "@lib/notificationEmail.utils";

export async function storeContactForm(formData) {
    console.log("storeContactForm formData received:", formData);

    const parsed = contactFormSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    try {
        const newContactForm = await ContactForm.create(data);

        // Notify all admins about new contact form
        (async () => {
            try {
                const adminRole = await Role.findOne({
                    where: { role_name: "Admin" },
                });

                if (adminRole) {
                    const adminUsers = await User.findAll({
                        include: [
                            {
                                model: Role,
                                as: "roles",
                                where: { id: adminRole.id },
                                through: { attributes: [] },
                            },
                        ],
                    });

                    if (adminUsers.length > 0) {
                        await sendNotificationAndEmail({
                            userIds: adminUsers.map((a) => a.id),
                            notificationData: {
                                subject: "New Contact Form Submission",
                                message: `New contact form submitted by ${data.name} (${data.email}) - Subject: ${data.subject}`,
                                type: "CONTACT_FORM",
                                reference_id: newContactForm.id,
                                created_by: null, // System generated
                            },
                            emailData: {
                                to: adminUsers.map((a) => a.email),
                                templateCategory: "CONTACT_FORM",
                                templateData: {
                                    reference_id:
                                        newContactForm?.contact_form_reference_id,
                                    contact_name: data.name,
                                    contact_email: data.email,
                                    contact_phone: data.phone || "Not provided",
                                    contact_subject: data.subject,
                                    contact_message: data.message,
                                    submission_date:
                                        new Date().toLocaleDateString(),
                                    system_name:
                                        process.env.NEXT_PUBLIC_SYSTEM_NAME ||
                                        "",
                                    support_email:
                                        process.env
                                            .NEXT_PUBLIC_SMTP_SUPPORT_EMAIL ||
                                        "",
                                    support_contact:
                                        process.env
                                            .NEXT_PUBLIC_SMTP_SUPPORT_CONTACT ||
                                        "",
                                    domain_url:
                                        process.env.NEXT_PUBLIC_APP_URL || "",
                                },
                            },
                        });
                    }
                }
            } catch (err) {
                console.error("Admin notification failed:", err);
            }
        })();

        // Generate specific success messages based on subject
        let successMessage =
            "Your message has been sent successfully. We'll get back to you within 24-48 hours.";

        if (data.subject === "Blood Donation Appointment") {
            successMessage =
                "Your appointment request has been received! We'll contact you within 24 hours to confirm your blood donation appointment.";
        } else if (data.subject === "Blood Drive Organization") {
            successMessage =
                "Thank you for your interest in organizing a blood drive! Our team will review your request and contact you within 48 hours.";
        } else if (data.subject === "Emergency Blood Request") {
            successMessage =
                "Your emergency blood request has been submitted! We'll respond immediately - please also call us at +639284795154 for urgent matters.";
        } else if (data.subject === "Volunteer Opportunities") {
            successMessage =
                "Thank you for your interest in volunteering! We'll review your application and contact you within 48 hours with available opportunities.";
        } else if (data.subject === "Partnership Inquiry") {
            successMessage =
                "Your partnership inquiry has been received! Our team will review your proposal and contact you within 48 hours.";
        } else if (data.subject === "Technical Support") {
            successMessage =
                "Your technical support request has been submitted! We'll investigate the issue and get back to you within 24 hours.";
        }

        return {
            success: true,
            data: newContactForm.get({ plain: true }),
            message: successMessage,
        };
    } catch (err) {
        console.error("storeContactForm error:", err);
        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function fetchContactForms() {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const contactForms = await ContactForm.findAll({
            include: [
                {
                    model: User,
                    as: "assignedUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
                {
                    model: User,
                    as: "resolvedByUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return {
            success: true,
            data: contactForms,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: extractErrorMessage(error),
        };
    }
}

export async function fetchContactForm(id) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const contactForm = await ContactForm.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "assignedUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
                {
                    model: User,
                    as: "resolvedByUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
            ],
        });

        if (!contactForm) {
            return {
                success: false,
                message: "Contact form not found.",
            };
        }

        return {
            success: true,
            data: contactForm,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: extractErrorMessage(error),
        };
    }
}

export async function updateContactFormStatus(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    formData.resolved_by = user.id;

    const parsed = contactFormStatusSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    try {
        const contactForm = await ContactForm.findByPk(data.id);

        if (!contactForm) {
            return {
                success: false,
                message: "Contact form not found.",
            };
        }

        const updateData = {
            status: data.status,
            priority: data.priority || contactForm.priority,
            admin_notes: data.admin_notes,
        };

        if (data.status === "resolved") {
            updateData.resolved_at = new Date();
            updateData.resolved_by = user.id;
        }

        const updatedContactForm = await contactForm.update(updateData);

        await logAuditTrail({
            userId: user.id,
            controller: "contact_forms",
            action: "UPDATE_STATUS",
            details: `Contact form status updated to "${data.status}" for ID: ${updatedContactForm.id}`,
        });

        return {
            success: true,
            data: updatedContactForm.get({ plain: true }),
            message: "Contact form status updated successfully.",
        };
    } catch (err) {
        console.error("updateContactFormStatus error:", err);
        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function assignContactForm(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;

    const parsed = contactFormAssignmentSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    try {
        const contactForm = await ContactForm.findByPk(data.id);

        if (!contactForm) {
            return {
                success: false,
                message: "Contact form not found.",
            };
        }

        const assignedUser = await User.findByPk(data.assigned_to);

        if (!assignedUser) {
            return {
                success: false,
                message: "Assigned user not found.",
            };
        }

        const updatedContactForm = await contactForm.update({
            assigned_to: data.assigned_to,
            status: "in_progress",
        });

        await logAuditTrail({
            userId: user.id,
            controller: "contact_forms",
            action: "ASSIGN",
            details: `Contact form ID: ${updatedContactForm.id} assigned to ${assignedUser.first_name} ${assignedUser.last_name}`,
        });

        // Notify assigned user
        (async () => {
            try {
                await sendNotificationAndEmail({
                    userIds: assignedUser.id,
                    notificationData: {
                        subject: "Contact Form Assigned",
                        message: `A contact form has been assigned to you for review and response.`,
                        type: "CONTACT_FORM_ASSIGNED",
                        reference_id: updatedContactForm.id,
                        created_by: user.id,
                    },
                });
            } catch (err) {
                console.error("Assignment notification failed:", err);
            }
        })();

        return {
            success: true,
            data: updatedContactForm.get({ plain: true }),
            message: "Contact form assigned successfully.",
        };
    } catch (err) {
        console.error("assignContactForm error:", err);
        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function fetchContactFormsByStatus(status) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const contactForms = await ContactForm.findAll({
            where: { status },
            include: [
                {
                    model: User,
                    as: "assignedUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
                {
                    model: User,
                    as: "resolvedByUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return {
            success: true,
            data: contactForms,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: extractErrorMessage(error),
        };
    }
}
