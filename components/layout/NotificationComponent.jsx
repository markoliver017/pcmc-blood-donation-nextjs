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
import AgencyNotificationModal from "@components/notification/AgencyNotificationModal";
import { useRouter } from "next/navigation";
import NotificationItem from "./NotificationItem";

export default function NotificationComponent() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState("all");
    const { data: session } = useSession();

    const queryClient = useQueryClient();

    // Fetch notifications with optimized configuration
    const {
        data: notificationsData,
        isLoading: notificationsLoading,
        refetch: refetchNotifications,
    } = useQuery({
        queryKey: ["user-notifications"],
        queryFn: () => getUserNotifications(1, 50),
        enabled: !!session,
        staleTime: 1000 * 30, // 30 seconds
        gcTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });

    // Fetch unread count with optimized configuration
    const { data: unreadCountData, refetch: refetchUnreadCount } = useQuery({
        queryKey: ["unread-count"],
        queryFn: getUnreadNotificationCount,
        enabled: !!session,
        staleTime: 1000 * 10, // 10 seconds
        gcTime: 1000 * 60 * 2, // 2 minutes
        refetchOnWindowFocus: false,
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

    // Auto-refresh every 30 seconds when popover is open
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            refetchNotifications();
            refetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [isOpen, refetchNotifications, refetchUnreadCount]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    if (!session || !session?.user?.roles?.length) return null;
    const { roles, role_name: session_role } = session.user;
    const currentLoggedInRole = roles.find(
        (role) => role.role_name == session_role
    );

    const handleNotificationAction = (notification) => {
        // Handle navigation based on notification type
        // console.log("notification", notification);

        const config = getNotificationTypeConfig(notification.type);
        // console.log("config", config);
        if (config.actionUrl && config.actionUrl !== "#") {
            if (config?.category === "AGENCY_APPROVAL") {
                router.push(
                    currentLoggedInRole?.url +
                        config.actionUrl +
                        notification?.reference_id
                );
            } else if (config?.category === "AGENCY_COORDINATOR_APPROVAL") {
                router.push(
                    currentLoggedInRole?.url +
                        config.actionUrl +
                        notification?.reference_id
                );
            } else if (config?.category === "AGENCY_DONOR_APPROVAL") {
                router.push(
                    currentLoggedInRole?.url +
                        config.actionUrl +
                        notification?.reference_id
                );
            } else {
                router.push(
                    currentLoggedInRole?.url +
                        config.actionUrl +
                        notification?.reference_id
                );
            }
        } else {
            setNotification(notification);
            setIsAgencyModalOpen(true);
        }
    };

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const handleRefresh = () => {
        refetchNotifications();
        refetchUnreadCount();
    };

    // Keyboard navigation support
    const handleKeyDown = (e) => {
        if (e.key === "Escape" && isOpen) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        className="relative rounded-full p-2 group transition-all duration-300 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label={`${unreadCount} unread notifications`}
                        aria-expanded={isOpen}
                        aria-haspopup="dialog"
                    >
                        <div className="relative">
                            <Bell className="h-6 w-6 text-yellow-800 group-hover:scale-110 group-hover:text-yellow-600 transition-all duration-300" />

                            {/* Enhanced Badge for unread notifications */}
                            {unreadCount > 0 && (
                                <span
                                    className={`absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg border-2 border-white dark:border-gray-900 ${
                                        unreadCount > 0 ? "animate-pulse" : ""
                                    }`}
                                >
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}

                            {/* Pulse ring effect for unread notifications */}
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-red-400 opacity-20 animate-ping"></span>
                            )}
                        </div>
                    </button>
                </PopoverTrigger>

                <PopoverContent className=" p-0 max-h-[80vh] overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl w-96 sm:w-80 md:w-96 lg:w-140">
                    {/* Enhanced Header */}
                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                        Notifications
                                    </h3>
                                    {unreadCount > 0 && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {unreadCount} unread notification
                                            {unreadCount !== 1 ? "s" : ""}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={notificationsLoading}
                                    className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                                        disabled={
                                            markAllAsReadMutation.isPending
                                        }
                                        className="hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[500px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto">
                        {notificationsLoading ? (
                            <div className="p-4 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                                <div className="flex space-x-2">
                                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    No notifications yet
                                </h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    We'll notify you when there's something new
                                </p>
                            </div>
                        ) : (
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                    <TabsTrigger
                                        value="all"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:text-white transition-all duration-200 rounded-md"
                                    >
                                        All ({notifications.length})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="unread"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:text-white transition-all duration-200 rounded-md"
                                    >
                                        Unread ({unreadCount})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="all"
                                    className="p-4 space-y-4"
                                >
                                    {Object.entries(groupedNotifications).map(
                                        ([category, categoryNotifications]) => (
                                            <NotificationSection
                                                key={category}
                                                category={category}
                                                notifications={
                                                    categoryNotifications
                                                }
                                                onAction={
                                                    handleNotificationAction
                                                }
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
                                            if (
                                                unreadNotifications.length === 0
                                            )
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

                    {/* Enhanced Footer */}
                    {notifications.length > 0 && (
                        <div className="hidden p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/30 to-gray-100/30 dark:from-gray-800/30 dark:to-gray-900/30">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                    // Navigate to full notifications page
                                    window.location.href =
                                        "/portal/notifications";
                                }}
                            >
                                View All Notifications
                            </Button>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
            <AgencyNotificationModal
                isOpen={isAgencyModalOpen}
                setIsOpen={setIsAgencyModalOpen}
                modal={true}
            >
                {notification && (
                    <NotificationItem
                        notification={notification}
                        onAction={handleNotificationAction}
                        viewAction={false}
                    />
                )}
            </AgencyNotificationModal>
        </>
    );
}
