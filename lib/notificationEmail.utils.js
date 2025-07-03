import { Notification } from "@lib/models";
import { sendEmailByCategory } from "@action/emailTemplateAction";

/**
 * Send notifications and/or emails to users.
 * @param {Object} options
 * @param {Array|Number} userIds - User ID(s) to notify
 * @param {Object} notificationData - { subject, message, type, reference_id, created_by }
 * @param {Object} emailData - { to, templateCategory, templateData }
 * @returns {Promise<Object>} - { notification: {success, ...}, email: {success, ...} }
 */
export async function sendNotificationAndEmail({ userIds, notificationData, emailData }) {
    const results = { notification: null, email: null };

    // Send notification(s)
    if (userIds && notificationData) {
        try {
            const ids = Array.isArray(userIds) ? userIds : [userIds];
            const notifications = ids.map(user_id => ({ ...notificationData, user_id }));
            await Notification.bulkCreate(notifications);
            results.notification = { success: true, count: ids.length };
        } catch (err) {
            results.notification = { success: false, error: err.message };
        }
    }

    // Send email (template only, no fallback)
    if (emailData) {
        try {
            const emailResult = await sendEmailByCategory(
                emailData.templateCategory,
                emailData.to,
                emailData.templateData
            );
            results.email = { success: emailResult.success, ...emailResult };
        } catch (err) {
            results.email = { success: false, error: err.message };
        }
    }

    console.log("sendNotificationAndEmail results", results);

    return results;
} 