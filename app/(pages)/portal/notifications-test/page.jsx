"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import {
    getUserNotifications,
    getUnreadNotificationCount,
} from "@/action/notificationAction";
import { createTestNotifications } from "@/action/testNotificationAction";
import {
    groupNotificationsByCategory,
    getNotificationTypeConfig,
} from "@lib/utils/notificationTypes";
import { useSession } from "next-auth/react";
import notify from "@components/ui/notify";
import NotificationSection from "@components/layout/NotificationSection";

export default function NotificationsTestPage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [testResults, setTestResults] = useState([]);

    // Fetch notifications
    const {
        data: notificationsData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["user-notifications-test"],
        queryFn: () => getUserNotifications(1, 50),
        enabled: !!session,
    });

    // Fetch unread count
    const { data: unreadCountData } = useQuery({
        queryKey: ["unread-count-test"],
        queryFn: getUnreadNotificationCount,
        enabled: !!session,
    });

    const notifications = notificationsData?.success
        ? notificationsData.data.notifications
        : [];
    const unreadCount = unreadCountData?.success ? unreadCountData.data : 0;

    // Group notifications by category
    const groupedNotifications = groupNotificationsByCategory(
        notifications,
        session?.user?.role_name || "Donor"
    );

    // Create test notifications mutation
    const createTestMutation = useMutation({
        mutationFn: createTestNotifications,
        onSuccess: (results) => {
            setTestResults(results);
            queryClient.invalidateQueries({
                queryKey: ["user-notifications-test"],
            });
            queryClient.invalidateQueries({ queryKey: ["unread-count-test"] });
            notify({ message: "Test notifications created successfully" });
        },
        onError: (error) => {
            notify({
                error: true,
                message:
                    error?.message || "Failed to create test notifications",
            });
        },
    });

    const handleCreateTestNotifications = () => {
        createTestMutation.mutate();
    };

    const handleNotificationAction = (notification) => {
        const config = getNotificationTypeConfig(notification.type);
        notify({ message: `Notification action: ${config.actionText}` });
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Notification System Test
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Test the notification components and functionality
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => refetch()}>Refresh</Button>
                    <Button
                        onClick={handleCreateTestNotifications}
                        disabled={createTestMutation.isPending}
                        variant="outline"
                    >
                        {createTestMutation.isPending
                            ? "Creating..."
                            : "Create Test Notifications"}
                    </Button>
                </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Test Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {testResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <Badge
                                        variant={
                                            result.success
                                                ? "default"
                                                : "destructive"
                                        }
                                    >
                                        {result.success ? "Success" : "Error"}
                                    </Badge>
                                    <span className="text-sm">
                                        {result.message ||
                                            "Notification created"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {notifications.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total Notifications
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{unreadCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Unread Notifications
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {Object.keys(groupedNotifications).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* User Info */}
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div>
                            <strong>Name:</strong>{" "}
                            {session?.user?.name || "Not available"}
                        </div>
                        <div>
                            <strong>Email:</strong>{" "}
                            {session?.user?.email || "Not available"}
                        </div>
                        <div>
                            <strong>Role:</strong>{" "}
                            {session?.user?.role_name || "Not available"}
                        </div>
                        <div>
                            <strong>User ID:</strong>{" "}
                            {session?.user?.id || "Not available"}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Display */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Notifications ({notifications.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <p>Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No notifications found
                            </p>
                            <p className="text-sm text-gray-400">
                                Create test notifications to see them here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedNotifications).map(
                                ([category, categoryNotifications]) => (
                                    <NotificationSection
                                        key={category}
                                        category={category}
                                        notifications={categoryNotifications}
                                        onAction={handleNotificationAction}
                                        isExpanded={true}
                                    />
                                )
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
