"use client";
import { DataTable } from "@components/reusable_components/Datatable";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { eventColumns } from "./eventColumns";
import { getAllEventsByAgency } from "@/action/hostEventAction";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

export default function ListofEvents() {
    const {
        data: events,
        isLoading,
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

    return (
        <div className="w-full p-4">
            <DataTable
                data={events || []}
                columns={eventColumns}
                isLoading={isLoading}
            />
        </div>
    );
}
