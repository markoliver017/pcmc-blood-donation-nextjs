export const NOTIFICATION_TYPES = {
    // Admin-only notifications
    AGENCY_APPROVAL: {
        label: "Agency Approvals",
        icon: "Building",
        color: "blue",
        badge: "primary",
        description: "Agency registration and approval notifications",
        actionText: "Review Agency",
        actionUrl: "/agencies/",
        allowedRoles: ["Admin"],
        category: "AGENCY_APPROVAL",
    },

    AGENCY_STATUS_UPDATE: {
        label: "Agency Status Update",
        icon: "Building",
        color: "blue",
        badge: "primary",
        description: "Agency status update notifications",
        actionText: "View Agency",
        actionUrl: "/agencies/",
        allowedRoles: ["Admin"],
        category: "AGENCY_APPROVAL",
    },

    // Agency Administrator notifications
    AGENCY_COORDINATOR_APPROVAL: {
        label: "Coordinator Approvals",
        icon: "Users",
        color: "green",
        badge: "success",
        description: "Agency coordinator approval notifications",
        actionText: "Review Coordinator",
        actionUrl: "/manage-coordinators/",
        allowedRoles: ["Agency Administrator"],
        category: "AGENCY_COORDINATOR_APPROVAL",
    },

    COORDINATOR_REGISTRATION: {
        label: "Coordinator Registration",
        icon: "Users",
        color: "green",
        badge: "success",
        description: "New coordinator registration notifications",
        actionText: "View Details",
        actionUrl: "/coordinators/",
        allowedRoles: ["Admin"],
        category: "AGENCY_COORDINATOR_APPROVAL",
    },

    COORDINATOR_STATUS_UPDATE: {
        label: "Coordinator Status Update",
        icon: "Users",
        color: "green",
        badge: "success",
        description: "Coordinator status update notifications",
        actionText: "View Details",
        actionUrl: "/coordinators/",
        allowedRoles: ["Admin"],
        category: "AGENCY_COORDINATOR_APPROVAL",
    },

    BLOOD_DRIVE_APPROVAL: {
        label: "Blood Drive Approvals",
        icon: "Calendar",
        color: "purple",
        badge: "secondary",
        description: "Blood drive event approval notifications",
        actionText: "Review Event",
        actionUrl: "/portal/admin/events",
        allowedRoles: ["Admin"],
        category: "BLOOD_DRIVE_APPROVAL",
    },
    // Agency Administrator & Organizer notifications
    AGENCY_DONOR_APPROVAL: {
        label: "Donor Approvals",
        icon: "UserCheck",
        color: "orange",
        badge: "warning",
        description: "Donor registration approval notifications",
        actionText: "Review Donor",
        actionUrl: "/portal/admin/donors",
        allowedRoles: ["Agency Administrator", "Organizer"],
        category: "AGENCY_DONOR_APPROVAL",
    },

    // All roles notifications (merged into one section)
    APPOINTMENT: {
        label: "Appointments",
        icon: "Clock",
        color: "cyan",
        badge: "info",
        description: "Appointment related notifications",
        actionText: "View Appointment",
        actionUrl: "/portal/donors/donor-appointments",
        allowedRoles: ["Admin", "Agency Administrator", "Organizer", "Donor"],
        category: "appointments_collections_general",
    },
    COLLECTION: {
        label: "Blood Collections",
        icon: "Droplets",
        color: "red",
        badge: "destructive",
        description: "Blood collection notifications",
        actionText: "View Collection",
        actionUrl: "/portal/admin/blood-collections",
        allowedRoles: ["Admin", "Agency Administrator", "Organizer", "Donor"],
        category: "appointments_collections_general",
    },
    GENERAL: {
        label: "General",
        icon: "Bell",
        color: "gray",
        badge: "default",
        description: "General system notifications",
        actionText: "View Details",
        actionUrl: "#",
        allowedRoles: ["Admin", "Agency Administrator", "Organizer", "Donor"],
        category: "appointments_collections_general",
    },
    SYSTEM: {
        label: "System",
        icon: "Settings",
        color: "slate",
        badge: "outline",
        description: "System maintenance and updates",
        actionText: "View Details",
        actionUrl: "#",
        allowedRoles: ["Admin", "Agency Administrator", "Organizer", "Donor"],
        category: "appointments_collections_general",
    },
};

// Role-based category access configuration
export const ROLE_CATEGORY_ACCESS = {
    Admin: [
        "AGENCY_APPROVAL",
        "AGENCY_STATUS_UPDATE",
        "BLOOD_DRIVE_APPROVAL",
        "AGENCY_COORDINATOR_APPROVAL",
        "appointments_collections_general",
    ],
    "Agency Administrator": [
        "AGENCY_COORDINATOR_APPROVAL",
        "AGENCY_DONOR_APPROVAL",
        "appointments_collections_general",
    ],
    Organizer: ["AGENCY_DONOR_APPROVAL", "appointments_collections_general"],
    Donor: ["appointments_collections_general"],
};

// Category configurations for the merged section
export const NOTIFICATION_CATEGORIES = {
    AGENCY_APPROVAL: {
        label: "Agency Approvals",
        icon: "Building",
        description: "Agency registration approvals",
        allowedRoles: ["Admin"],
    },
    BLOOD_DRIVE_APPROVAL: {
        label: "Blood Drive Approvals",
        icon: "Calendar",
        description: "Event creation approvals",
        allowedRoles: ["Admin"],
    },
    AGENCY_COORDINATOR_APPROVAL: {
        label: "Coordinator Approvals",
        icon: "Users",
        description: "Coordinator registration approvals",
        allowedRoles: ["Agency Administrator", "Admin"],
    },
    AGENCY_DONOR_APPROVAL: {
        label: "Donor Approvals",
        icon: "UserCheck",
        description: "Donor registration approvals",
        allowedRoles: ["Agency Administrator", "Organizer"],
    },
    appointments_collections_general: {
        label: "Appointments, Collections & General",
        icon: "Bell",
        description: "All other notifications with labels",
        allowedRoles: ["Admin", "Agency Administrator", "Organizer", "Donor"],
    },
};

export const getNotificationTypeConfig = (type) => {
    return NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.GENERAL;
};

export const getNotificationTypeIcon = (type) => {
    const config = getNotificationTypeConfig(type);
    return config.icon;
};

export const getNotificationTypeColor = (type) => {
    const config = getNotificationTypeConfig(type);
    return config.color;
};

export const getNotificationTypeBadge = (type) => {
    const config = getNotificationTypeConfig(type);
    return config.badge;
};

// Check if user has access to notification type
export const hasNotificationAccess = (notificationType, userRole) => {
    const config = getNotificationTypeConfig(notificationType);
    return config.allowedRoles?.includes(userRole) || false;
};

// Get available categories for user role
export const getAvailableCategories = (userRole) => {
    return ROLE_CATEGORY_ACCESS[userRole] || [];
};

// Group notifications by category for display
export const groupNotificationsByCategory = (notifications, userRole) => {
    const availableCategories = getAvailableCategories(userRole);

    const grouped = {};

    notifications.forEach((notification) => {
        const config = getNotificationTypeConfig(notification.type);

        // Check if user has access to this notification type
        if (!hasNotificationAccess(notification.type, userRole)) {
            // console.log("no notification access", notification.type);
            return; // Skip notifications user doesn't have access to
        }

        // Determine category
        let category;
        if (config.category) {
            category = config.category;
        } else {
            // Map notification type to category
            switch (notification.type) {
                case "AGENCY_APPROVAL":
                    category = "agency_approval";
                    break;
                case "BLOOD_DRIVE_APPROVAL":
                    category = "blood_drive_approval";
                    break;
                case "AGENCY_COORDINATOR_APPROVAL":
                    category = "agency_coordinator_approval";
                    break;
                case "AGENCY_DONOR_APPROVAL":
                    category = "agency_donor_approval";
                    break;
                default:
                    category = "appointments_collections_general";
            }
        }

        // Only include categories the user has access to
        if (availableCategories.includes(category)) {
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(notification);
        }
    });

    return grouped;
};

// Get category configuration
export const getCategoryConfig = (category) => {
    return (
        NOTIFICATION_CATEGORIES[category] ||
        NOTIFICATION_CATEGORIES.appointments_collections_general
    );
};
