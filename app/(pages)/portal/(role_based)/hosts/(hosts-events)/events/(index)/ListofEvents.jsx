"use client";
import { DataTable } from "@components/reusable_components/Datatable";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { eventColumns } from "./eventColumns";
import { getAllEventsByAgency } from "@/action/eventAction";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

export default function ListofEvents() {
    const { data: events, isLoading } = useQuery({
        queryKey: ["agency_events"],
        queryFn: getAllEventsByAgency,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    return (
        <div className="w-full p-4">
            <Link
                href="/portal/hosts/events/create"
                className="btn btn-neutral mb-4"
            >
                <CalendarPlus /> Add New Event{" "}
            </Link>
            <h1 className="text-2xl font-semibold">List of Events</h1>
            <DataTable
                data={events || []}
                columns={eventColumns}
                isLoading={isLoading}
            />
        </div>
    );
}
