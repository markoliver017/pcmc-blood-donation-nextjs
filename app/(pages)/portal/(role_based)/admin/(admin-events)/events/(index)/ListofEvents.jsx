"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { eventColumns } from "./eventColumns";
import { getAllEvents } from "@/action/adminEventAction";
import LoadingModal from "@components/layout/LoadingModal";
import { DataTable } from "@components/events/Datatable";
import { useSession } from "next-auth/react";

import { useRouter, useSearchParams } from "next/navigation";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { CalendarCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import ForApprovalEventList from "./ForApprovalEventList";

export default function ListofEvents() {
    const session = useSession();

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "all";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };
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
        <>
            <WrapperHeadMain
                icon={<CalendarCheck />}
                pageTitle="Blood Drives"
                breadcrumbs={[
                    {
                        path: "/portal/admin/events",
                        icon: <CalendarCheck className="w-4" />,
                        title: "Blood Drives",
                    },
                ]}
            />
            <LoadingModal imgSrc="/loader_3.gif" isLoading={modalIsLoading} />
            <Tabs
                defaultValue={currentTab}
                onValueChange={handleTabChange}
                className="px-1 md:px-5 mt-2"
            >
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="for-approval">For Approval</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <DataTable
                        data={events || []}
                        columns={eventColumns(setModalIsLoading)}
                        isLoading={isLoading}
                    />
                </TabsContent>
                <TabsContent value="for-approval">
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                        <ForApprovalEventList />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
