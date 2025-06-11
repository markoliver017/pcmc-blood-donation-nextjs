"use client";
import { DataTable } from "@components/reusable_components/Datatable";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { eventColumns } from "./eventColumns";
import { getAllEvents } from "@/action/adminEventAction";

export default function ListofEvents() {
    const {
        data: events,
        isLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["all_events"],
        queryFn: async () => {
            const res = await getAllEvents();

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
