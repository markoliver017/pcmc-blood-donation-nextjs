"use server";

import { auth } from "@lib/auth";
import { createNotification } from "./notificationAction";

// Test function to create sample notifications
export async function createTestNotifications() {
    const session = await auth();
    if (!session) {
        return [
            {
                success: false,
                message: "You are not authorized to access this request.",
            },
        ];
    }

    const { user } = session;
    const testNotifications = [
        {
            user_id: user.id,
            subject: "New Agency Registration",
            message: "A new agency has registered and requires approval",
            type: "AGENCY_APPROVAL",
            reference_id: "agency-123",
            created_by: user.id,
        },
        {
            user_id: user.id,
            subject: "Blood Drive Event Created",
            message:
                "A new blood drive event has been created and needs approval",
            type: "BLOOD_DRIVE_APPROVAL",
            reference_id: "event-456",
            created_by: user.id,
        },
        {
            user_id: user.id,
            subject: "New Coordinator Application",
            message: "A new coordinator has applied to your agency",
            type: "AGENCY_COORDINATOR_APPROVAL",
            reference_id: "coordinator-789",
            created_by: user.id,
        },
        {
            user_id: user.id,
            subject: "New Donor Registration",
            message: "A new donor has registered and needs approval",
            type: "AGENCY_DONOR_APPROVAL",
            reference_id: "donor-101",
            created_by: user.id,
        },
        {
            user_id: user.id,
            subject: "Appointment Confirmed",
            message: "Your blood donation appointment has been confirmed",
            type: "APPOINTMENT",
            reference_id: "appointment-202",
            created_by: user.id,
        },
        {
            user_id: user.id,
            subject: "Blood Collection Complete",
            message: "Your blood collection has been completed successfully",
            type: "COLLECTION",
            reference_id: "collection-303",
            created_by: user.id,
        },
        {
            user_id: user.id,
            subject: "System Maintenance",
            message: "Scheduled maintenance will occur tonight at 2 AM",
            type: "SYSTEM",
            reference_id: "maintenance-404",
            created_by: user.id,
        },
        {
            user_id: user.id,
            subject: "General Announcement",
            message: "Welcome to the PCMC Pediatric Blood Center portal",
            type: "GENERAL",
            reference_id: "announcement-505",
            created_by: user.id,
        },
    ];

    const results = [];
    for (const notification of testNotifications) {
        try {
            const result = await createNotification(notification);
            results.push(result);
        } catch (error) {
            results.push({ success: false, message: error.message });
        }
    }

    return results;
}
