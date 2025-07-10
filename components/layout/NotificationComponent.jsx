"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
import {
    groupNotificationsByCategory,
    getNotificationTypeConfig,
} from "@lib/utils/notificationTypes";

export default function NotificationComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    console.log("session", session);
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
        session?.user?.role_name || "Admin"
    );
    console.log("groupedNotifications", groupedNotifications);

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
