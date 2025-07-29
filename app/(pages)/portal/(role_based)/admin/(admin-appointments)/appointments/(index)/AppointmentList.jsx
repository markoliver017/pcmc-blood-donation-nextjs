"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Users2Icon } from "lucide-react";
import { subDays } from "date-fns";

import { Card } from "@components/ui/card";
import {
    getAllAgencyOptions,
    getAllAppointments,
    getAllEventOptions,
} from "@action/adminEventAction";
import DashboardStats from "@components/admin/appointments/DashboardStats";
// import AppointmentTabs from "@/components/admin/appointments/AppointmentTabs";

import DataTableSkeleton from "@components/ui/DataTableSkeleton";
import { DatePicker } from "@components/ui/DatePicker";
import AppointmentTabs from "@components/admin/appointments/AppointmentTabs";

export default function AppointmentList() {
    const queryClient = useQueryClient();
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [date, setDate] = useState({
        from: null,
        to: null,
    });

    const {
        data: appointments,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["all-appointments", date],
        queryFn: async () => {
            const res = await getAllAppointments(date);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        // enabled: !!(date?.from && date?.to),
    });

    const {
        data: eventOptions,
        error: errorEvents,
        isLoading: isLoadingEvents,
    } = useQuery({
        queryKey: ["all-event-options"],
        queryFn: async () => {
            const res = await getAllEventOptions();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const {
        data: agencyOptions,
        error: errorAgency,
        isLoading: isLoadingAgency,
    } = useQuery({
        queryKey: ["all-agency-options"],
        queryFn: async () => {
            const res = await getAllAgencyOptions();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const isLoadingAny = isLoading || isLoadingEvents || isLoadingAgency;

    const filteredAppointments = useMemo(() => {
        if (selectedStatus === "All") {
            return appointments || [];
        }
        return (appointments || []).filter(
            (appointment) => appointment.status === selectedStatus
        );
    }, [appointments, selectedStatus]);

    if (isLoadingAny) return <DataTableSkeleton />;

    if (error)
        return <div className="alert alert-error">{JSON.stringify(error)}</div>;
    if (errorEvents)
        return (
            <div className="alert alert-error">
                {JSON.stringify(errorEvents)}
            </div>
        );
    if (errorAgency)
        return (
            <div className="alert alert-error">
                {JSON.stringify(errorAgency)}
            </div>
        );

    return (
        <div className="space-y-6">
            {/* Dashboard Stats */}
            <DashboardStats appointments={filteredAppointments} />

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

            {/* Main Content */}
            {appointments && appointments.length === 0 ? (
                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                    <Users2Icon className="w-12 h-12 mb-4 text-primary" />
                    <h2 className="text-xl font-semibold">
                        No appointments yet
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Booked appointments will appear here.
                    </p>
                </Card>
            ) : (
                <AppointmentTabs
                    appointments={filteredAppointments}
                    allAppointments={appointments}
                    eventOptions={eventOptions || []}
                    agencyOptions={agencyOptions || []}
                    isLoading={isLoadingAny}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                />
            )}
        </div>
    );
}
