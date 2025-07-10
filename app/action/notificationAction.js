"use server";

import { auth } from "@lib/auth";
import { Notification, User } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";

// Get user notifications with pagination
export async function getUserNotifications(page = 1, limit = 20) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    const offset = (page - 1) * limit;

    try {
        const notifications = await Notification.findAndCountAll({
            where: {
                user_id: user.id,
                is_deleted: false,
            },
            include: [
                {
                    model: User,
                    as: "created_by_user",
                    attributes: ["id", "name", "image"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });

        return {
            success: true,
            data: {
                notifications: formatSeqObj(notifications.rows),
                total: notifications.count,
                currentPage: page,
                totalPages: Math.ceil(notifications.count / limit),
            },
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

// Get unread notification count
export async function getUnreadNotificationCount() {
    const session = await auth();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const { user } = session;

    try {
        const count = await Notification.count({
            where: {
                user_id: user.id,
                is_read: false,
                is_deleted: false,
            },
        });

        return { success: true, data: count };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId) {
    const session = await auth();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const { user } = session;

    try {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                user_id: user.id,
                is_deleted: false,
            },
        });

        if (!notification) {
            return { success: false, message: "Notification not found" };
        }

        await notification.update({ is_read: true });

        return { success: true, message: "Notification marked as read" };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
    const session = await auth();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const { user } = session;

    try {
        await Notification.update(
            { is_read: true },
            {
                where: {
                    user_id: user.id,
                    is_read: false,
                    is_deleted: false,
                },
            }
        );

        return { success: true, message: "All notifications marked as read" };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

// Delete notification
export async function deleteNotification(notificationId) {
    const session = await auth();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const { user } = session;

    try {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                user_id: user.id,
                is_deleted: false,
            },
        });

        if (!notification) {
            return { success: false, message: "Notification not found" };
        }

        await notification.update({ is_deleted: true });

        return { success: true, message: "Notification deleted" };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

// Get notifications by type (for categorization)
export async function getNotificationsByType(type, limit = 10) {
    const session = await auth();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const { user } = session;

    try {
        const notifications = await Notification.findAll({
            where: {
                user_id: user.id,
                type,
                is_deleted: false,
            },
            include: [
                {
                    model: User,
                    as: "created_by_user",
                    attributes: ["id", "name", "image"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit,
        });

        return { success: true, data: formatSeqObj(notifications) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

// Create notification (for system use)
export async function createNotification(notificationData) {
    try {
        const notification = await Notification.create(notificationData);
        return { success: true, data: formatSeqObj(notification) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}

// Get notification by ID
export async function getNotificationById(notificationId) {
    const session = await auth();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const { user } = session;

    try {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                user_id: user.id,
                is_deleted: false,
            },
            include: [
                {
                    model: User,
                    as: "created_by_user",
                    attributes: ["id", "name", "image"],
                },
            ],
        });

        if (!notification) {
            return { success: false, message: "Notification not found" };
        }

        return { success: true, data: formatSeqObj(notification) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}
