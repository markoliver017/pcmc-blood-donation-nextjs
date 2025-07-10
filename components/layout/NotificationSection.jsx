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
