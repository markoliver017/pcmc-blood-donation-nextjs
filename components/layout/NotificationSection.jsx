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
            {/* Enhanced Section Header */}
            <div
                className="flex items-center justify-between p-3 gap-5 cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {iconMap[config.icon]}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {config.label}
                        </span>
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="text-xs px-2 py-0.5 bg-gradient-to-r from-red-500 to-red-600"
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        {notifications.length} notification
                        {notifications.length !== 1 ? "s" : ""}
                    </span>
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                        {expanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Section Content */}
            {expanded && (
                <div className="space-y-2 pl-4 animate-in slide-in-from-top-2 duration-200">
                    {notifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            className="animate-in slide-in-from-left-2 duration-200"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <NotificationItem
                                notification={notification}
                                onAction={onAction}
                            />
                        </div>
                    ))}
                </div>
            )}

            <Separator className="bg-gray-200/50 dark:bg-gray-700/50" />
        </div>
    );
}
