"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";

// Import dashboard components
import {
    EventDashboardLayout,
    EventDashboardHeader,
    EventStatisticsCards,
    PendingDonorsList,
    ExaminedDonorsList,
    CollectedDonorsList,
    DeferredDonorsList,
    EventDashboardDataTable,
    AppointmentManagementModal,
} from ".";

// Import action functions
import {
    getEventDashboardData,
    updateAppointmentStatus,
} from "@/action/adminEventAction";
import CancelledDonorsList from "./CancelledDonorsList";
import { Toaster } from "sonner";

export default function EventDashboardClient({ eventId, roleName }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // State management
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);

    // Query for dashboard data
    const {
        data: dashboardData,
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["event-dashboard", eventId],
        queryFn: async () => {
            const res = await getEventDashboardData(eventId);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        // staleTime: 30 * 1000, // Data is fresh for 30 seconds
        // cacheTime: 5 * 60 * 1000, // Cache persists for 5 minutes
    });

    const {
        event,
        appointments: appointmentsByStatus,
        statistics,
        all_appointments,
        deferred_donors,
    } = dashboardData || {};

    // Debug logging
    // console.log("Dashboard data structure:", {
    //     event: !!event,
    //     appointmentsByStatus: !!appointmentsByStatus,
    //     statistics: statistics,
    //     all_appointments: Array.isArray(all_appointments),
    //     deferred_donors: Array.isArray(deferred_donors),
    // });

    // Mutation for status updates
    // const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    //     mutationFn: async ({ appointmentId, newStatus, comments }) => {
    //         const res = await updateAppointmentStatus({
    //             appointmentId,
    //             eventId,
    //             status: newStatus,
    //             comments,
    //         });
    //         if (!res.success) {
    //             throw res;
    //         }
    //         return res.data;
    //     },
    //     onSuccess: (data) => {
    //         // Invalidate and refetch dashboard data
    //         queryClient.invalidateQueries({
    //             queryKey: ["event-dashboard", eventId],
    //         });
    //         queryClient.invalidateQueries({
    //             queryKey: ["event-statistics", eventId],
    //         });

    //         SweetAlert({
    //             title: "Status Updated",
    //             text: `Appointment status has been successfully updated to ${data.status}.`,
    //             icon: "success",
    //             confirmButtonText: "Okay",
    //         });
    //     },
    //     onError: (error) => {
    //         // Handle validation errors
    //         if (error?.type === "validation" && error?.errorArr?.length) {
    //             notify({
    //                 error: true,
    //                 message: error.message,
    //             });
    //         } else {
    //             // Handle server errors
    //             notify({
    //                 error: true,
    //                 message: error?.message || "Failed to update status",
    //             });
    //         }
    //     },
    // });

    // Helper function to get appointments by status
    const getAppointmentsByStatus = useCallback(
        (status) => {
            if (
                !appointmentsByStatus ||
                typeof appointmentsByStatus !== "object"
            ) {
                console.warn(
                    "appointmentsByStatus is not available or not an object:",
                    appointmentsByStatus
                );
                return [];
            }

            // Map status names to the object keys
            const statusMap = {
                registered: "pending",
                examined: "examined",
                collected: "collected",
                cancelled: "cancelled",
                "no show": "noShow",
            };

            const key = statusMap[status] || status;
            const result = appointmentsByStatus[key];

            if (!Array.isArray(result)) {
                console.warn(
                    `No appointments found for status "${status}" (key: "${key}")`
                );
                return [];
            }

            return result;
        },
        [appointmentsByStatus]
    );

    // not used
    // const handleStatusUpdate = useCallback(
    //     (appointmentId, newStatus, comments) => {
    //         updateStatus({ appointmentId, newStatus, comments });
    //     },
    //     [updateStatus]
    // );

    // Handle tab change
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    // Handle refresh
    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    // Handle back navigation
    const handleBack = () => {
        router.back();
    };

    // Handle appointment management
    const handleManageAppointment = useCallback((appointment) => {
        setSelectedAppointment(appointment);
        setIsManagementModalOpen(true);
    }, []);

    // Handle close management modal
    const handleCloseManagementModal = useCallback(() => {
        setIsManagementModalOpen(false);
        setSelectedAppointment(null);
    }, []);

    // Render loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        Loading event dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                Error Loading Dashboard
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {error?.message ||
                                    "Failed to load dashboard data"}
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleBack} variant="outline">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Event
                                </Button>
                                <Button onClick={handleRefresh}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Retry
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Prepare tab data
    const tabData = {
        overview: {
            label: "Overview",
            icon: CheckCircle,
            count: all_appointments?.length || 0,
            component: (
                <div className="space-y-6">
                    <EventStatisticsCards statistics={statistics} />
                    <EventDashboardDataTable
                        appointments={all_appointments || []}
                        eventId={eventId}
                        roleName={roleName}
                    />
                </div>
            ),
        },
        pending: {
            label: "Pending",
            icon: Clock,
            count: getAppointmentsByStatus("registered").length,
            component: (
                <PendingDonorsList
                    eventId={eventId}
                    appointments={getAppointmentsByStatus("registered")}
                    onManageAppointment={handleManageAppointment}
                    roleName={roleName}
                />
            ),
        },
        examined: {
            label: "Examined",
            icon: CheckCircle,
            count: getAppointmentsByStatus("examined").length,
            component: (
                <ExaminedDonorsList
                    eventId={eventId}
                    appointments={getAppointmentsByStatus("examined")}
                    onManageAppointment={handleManageAppointment}
                    roleName={roleName}
                />
            ),
        },
        collected: {
            label: "Collected",
            icon: CheckCircle,
            count: getAppointmentsByStatus("collected").length,
            component: (
                <CollectedDonorsList
                    eventId={eventId}
                    appointments={getAppointmentsByStatus("collected")}
                    onManageAppointment={handleManageAppointment}
                    roleName={roleName}
                />
            ),
        },
        deferred: {
            label: "Deferred/No Show",
            icon: AlertCircle,
            count:
                (deferred_donors?.length || 0) +
                getAppointmentsByStatus("no show").length,
            component: (
                <DeferredDonorsList
                    eventId={eventId}
                    appointments={[
                        ...(deferred_donors || []),
                        ...getAppointmentsByStatus("no show"),
                    ]}
                    onManageAppointment={handleManageAppointment}
                    roleName={roleName}
                />
            ),
        },
        cancelled: {
            label: "Cancelled Appointments",
            icon: AlertCircle,
            count: getAppointmentsByStatus("cancelled").length,
            component: (
                <CancelledDonorsList
                    appointments={getAppointmentsByStatus("cancelled")}
                    onManageAppointment={handleManageAppointment}
                    roleName={roleName}
                />
            ),
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Error Alert */}
            {error && (
                <Alert className="mx-4 mt-4 border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            {/* Dashboard Layout */}
            <EventDashboardLayout
                event={event}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabData={tabData}
                onRefresh={handleRefresh}
                isRefreshing={isFetching}
                lastUpdated={new Date()}
                onBack={handleBack}
                onProgress={
                    getAppointmentsByStatus("registered").length
                        ? getAppointmentsByStatus("registered").length /
                          statistics.total_registered
                        : 1
                }
            >
                {/* Tab Content */}
                <div className="p-6">{tabData[activeTab]?.component}</div>
            </EventDashboardLayout>

            {/* Loading Overlay */}
            {/* {isUpdating && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Updating...</span>
                    </div>
                </div>
            )} */}

            {/* Appointment Management Modal */}
            <Toaster />
            {selectedAppointment && (
                <AppointmentManagementModal
                    isOpen={isManagementModalOpen}
                    onClose={handleCloseManagementModal}
                    appointmentId={selectedAppointment.id}
                    eventId={eventId}
                />
            )}
        </div>
    );
}
