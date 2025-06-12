"use client";
import { DataTable } from "@components/reusable_components/Datatable";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { eventColumns } from "./eventColumns";
import { getAllEventsByAgency } from "@/action/hostEventAction";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import LoadingModal from "@components/layout/LoadingModal";

export default function ListofEvents() {
    const [isLoading, setIsLoading] = useState(false)
    const {
        data: events,
        isLoading: eventIsLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["agency_events"],
        queryFn: async () => {
            const res = await getAllEventsByAgency();

            if (!res.success) {
                throw res?.message || "unknown error";
            }
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    if (isError)
        return (
            <div className="alert alert-error">
                <pre>{JSON.stringify(error?.message || error, null, 2)}</pre>
            </div>
        );

    const columns = eventColumns(setIsLoading);

    return (
        <div>
            <LoadingModal imgSrc="/loader_3.gif" isLoading={isLoading} />
            <DataTable
                data={events || []}
                columns={columns}
                isLoading={eventIsLoading}
            />
        </div>
    );
}
