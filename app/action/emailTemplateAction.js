"use server";

import { EmailTemplate, sequelize } from "@lib/models";
import { logErrorToFile, logSuccessToFile } from "@lib/logger.server";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { handleValidationError } from "@lib/utils/validationErrorHandler";
import { logAuditTrail } from "@lib/audit_trails.utils";
import {
    DYNAMIC_FIELDS,
    TEMPLATE_CATEGORIES,
} from "@lib/utils/emailTemplateUtils";
import { auth } from "@lib/auth";
import { send_mail } from "@lib/mail.utils";
import { formatSeqObj } from "@lib/utils/object.utils";

/**
 * Create a new email template (for TanStack Query)
 */
export async function createEmailTemplateAction(formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    try {
        const data = {
            name: formData.get("name"),
            category: formData.get("category"),
            subject: formData.get("subject"),
            html_content: formData.get("html_content"),
            text_content: formData.get("text_content") || "",
            dynamic_fields: JSON.parse(formData.get("dynamic_fields") || "[]"),
            is_active: formData.get("is_active") === "true",
            created_by: user.id || null,
        };

        // Validate required fields
        if (
            !data.name ||
            !data.category ||
            !data.subject ||
            !data.html_content
        ) {
            return {
                success: false,
                message: "All required fields must be filled",
            };
        }

        // Validate category
        if (!TEMPLATE_CATEGORIES.includes(data.category)) {
            return { success: false, message: "Invalid template category" };
        }

        const template = await EmailTemplate.create(data);

        if (data.created_by) {
            await logAuditTrail({
                userId: data.created_by,
                controller: "email_templates",
                action: "CREATE",
                details: `Email template "${data.name}" created successfully. Template ID: ${template.id}`,
            });
        }

        logSuccessToFile(
            `Email template "${data.name}" created successfully. ID: ${template.id}`,
            "email-template"
        );

        return { success: true, data: template };
    } catch (err) {
        console.log("createEmailTemplateAction error:", err);
        logErrorToFile(err, "CREATE EMAIL TEMPLATE");

        // Use custom validation error handler
        const validationResult = handleValidationError(err);
        if (validationResult.success === false) {
            return validationResult;
        }

        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * Create a new email template
 */
export async function createEmailTemplate(formData) {
    try {
        const data = {
            name: formData.get("name"),
            category: formData.get("category"),
            subject: formData.get("subject"),
            html_content: formData.get("html_content"),
            text_content: formData.get("text_content") || "",
            dynamic_fields: JSON.parse(formData.get("dynamic_fields") || "[]"),
            is_active: formData.get("is_active") === "true",
            created_by: formData.get("created_by") || null, // Make optional for now
        };

        // Validate required fields
        if (
            !data.name ||
            !data.category ||
            !data.subject ||
            !data.html_content
        ) {
            return {
                success: false,
                message: "All required fields must be filled",
            };
        }

        // Validate category
        if (!TEMPLATE_CATEGORIES.includes(data.category)) {
            return { success: false, message: "Invalid template category" };
        }

        const template = await EmailTemplate.create(data);

        if (data.created_by) {
            await logAuditTrail({
                userId: data.created_by,
                controller: "email_templates",
                action: "CREATE",
                details: `Email template "${data.name}" created successfully. Template ID: ${template.id}`,
            });
        }

        logSuccessToFile(
            `Email template "${data.name}" created successfully. ID: ${template.id}`,
            "email-template"
        );

        return { success: true, data: template };
    } catch (err) {
        console.log("createEmailTemplate error:", err);
        logErrorToFile(err, "CREATE EMAIL TEMPLATE");

        // Use custom validation error handler
        const validationResult = handleValidationError(err);
        if (validationResult.success === false) {
            return validationResult;
        }

        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * Get all email templates with optional filtering
 */
export async function getEmailTemplates(filters = {}) {
    try {
        const whereClause = {};

        if (filters.category) {
            whereClause.category = filters.category;
        }

        if (filters.is_active !== undefined) {
            whereClause.is_active = filters.is_active;
        }

        if (filters.search) {
            whereClause.name = {
                [sequelize.Op.like]: `%${filters.search}%`,
            };
        }

        const templates = await EmailTemplate.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
        });

        return { success: true, data: formatSeqObj(templates) };
    } catch (err) {
        console.log("getEmailTemplates error:", err);
        logErrorToFile(err, "GET EMAIL TEMPLATES");
        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * Get a single email template by ID
 */
export async function getEmailTemplate(id) {
    try {
        const template = await EmailTemplate.findByPk(id);

        if (!template) {
            return { success: false, message: "Email template not found" };
        }

        return { success: true, data: template };
    } catch (err) {
        console.log("getEmailTemplate error:", err);
        logErrorToFile(err, "GET EMAIL TEMPLATE");
        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * Update an email template
 */
export async function updateEmailTemplate(id, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    try {
        const template = await EmailTemplate.findByPk(id);

        if (!template) {
            return { success: false, message: "Email template not found" };
        }

        const data = {
            name: formData.get("name"),
            category: formData.get("category"),
            subject: formData.get("subject"),
            html_content: formData.get("html_content"),
            text_content: formData.get("text_content") || "",
            dynamic_fields: JSON.parse(formData.get("dynamic_fields") || "[]"),
            is_active: formData.get("is_active") === "true",
            updated_by: user.id,
        };

        // Validate required fields
        if (
            !data.name ||
            !data.category ||
            !data.subject ||
            !data.html_content
        ) {
            return {
                success: false,
                message: "All required fields must be filled",
            };
        }

        // Validate category
        if (!TEMPLATE_CATEGORIES.includes(data.category)) {
            return { success: false, message: "Invalid template category" };
        }

        await template.update(data);

        await logAuditTrail({
            userId: data.updated_by,
            controller: "email_templates",
            action: "UPDATE",
            details: `Email template "${data.name}" updated successfully. Template ID: ${id}`,
        });

        logSuccessToFile(
            `Email template "${data.name}" updated successfully. ID: ${id}`,
            "email-template"
        );

        return { success: true, data: formatSeqObj(template) };
    } catch (err) {
        console.log("updateEmailTemplate error:", err);
        logErrorToFile(err, "UPDATE EMAIL TEMPLATE");

        // Use custom validation error handler
        const validationResult = handleValidationError(err);
        if (validationResult.success === false) {
            return validationResult;
        }

        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * Delete an email template
 */
export async function deleteEmailTemplate(id, userId) {
    try {
        const template = await EmailTemplate.findByPk(id);

        if (!template) {
            return { success: false, message: "Email template not found" };
        }

        const templateName = template.name;
        await template.destroy();

        await logAuditTrail({
            userId: userId,
            controller: "email_templates",
            action: "DELETE",
            details: `Email template "${templateName}" deleted successfully. Template ID: ${id}`,
        });

        logSuccessToFile(
            `Email template "${templateName}" deleted successfully. ID: ${id}`,
            "email-template"
        );

        return {
            success: true,
            message: "Email template deleted successfully",
        };
    } catch (err) {
        console.log("deleteEmailTemplate error:", err);
        logErrorToFile(err, "DELETE EMAIL TEMPLATE");
        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * Toggle template active status
 */
export async function toggleTemplateStatus(id, userId) {
    try {
        const template = await EmailTemplate.findByPk(id);

        if (!template) {
            return { success: false, message: "Email template not found" };
        }

        const newStatus = !template.is_active;
        await template.update({
            is_active: newStatus,
            updated_by: userId,
        });

        await logAuditTrail({
            userId: userId,
            controller: "email_templates",
            action: "TOGGLE_STATUS",
            details: `Email template "${template.name}" status changed to ${
                newStatus ? "active" : "inactive"
            }. Template ID: ${id}`,
        });

        return {
            success: true,
            data: { is_active: newStatus },
            message: `Template ${
                newStatus ? "activated" : "deactivated"
            } successfully`,
        };
    } catch (err) {
        console.log("toggleTemplateStatus error:", err);
        logErrorToFile(err, "TOGGLE TEMPLATE STATUS");
        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(category) {
    try {
        const templates = await EmailTemplate.findAll({
            where: {
                category: category,
                is_active: true,
            },
            order: [["name", "ASC"]],
        });

        return { success: true, data: templates };
    } catch (err) {
        console.log("getTemplatesByCategory error:", err);
        logErrorToFile(err, "GET TEMPLATES BY CATEGORY");
        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * Replace dynamic fields in template content
 */

/**
 * This function sends an email using a template category.
 * It finds the active template for the given category, replaces dynamic fields in the subject and content,
 * and sends the email using the send_mail utility.
 *
 * @param {string} category - The template category (e.g., "AGENCY_REGISTRATION")
 * @param {string} to - The recipient's email address
 * @param {object} templateData - The data to replace dynamic fields in the template
 * @param {Array} attachments - An array of attachment objects for the email
 * @returns {Promise<object>} - { success, message }
 */
export async function sendEmailByCategory(
    category,
    to,
    templateData = {},
    attachments = []
) {
    try {
        // Find the active template for the given category
        const template = await EmailTemplate.findOne({
            where: { category, is_active: true },
            order: [["updatedAt", "DESC"]],
        });

        if (!template) {
            return {
                success: false,
                message: `No active email template found for category: ${category}`,
            };
        }

        // Replace dynamic fields in subject and content
        const subject = await replaceDynamicFields(
            template.subject,
            templateData
        );
        const html = await replaceDynamicFields(
            template.html_content,
            templateData
        );
        const text = template.text_content
            ? await replaceDynamicFields(template.text_content, templateData)
            : "";

        // Send the email
        const result = await send_mail({
            to,
            subject,
            html,
            text,
            attachFiles: attachments, // Pass attachments to send_mail
        });

        if (result && result.success) {
            logSuccessToFile(
                `Email sent successfully using template "${template.name}" to ${to}`,
                "email-template"
            );
            return { success: true, message: "Email sent successfully" };
        } else {
            return {
                success: false,
                message: result?.message || "Failed to send email",
            };
        }
    } catch (err) {
        logErrorToFile(err, "SEND EMAIL BY CATEGORY");
        return { success: false, message: extractErrorMessage(err) };
    }
}

/**
 * This function replaces dynamic field placeholders in an email template's content
 * with actual values provided in the `data` object.
 * Placeholders in the template are denoted by double curly braces, e.g. {{user_name}}.
 * The function iterates over all possible dynamic fields (as defined in DYNAMIC_FIELDS),
 * and for each field, it searches for its placeholder in the content and replaces all
 * occurrences with the corresponding value from the `data` object. If a value is not
 * provided for a field, it substitutes a fallback string in the format [field].
 * */

export async function replaceDynamicFields(content, data) {
    let processedContent = content;

    // Replace all dynamic fields with actual values
    Object.keys(DYNAMIC_FIELDS).forEach((field) => {
        const placeholder = `{{${field}}}`;
        const value = data[field] || `[${field}]`;
        processedContent = processedContent.replace(
            new RegExp(placeholder, "g"),
            value
        );
    });

    return processedContent;
}

/**
 * Preview template with sample data
 */
export async function previewTemplate(template, sampleData = {}) {
    try {
        // Validate template structure
        if (!template) {
            return { success: false, message: "Template is required" };
        }

        if (!template.subject) {
            return { success: false, message: "Template subject is required" };
        }

        if (!template.html_content) {
            return {
                success: false,
                message: "Template HTML content is required",
            };
        }

        const processedSubject = await replaceDynamicFields(
            template.subject,
            sampleData
        );
        const processedHtml = await replaceDynamicFields(
            template.html_content,
            sampleData
        );
        const processedText = template.text_content
            ? await replaceDynamicFields(template.text_content, sampleData)
            : "";

        return {
            success: true,
            data: {
                subject: processedSubject,
                html_content: processedHtml,
                text_content: processedText,
            },
        };
    } catch (err) {
        console.log("previewTemplate error:", err);
        return {
            success: false,
            message: `Error processing template preview: ${err.message}`,
        };
    }
}

/**
 * Send email using a template with dynamic field replacement
 */
// export async function sendEmailWithTemplate(
//     templateId,
//     recipientEmail,
//     dynamicData = {}
// ) {
//     try {
//         // Get the email template
//         const templateResult = await getEmailTemplate(templateId);

//         if (!templateResult.success) {
//             return {
//                 success: false,
//                 message: `Email template not found: ${templateResult.message}`,
//             };
//         }

//         const template = templateResult.data;

//         // Check if template is active
//         if (!template.is_active) {
//             return {
//                 success: false,
//                 message: "Email template is not active",
//             };
//         }

//         // Process the template with dynamic data
//         const previewResult = await previewTemplate(template, dynamicData);

//         if (!previewResult.success) {
//             return {
//                 success: false,
//                 message: `Error processing template: ${previewResult.message}`,
//             };
//         }

//         const { subject, html_content, text_content } = previewResult.data;

//         // Import send_mail function

//         // Send the email
//         const emailResult = await send_mail({
//             to: recipientEmail,
//             subject: subject,
//             html: html_content,
//             text: text_content,
//         });

//         if (emailResult.success) {
//             logSuccessToFile(
//                 `Email sent successfully using template "${template.name}" to ${recipientEmail}`,
//                 "email-template"
//             );
//         }

//         return {
//             success: true,
//             data: {
//                 template: template.name,
//                 recipient: recipientEmail,
//                 subject: subject,
//                 emailResult: emailResult,
//             },
//         };
//     } catch (err) {
//         console.log("sendEmailWithTemplate error:", err);
//         logErrorToFile(err, "SEND EMAIL WITH TEMPLATE");
//         return {
//             success: false,
//             message: extractErrorMessage(err),
//         };
//     }
// }

/**
 * Send email using template by category
 */
// export async function sendEmailByCategory(
//     category,
//     recipientEmail,
//     dynamicData = {}
// ) {
//     try {
//         // Get templates by category
//         const templatesResult = await getTemplatesByCategory(category);

//         if (!templatesResult.success) {
//             return {
//                 success: false,
//                 message: `Error getting templates: ${templatesResult.message}`,
//             };
//         }

//         const templates = templatesResult.data;

//         if (templates.length === 0) {
//             return {
//                 success: false,
//                 message: `No active templates found for category: ${category}`,
//             };
//         }

//         // Use the first active template (you could add logic to select specific templates)
//         const template = templates[0];

//         // Send email using the template
//         return await sendEmailWithTemplate(
//             template.id,
//             recipientEmail,
//             dynamicData
//         );
//     } catch (err) {
//         console.log("sendEmailByCategory error:", err);
//         logErrorToFile(err, "SEND EMAIL BY CATEGORY");
//         return {
//             success: false,
//             message: extractErrorMessage(err),
//         };
//     }
// }
