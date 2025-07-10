# Notification Bell Implementation Plan

## Overview

This plan outlines the implementation of a Facebook-style notification bell component for the PCMC Pediatric Blood Center portal. The component will display real-time notifications with categorized sections, unread counts, and action buttons.

## Current State Analysis

### Existing Infrastructure

-   ✅ `NotificationModel.js` - Database model with notification types
-   ✅ `NotificationComponent.jsx` - Basic notification component (needs enhancement)
-   ✅ Notification types defined: `AGENCY_APPROVAL`, `AGENCY_COORDINATOR_APPROVAL`, `AGENCY_DONOR_APPROVAL`, `BLOOD_DRIVE_APPROVAL`, `GENERAL`, `APPOINTMENT`, `COLLECTION`, `SYSTEM`
-   ✅ `sendNotificationAndEmail` utility for creating notifications
-   ✅ Role-based access control system

### Current NotificationComponent.jsx Issues

-   ❌ Static data (no real notifications)
-   ❌ No categorization
-   ❌ No action buttons
-   ❌ No real-time updates
-   ❌ No notification management

## Implementation Strategy

### Phase 1: Backend Infrastructure

#### 1.1 Create Notification Actions

**File:** `app/action/notificationAction.js`

```javascript
"use server";

import { auth } from "@lib/auth";
import { Notification, User } from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";
import { Op } from "sequelize";

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
```

#### 1.2 Update NotificationModel.js

**Add missing association:**

```javascript
// Add to NotificationModel.js associations
Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
    });
    Notification.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "created_by_user",
        onDelete: "SET NULL",
    });
};
```

### Phase 2: Enhanced Notification Component

#### 2.1 Create Notification Types Configuration

**File:** `lib/utils/notificationTypes.js`

```javascript
export const NOTIFICATION_TYPES = {
    // Admin-only notifications
    AGENCY_APPROVAL: {
        label: "Agency Approvals",
        icon: "Building",
        color: "blue",
        badge: "primary",
        description: "Agency registration and approval notifications",
        actionText: "Review Agency",
        actionUrl: "/portal/admin/agencies",
        allowedRoles: ["admin"],
    },
    BLOOD_DRIVE_APPROVAL: {
        label: "Blood Drive Approvals",
        icon: "Calendar",
        color: "purple",
        badge: "secondary",
        description: "Blood drive event approval notifications",
        actionText: "Review Event",
        actionUrl: "/portal/admin/events",
        allowedRoles: ["admin"],
    },

    // Agency Administrator notifications
    AGENCY_COORDINATOR_APPROVAL: {
        label: "Coordinator Approvals",
        icon: "Users",
        color: "green",
        badge: "success",
        description: "Agency coordinator approval notifications",
        actionText: "Review Coordinator",
        actionUrl: "/portal/admin/coordinators",
        allowedRoles: ["agency_administrator"],
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
        allowedRoles: ["agency_administrator", "organizer"],
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
        allowedRoles: ["admin", "agency_administrator", "organizer", "donor"],
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
        allowedRoles: ["admin", "agency_administrator", "organizer", "donor"],
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
        allowedRoles: ["admin", "agency_administrator", "organizer", "donor"],
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
        allowedRoles: ["admin", "agency_administrator", "organizer", "donor"],
        category: "appointments_collections_general",
    },
};

// Role-based category access configuration
export const ROLE_CATEGORY_ACCESS = {
    admin: [
        "agency_approval",
        "blood_drive_approval",
        "appointments_collections_general",
    ],
    agency_administrator: [
        "agency_coordinator_approval",
        "agency_donor_approval",
        "appointments_collections_general",
    ],
    organizer: ["agency_donor_approval", "appointments_collections_general"],
    donor: ["appointments_collections_general"],
};

// Category configurations for the merged section
export const NOTIFICATION_CATEGORIES = {
    agency_approval: {
        label: "Agency Approvals",
        icon: "Building",
        description: "Agency registration approvals",
        allowedRoles: ["admin"],
    },
    blood_drive_approval: {
        label: "Blood Drive Approvals",
        icon: "Calendar",
        description: "Event creation approvals",
        allowedRoles: ["admin"],
    },
    agency_coordinator_approval: {
        label: "Coordinator Approvals",
        icon: "Users",
        description: "Coordinator registration approvals",
        allowedRoles: ["agency_administrator"],
    },
    agency_donor_approval: {
        label: "Donor Approvals",
        icon: "UserCheck",
        description: "Donor registration approvals",
        allowedRoles: ["agency_administrator", "organizer"],
    },
    appointments_collections_general: {
        label: "Appointments, Collections & General",
        icon: "Bell",
        description: "All other notifications with labels",
        allowedRoles: ["admin", "agency_administrator", "organizer", "donor"],
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
```

#### 2.1.1 Role-Based Access Implementation

The notification system implements role-based access control to ensure users only see notifications relevant to their role:

**Role Access Matrix:**

-   **Admin**: Agency Approvals, Blood Drive Approvals, Appointments/Collections/General
-   **Agency Administrator**: Coordinator Approvals, Donor Approvals, Appointments/Collections/General
-   **Organizer**: Donor Approvals, Appointments/Collections/General
-   **Donor**: Appointments/Collections/General only

**Key Features:**

1. **Automatic Filtering**: Notifications are automatically filtered based on user role
2. **Category Merging**: Appointments, Collections, General, and System notifications are merged into one section with type labels
3. **Access Control**: Users cannot see notifications they don't have permission to access
4. **Dynamic Sections**: Only relevant category sections are displayed for each user role

**Implementation Notes:**

-   The `hasNotificationAccess()` function checks if a user can access a specific notification type
-   The `groupNotificationsByCategory()` function groups notifications by category while respecting role permissions
-   The merged category shows individual notification types as badges for better organization

````

#### 2.2 Create Notification Item Component

**File:** `components/layout/NotificationItem.jsx`

```javascript
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import {
    MoreVertical,
    Check,
    Trash2,
    ExternalLink,
    Building,
    Users,
    UserCheck,
    Calendar,
    Clock,
    Droplets,
    Bell,
    Settings,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    markNotificationAsRead,
    deleteNotification,
} from "@/action/notificationAction";
import notify from "@components/ui/notify";
import { getNotificationTypeConfig } from "@lib/utils/notificationTypes";
import CustomAvatar from "@components/reusable_components/CustomAvatar";

const iconMap = {
    Building,
    Users,
    UserCheck,
    Calendar,
    Clock,
    Droplets,
    Bell,
    Settings,
};

export default function NotificationItem({ notification, onAction }) {
    const [isHovered, setIsHovered] = useState(false);
    const queryClient = useQueryClient();

    const config = getNotificationTypeConfig(notification.type);
    const IconComponent = iconMap[config.icon];

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-count"] });
            notify({ message: "Notification marked as read" });
        },
        onError: (error) => {
            notify({
                error: true,
                message: error?.message || "Failed to mark as read",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-count"] });
            notify({ message: "Notification deleted" });
        },
        onError: (error) => {
            notify({
                error: true,
                message: error?.message || "Failed to delete notification",
            });
        },
    });

    const handleMarkAsRead = () => {
        if (!notification.is_read) {
            markAsReadMutation.mutate(notification.id);
        }
    };

    const handleDelete = () => {
        deleteMutation.mutate(notification.id);
    };

    const handleAction = () => {
        handleMarkAsRead();
        if (onAction) {
            onAction(notification);
        }
    };

    return (
        <Card
            className={`transition-all duration-200 cursor-pointer ${
                notification.is_read
                    ? "bg-gray-50 dark:bg-gray-900"
                    : "bg-white dark:bg-gray-800 border-l-4 border-l-blue-500"
            } ${isHovered ? "shadow-md" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleAction}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                        className={`p-2 rounded-full bg-${config.color}-100 dark:bg-${config.color}-900/20`}
                    >
                        <IconComponent
                            className={`w-4 h-4 text-${config.color}-600 dark:text-${config.color}-400`}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                                    {notification.subject}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                        variant={config.badge}
                                        className="text-xs"
                                    >
                                        {config.label}
                                    </Badge>
                                    {/* Show type label for merged category */}
                                    {config.category ===
                                        "appointments_collections_general" && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {notification.type}
                                        </Badge>
                                    )}
                                    <span className="text-xs text-gray-400">
                                        {format(
                                            new Date(notification.createdAt),
                                            "MMM dd, HH:mm"
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {!notification.is_read && (
                                        <DropdownMenuItem
                                            onClick={handleMarkAsRead}
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Mark as read
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={handleDelete}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Action Button */}
                        {config.actionUrl !== "#" && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 w-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction();
                                }}
                            >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {config.actionText}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
````

#### 2.3 Create Notification Section Component

**File:** `components/layout/NotificationSection.jsx`

```javascript
"use client";

import { useState } from "react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getCategoryConfig } from "@lib/utils/notificationTypes";
import NotificationItem from "./NotificationItem";

const iconMap = {
    Building: "🏢",
    Users: "👥",
    UserCheck: "✅",
    Calendar: "📅",
    Clock: "⏰",
    Droplets: "🩸",
    Bell: "🔔",
    Settings: "⚙️",
};

export default function NotificationSection({
    category,
    notifications,
    onAction,
    isExpanded = true,
}) {
    const [expanded, setExpanded] = useState(isExpanded);
    const config = getCategoryConfig(category);
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    if (notifications.length === 0) return null;

    return (
        <div className="space-y-2">
            {/* Section Header */}
            <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">{iconMap[config.icon]}</span>
                    <span className="font-medium text-sm">{config.label}</span>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                            {unreadCount}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                        {notifications.length} notification
                        {notifications.length !== 1 ? "s" : ""}
                    </span>
                    {expanded ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </div>
            </div>

            {/* Section Content */}
            {expanded && (
                <div className="space-y-2 pl-4">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onAction={onAction}
                        />
                    ))}
                </div>
            )}

            <Separator />
        </div>
    );
}
```

#### 2.4 Enhanced NotificationComponent

**File:** `components/layout/NotificationComponent.jsx`

```javascript
"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Settings, RefreshCw } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
    getUserNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
} from "@/action/notificationAction";
import { useSession } from "next-auth/react";
import notify from "@components/ui/notify";
import NotificationSection from "./NotificationSection";
import Skeleton from "@components/ui/skeleton";
import { groupNotificationsByCategory } from "@lib/utils/notificationTypes";

export default function NotificationComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    // Fetch notifications
    const {
        data: notificationsData,
        isLoading: notificationsLoading,
        refetch: refetchNotifications,
    } = useQuery({
        queryKey: ["user-notifications"],
        queryFn: () => getUserNotifications(1, 50),
        enabled: !!session,
        staleTime: 1000 * 30, // 30 seconds
    });

    // Fetch unread count
    const { data: unreadCountData, refetch: refetchUnreadCount } = useQuery({
        queryKey: ["unread-count"],
        queryFn: getUnreadNotificationCount,
        enabled: !!session,
        staleTime: 1000 * 10, // 10 seconds
    });

    const unreadCount = unreadCountData?.success ? unreadCountData.data : 0;
    const notifications = notificationsData?.success
        ? notificationsData.data.notifications
        : [];

    // Group notifications by category based on user role
    const groupedNotifications = groupNotificationsByCategory(
        notifications,
        session?.user?.role || "donor"
    );

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-count"] });
            notify({ message: "All notifications marked as read" });
        },
        onError: (error) => {
            notify({
                error: true,
                message: error?.message || "Failed to mark all as read",
            });
        },
    });

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const handleRefresh = () => {
        refetchNotifications();
        refetchUnreadCount();
    };

    const handleNotificationAction = (notification) => {
        // Handle navigation based on notification type
        const config = getNotificationTypeConfig(notification.type);
        if (config.actionUrl && config.actionUrl !== "#") {
            window.location.href = config.actionUrl;
        }
    };

    // Auto-refresh every 30 seconds when popover is open
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            refetchNotifications();
            refetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [isOpen, refetchNotifications, refetchUnreadCount]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="relative rounded-full p-2 group transition-all duration-700 hover:cursor-pointer">
                    <Bell className="h-6 w-6 text-yellow-800 group-hover:scale-125 group-hover:text-yellow-600 transition-transform duration-700" />

                    {/* Badge for unread notifications */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-96 p-0 max-h-[600px] overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Notifications</h3>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={notificationsLoading}
                            >
                                <RefreshCw
                                    className={`w-4 h-4 ${
                                        notificationsLoading
                                            ? "animate-spin"
                                            : ""
                                    }`}
                                />
                            </Button>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    disabled={markAllAsReadMutation.isPending}
                                >
                                    <Check className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[500px] overflow-y-auto">
                    {notificationsLoading ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-500">
                                No notifications yet
                            </p>
                            <p className="text-sm text-gray-400">
                                We'll notify you when there's something new
                            </p>
                        </div>
                    ) : (
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="all">
                                    All ({notifications.length})
                                </TabsTrigger>
                                <TabsTrigger value="unread">
                                    Unread ({unreadCount})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="p-4 space-y-4">
                                {Object.entries(groupedNotifications).map(
                                    ([category, categoryNotifications]) => (
                                        <NotificationSection
                                            key={category}
                                            category={category}
                                            notifications={
                                                categoryNotifications
                                            }
                                            onAction={handleNotificationAction}
                                        />
                                    )
                                )}
                            </TabsContent>

                            <TabsContent
                                value="unread"
                                className="p-4 space-y-4"
                            >
                                {Object.entries(groupedNotifications).map(
                                    ([category, categoryNotifications]) => {
                                        const unreadNotifications =
                                            categoryNotifications.filter(
                                                (n) => !n.is_read
                                            );
                                        if (unreadNotifications.length === 0)
                                            return null;

                                        return (
                                            <NotificationSection
                                                key={category}
                                                category={category}
                                                notifications={
                                                    unreadNotifications
                                                }
                                                onAction={
                                                    handleNotificationAction
                                                }
                                            />
                                        );
                                    }
                                )}
                            </TabsContent>
                        </Tabs>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-4 border-t dark:border-gray-700">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                                // Navigate to full notifications page
                                window.location.href = "/portal/notifications";
                            }}
                        >
                            View All Notifications
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
```

### Phase 3: Full Notifications Page

#### 3.1 Create Notifications Page

**File:** `app/(pages)/portal/notifications/page.jsx`

```javascript
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "@/action/notificationAction";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Bell, Search, Filter, Check, Trash2, RefreshCw } from "lucide-react";
import NotificationSection from "@components/layout/NotificationSection";
import Skeleton from "@components/ui/skeleton";
import {
    getNotificationTypeConfig,
    groupNotificationsByCategory,
    getAvailableCategories,
    getCategoryConfig,
} from "@lib/utils/notificationTypes";

export default function NotificationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: notificationsData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["user-notifications-full", currentPage],
        queryFn: () => getUserNotifications(currentPage, 20),
        staleTime: 1000 * 60, // 1 minute
    });

    const notifications = notificationsData?.success
        ? notificationsData.data.notifications
        : [];
    const totalPages = notificationsData?.success
        ? notificationsData.data.totalPages
        : 0;

    // Get user role (you'll need to implement this based on your auth system)
    const userRole = "admin"; // This should come from session or context

    // Filter notifications
    const filteredNotifications = notifications.filter((notification) => {
        const matchesSearch =
            notification.subject
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            notification.message
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesType =
            selectedType === "all" ||
            (selectedType === "appointments_collections_general" &&
                ["APPOINTMENT", "COLLECTION", "GENERAL", "SYSTEM"].includes(
                    notification.type
                )) ||
            (selectedType === "agency_approval" &&
                notification.type === "AGENCY_APPROVAL") ||
            (selectedType === "blood_drive_approval" &&
                notification.type === "BLOOD_DRIVE_APPROVAL") ||
            (selectedType === "agency_coordinator_approval" &&
                notification.type === "AGENCY_COORDINATOR_APPROVAL") ||
            (selectedType === "agency_donor_approval" &&
                notification.type === "AGENCY_DONOR_APPROVAL");

        return matchesSearch && matchesType;
    });

    // Group filtered notifications by category
    const groupedNotifications = groupNotificationsByCategory(
        filteredNotifications,
        userRole
    );

    const availableCategories = getAvailableCategories(userRole);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Bell className="w-8 h-8" />
                        Notifications
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your system notifications
                    </p>
                </div>
                <Button onClick={() => refetch()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={
                                    selectedType === "all"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setSelectedType("all")}
                            >
                                All
                            </Button>
                            {availableCategories.map((category) => {
                                const config = getCategoryConfig(category);
                                return (
                                    <Button
                                        key={category}
                                        variant={
                                            selectedType === category
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setSelectedType(category)
                                        }
                                    >
                                        {config.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {searchTerm || selectedType !== "all"
                                        ? "No matching notifications"
                                        : "No notifications yet"}
                                </h3>
                                <p className="text-gray-500">
                                    {searchTerm || selectedType !== "all"
                                        ? "Try adjusting your search or filters"
                                        : "We'll notify you when there's something new"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing {filteredNotifications.length}{" "}
                                notification
                                {filteredNotifications.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(groupedNotifications).map(
                                ([category, categoryNotifications]) => (
                                    <NotificationSection
                                        key={category}
                                        category={category}
                                        notifications={categoryNotifications}
                                        isExpanded={true}
                                    />
                                )
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
```

### Phase 4: Real-time Updates

#### 4.1 Add WebSocket Support (Optional)

For real-time notifications, consider implementing WebSocket support:

```javascript
// In NotificationComponent.jsx
useEffect(() => {
    if (!session) return;

    // WebSocket connection for real-time updates
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "notification" && data.userId === session.user.id) {
            // Invalidate queries to refresh notifications
            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-count"] });
        }
    };

    return () => ws.close();
}, [session, queryClient]);
```

## Implementation Checklist

### Phase 1: Backend Infrastructure

-   [x] **Step 1.1**: Create `notificationAction.js` with CRUD operations
-   [x] **Step 1.2**: Update `NotificationModel.js` associations
-   [x] **Step 1.3**: Test notification actions

### Phase 2: Component Development

-   [x] **Step 2.1**: Create `notificationTypes.js` configuration
-   [x] **Step 2.2**: Create `NotificationItem.jsx` component
-   [x] **Step 2.3**: Create `NotificationSection.jsx` component
-   [x] **Step 2.4**: Enhance `NotificationComponent.jsx`
-   [x] **Step 2.5**: Test component functionality

### Phase 3: Full Page Implementation

-   [ ] **Step 3.1**: Create notifications page
-   [ ] **Step 3.2**: Add search and filter functionality
-   [ ] **Step 3.3**: Implement pagination
-   [ ] **Step 3.4**: Test full page functionality

### Phase 4: Integration & Polish

-   [ ] **Step 4.1**: Integrate with existing layout
-   [ ] **Step 4.2**: Add real-time updates (optional)
-   [ ] **Step 4.3**: Test responsive design
-   [ ] **Step 4.4**: Add analytics tracking

## Technical Considerations

### Performance

-   Use React Query for caching and background updates
-   Implement pagination for large notification lists
-   Use skeleton loading states
-   Optimize re-renders with proper memoization

### UX/UI

-   Follow Facebook's notification patterns
-   Ensure responsive design
-   Provide clear visual hierarchy
-   Use consistent spacing and typography

### Accessibility

-   Proper ARIA labels
-   Keyboard navigation support
-   Screen reader compatibility
-   Color contrast compliance

### Security

-   Validate user permissions
-   Sanitize notification content
-   Implement proper access controls
-   Log notification actions

## Future Enhancements

### Phase 5: Advanced Features

-   [ ] **Push Notifications**: Browser push notifications
-   [ ] **Email Integration**: Email digests for unread notifications
-   [ ] **Notification Preferences**: User-configurable notification settings
-   [ ] **Notification Analytics**: Track notification engagement
-   [ ] **Smart Filtering**: AI-powered notification prioritization
-   [ ] **Bulk Actions**: Mark multiple notifications as read/delete

## Summary of Role-Based Access Implementation

### Key Changes Made

1. **Role-Based Notification Types**: Updated notification types to include `allowedRoles` property for access control
2. **Category Merging**: Appointments, Collections, General, and System notifications are now merged into a single "Appointments, Collections & General" section
3. **Role Access Matrix**: Implemented specific access rules for each user role
4. **Utility Functions**: Added helper functions for role-based filtering and category grouping
5. **Component Updates**: Updated all notification components to work with the new categorization system

### Role Access Summary

| Role                     | Available Categories                                                      | Description                                                     |
| ------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Admin**                | Agency Approvals, Blood Drive Approvals, Appointments/Collections/General | Full access to approval notifications and general notifications |
| **Agency Administrator** | Coordinator Approvals, Donor Approvals, Appointments/Collections/General  | Can approve coordinators and donors, plus general notifications |
| **Organizer**            | Donor Approvals, Appointments/Collections/General                         | Can approve donors and see general notifications                |
| **Donor**                | Appointments/Collections/General                                          | Limited to appointment and general notifications only           |

### Implementation Benefits

1. **Security**: Users only see notifications relevant to their role
2. **Organization**: Merged category reduces clutter while maintaining type labels
3. **Scalability**: Easy to add new roles or modify access permissions
4. **User Experience**: Cleaner interface with role-appropriate content

## Conclusion

This implementation provides a comprehensive Facebook-style notification system with:

1. **Role-Based Access Control**: Users only see notifications relevant to their role
2. **Categorized Sections**: Organized by notification type with merged categories
3. **Real-time Updates**: Auto-refresh and WebSocket support
4. **Action Buttons**: Direct navigation to relevant pages
5. **Search & Filter**: Easy notification discovery
6. **Responsive Design**: Works on all device sizes
7. **Accessibility**: Full keyboard and screen reader support

The system integrates seamlessly with the existing notification infrastructure while providing a modern, user-friendly interface for managing system notifications. The role-based access implementation ensures that users only see notifications relevant to their responsibilities, while the merged category approach keeps the interface clean and organized.
