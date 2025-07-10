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
                        className={`p-2 rounded-full ${
                            config.color === "blue"
                                ? "bg-blue-100 dark:bg-blue-900/20"
                                : config.color === "green"
                                ? "bg-green-100 dark:bg-green-900/20"
                                : config.color === "orange"
                                ? "bg-orange-100 dark:bg-orange-900/20"
                                : config.color === "purple"
                                ? "bg-purple-100 dark:bg-purple-900/20"
                                : config.color === "cyan"
                                ? "bg-cyan-100 dark:bg-cyan-900/20"
                                : config.color === "red"
                                ? "bg-red-100 dark:bg-red-900/20"
                                : config.color === "gray"
                                ? "bg-gray-100 dark:bg-gray-900/20"
                                : config.color === "slate"
                                ? "bg-slate-100 dark:bg-slate-900/20"
                                : "bg-gray-100 dark:bg-gray-900/20"
                        }`}
                    >
                        <IconComponent
                            className={`w-4 h-4 ${
                                config.color === "blue"
                                    ? "text-blue-600 dark:text-blue-400"
                                    : config.color === "green"
                                    ? "text-green-600 dark:text-green-400"
                                    : config.color === "orange"
                                    ? "text-orange-600 dark:text-orange-400"
                                    : config.color === "purple"
                                    ? "text-purple-600 dark:text-purple-400"
                                    : config.color === "cyan"
                                    ? "text-cyan-600 dark:text-cyan-400"
                                    : config.color === "red"
                                    ? "text-red-600 dark:text-red-400"
                                    : config.color === "gray"
                                    ? "text-gray-600 dark:text-gray-400"
                                    : config.color === "slate"
                                    ? "text-slate-600 dark:text-slate-400"
                                    : "text-gray-600 dark:text-gray-400"
                            }`}
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
                                        className="opacity-0 hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {!notification.is_read && (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead();
                                            }}
                                            disabled={
                                                markAsReadMutation.isPending
                                            }
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Mark as read
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        disabled={deleteMutation.isPending}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Action Button */}
                        {config.actionUrl && config.actionUrl !== "#" && (
                            <div className="mt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction();
                                    }}
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    {config.actionText}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
