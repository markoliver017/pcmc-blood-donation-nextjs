"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { AppointmentDatatable } from "@components/admin/appointments/AppointmentDatatable";
import { appointmentsColumns } from "@/(pages)/portal/(role_based)/admin/(admin-appointments)/appointments/(index)/appointmentsColumns";

import { useMemo } from "react";
import {
    Calendar,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    UserX,
    RefreshCcw,
} from "lucide-react";
import { DatePicker } from "@components/ui/DatePicker";
import { useQueryClient } from "@tanstack/react-query";

/**
 * AppointmentTabs component for organizing appointments by status
 * @param {Object} props - Component props
 * @param {Array} props.appointments - Array of appointment data (pre-filtered by status)
 * @param {Array} props.allAppointments - The complete, unfiltered list of appointments for calculating counts
 * @param {string} props.selectedStatus - The currently active status tab
 * @param {Function} props.onStatusChange - Handler to change the selected status
 * @param {Array} props.eventOptions - Event options for filtering
 * @param {Array} props.agencyOptions - Agency options for filtering
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} AppointmentTabs component
 */
export default function AppointmentTabs({
    appointments = [],
    allAppointments = [],
    eventOptions = [],
    agencyOptions = [],
    isLoading = false,
    selectedStatus,
    onStatusChange,
    date,
    setDate
}) {

    const queryClient = useQueryClient();
    // Define tab configurations with their respective filters, icons, and colors
    const tabConfigs = [
        {
            value: "All",
            label: "All",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            value: "registered",
            label: "Registered",
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            value: "examined",
            label: "Examined",
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            value: "collected",
            label: "Collected",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            value: "cancelled",
            label: "Cancelled",
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            value: "deferred",
            label: "Deferred",
            icon: AlertTriangle,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            value: "no show",
            label: "No Show",
            icon: UserX,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
        },
    ];

    // Calculate counts for each tab from the complete list of appointments
    const tabCounts = useMemo(() => {
        const counts = allAppointments.reduce((acc, appointment) => {
            const status = appointment.status || "registered";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        counts.All = allAppointments.length;
        return counts;
    }, [allAppointments]);

    const activeTabConfig =
        tabConfigs.find((tab) => tab.value === selectedStatus) || tabConfigs[0];

    return (
        <Tabs
            value={selectedStatus}
            onValueChange={onStatusChange}
            className="w-full"
        >
            <TabsList className="grid w-full grid-cols-7 mb-8 h-auto p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
                {tabConfigs.map((tab) => {
                    const IconComponent = tab.icon;
                    const count = tabCounts[tab.value] || 0;

                    return (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex flex-col items-center gap-2 p-4 h-auto data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm rounded-md transition-all duration-200 hover:bg-white/50"
                        >
                            <div
                                className={`p-2 rounded-lg ${tab.bgColor} transition-colors`}
                            >
                                <IconComponent
                                    className={`h-4 w-4 ${tab.color}`}
                                />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-medium">
                                    {tab.label}
                                </span>
                                <span
                                    className={`
                                    inline-flex items-center justify-center min-w-[20px] h-5 px-2 
                                    text-xs font-bold rounded-full transition-colors
                                    ${
                                        count > 0
                                            ? `${tab.color.replace(
                                                  "text-",
                                                  "text-"
                                              )} ${tab.bgColor.replace(
                                                  "bg-",
                                                  "bg-"
                                              )} border border-current border-opacity-20`
                                            : "text-gray-400 bg-gray-100"
                                    }
                                `}
                                >
                                    {count}
                                </span>
                            </div>
                        </TabsTrigger>
                    );
                })}
            </TabsList>

            <TabsContent value={selectedStatus} className="space-y-4 mt-6">
                <div className="flex justify-between">

                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className={`p-2 rounded-lg ${activeTabConfig.bgColor}`}
                        >
                            <activeTabConfig.icon
                                className={`h-5 w-5 ${activeTabConfig.color}`}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {activeTabConfig.label} Appointments
                            </h3>
                            <p className="text-sm text-gray-600">
                                {appointments.length} appointment
                                {appointments.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                    </div>
                    {/* Controls: Date Picker and Refresh Button */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <DatePicker
                                date={date.from}
                                onDateChange={(newDate) =>
                                    setDate((prev) => ({ ...prev, from: newDate }))
                                }
                                placeholder="From date"
                            />
                            <DatePicker
                                date={date.to}
                                onDateChange={(newDate) =>
                                    setDate((prev) => ({ ...prev, to: newDate }))
                                }
                                placeholder="To date"
                            />
                        </div>
                        <button
                            className="btn btn-circle btn-warning"
                            onClick={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["all-appointments", date],
                                })
                            }
                            title="Refresh appointments data"
                        >
                            <RefreshCcw className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <AppointmentDatatable
                    columns={appointmentsColumns}
                    data={appointments || []}
                    isLoading={isLoading}
                    eventOptions={eventOptions}
                    agencyOptions={agencyOptions}
                />
            </TabsContent>
        </Tabs>
    );
}
