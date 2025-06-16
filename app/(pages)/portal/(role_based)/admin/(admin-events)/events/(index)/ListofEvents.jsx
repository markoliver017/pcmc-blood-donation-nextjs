"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { eventColumns } from "./eventColumns";
import { getAllEvents } from "@/action/adminEventAction";
import LoadingModal from "@components/layout/LoadingModal";
import { DataTable } from "@components/events/Datatable";

export default function ListofEvents() {
    const [modalIsLoading, setModalIsLoading] = useState(false);
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
            <LoadingModal imgSrc="/loader_3.gif" isLoading={modalIsLoading} />
            <DataTable
                data={events || []}
                columns={eventColumns(setModalIsLoading)}
                isLoading={isLoading}
            />
        </div>
    );
}
