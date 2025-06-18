"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Users2Icon } from "lucide-react";
import Skeleton from "@components/ui/skeleton";
import { Card } from "@components/ui/card";
import {
    getAllAgencyOptions,
    getAllAppointments,
    getAllEventOptions,
} from "@/action/adminEventAction";
import { appointmentsColumns } from "./appointmentsColumns";
import { AppointmentDatatable } from "@components/admin/AppointmentDatatable";

export default function AppointmentList() {
    const queryClient = useQueryClient();

    const {
        data: appointments,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["all-appointments"],
        queryFn: async () => {
            const res = await getAllAppointments();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const {
        data: eventOptions,
        errorEvents,
        isLoadingEvents,
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
        errorAgency,
        isLoadingAgency,
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

    if (isLoading || isLoadingEvents || isLoadingAgency) return <Skeleton />;

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
        <div>
            {appointments.length === 0 ? (
                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 ">
                    <Users2Icon className="w-12 h-12 mb-4 text-primary" />
                    <h2 className="text-xl font-semibold">
                        No appointments yet
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Booked appointments will appear here.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="absolute right-10 top-[-40]">
                        <button
                            className="btn btn-circle btn-warning"
                            onClick={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["all-appointments"],
                                })
                            }
                        >
                            <RefreshCcw className="h-4" />
                        </button>
                    </div>
                    <AppointmentDatatable
                        columns={appointmentsColumns}
                        data={appointments}
                        isLoading={isLoading}
                        eventOptions={eventOptions}
                        agencyOptions={agencyOptions}
                    />
                </>
            )}
        </div>
    );
}
