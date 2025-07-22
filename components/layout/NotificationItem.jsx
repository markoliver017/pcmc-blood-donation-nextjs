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
            className={`transition-all duration-300 cursor-pointer group ${notification.is_read
                    ? "bg-gray-50/80 dark:bg-gray-900/80 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                    : "bg-white dark:bg-gray-800 border-l-8 border-l-blue-500 dark:border-l-blue-200  shadow-sm hover:shadow-md"
                } ${isHovered ? "scale-[1.02] shadow-lg" : ""
                } hover:border-gray-200 dark:hover:border-gray-700`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleAction}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Enhanced Icon */}
                    <div
                        className={`p-2.5 rounded-xl transition-all duration-200 group-hover:scale-110 ${config.color === "blue"
                                ? "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
                                : config.color === "green"
                                    ? "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30"
                                    : config.color === "orange"
                                        ? "bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30"
                                        : config.color === "purple"
                                            ? "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30"
                                            : config.color === "cyan"
                                                ? "bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30"
                                                : config.color === "red"
                                                    ? "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30"
                                                    : config.color === "gray"
                                                        ? "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/30 dark:to-gray-800/30"
                                                        : config.color === "slate"
                                                            ? "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30"
                                                            : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/30 dark:to-gray-800/30"
                            }`}
                    >
                        <IconComponent
                            className={`w-4 h-4 transition-colors duration-200 ${config.color === "blue"
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

                    {/* Enhanced Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h4
                                    className={`font-semibold text-sm line-clamp-2 transition-colors duration-200 ${notification.is_read
                                            ? "text-gray-700 dark:text-gray-300"
                                            : "text-gray-900 dark:text-white"
                                        }`}
                                >
                                    {notification.subject}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                </p>
                                <div className="flex items-center justify-between gap-2 mt-3">
                                    <Badge
                                        variant={config.badge}
                                        className="text-xs px-2 py-0.5 transition-all duration-200 hover:scale-105"
                                    >
                                        {config.label}
                                    </Badge>
                                    {/* Show type label for merged category */}
                                    {config.category ===
                                        "appointments_collections_general" && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-gray-800"
                                            >
                                                {notification.type}
                                            </Badge>
                                        )}
                                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                        {format(
                                            new Date(notification.createdAt),
                                            "MMM dd | hh:mm a"
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Enhanced Actions */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    {!notification.is_read && (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead();
                                            }}
                                            disabled={
                                                markAsReadMutation.isPending
                                            }
                                            className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
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
                                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Enhanced Action Button */}
                        {config.actionUrl && config.actionUrl !== "#" && (
                            <div className="mt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 dark:hover:text-white transition-all duration-200"
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
