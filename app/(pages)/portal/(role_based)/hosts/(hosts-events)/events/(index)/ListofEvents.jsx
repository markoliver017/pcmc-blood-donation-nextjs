"use client";
import { DataTable } from "@components/reusable_components/Datatable";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { eventColumns } from "./eventColumns";
import {
    getAllEventsByAgency,
    getForApprovalEventsByAgency,
} from "@/action/hostEventAction";
import { CalendarCheck, CalendarPlus } from "lucide-react";
import Link from "next/link";
import LoadingModal from "@components/layout/LoadingModal";
import { useRouter, useSearchParams } from "next/navigation";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import ForApprovalEventList from "./ForApprovalEventList";
import Skeleton from "@components/ui/skeleton";

export default function ListofEvents() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "approved";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };
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

    const { data: eventsForApproval, isLoading: eventsIsFetching } = useQuery({
        queryKey: ["agency_events", "for approval"],
        queryFn: async () => getForApprovalEventsByAgency("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });

    if (isError)
        return (
            <div className="alert alert-error">
                <pre>{JSON.stringify(error?.message || error, null, 2)}</pre>
            </div>
        );

    if (eventIsLoading || eventsIsFetching) {
        return <Skeleton />;
    }

    const columns = eventColumns(setIsLoading);
    const approvedEvents =
        events.filter((event) => event.status === "approved") || [];
    const otherEvents =
        events.filter((event) => event.status !== "approved") || [];

    return (
        <div>
            <WrapperHeadMain
                icon={<CalendarCheck />}
                pageTitle="Blood Drives"
                breadcrumbs={[
                    {
                        path: "/portal/hosts/events",
                        icon: <CalendarCheck className="w-4" />,
                        title: "Blood Drives",
                    },
                ]}
            />
            <LoadingModal imgSrc="/loader_3.gif" isLoading={isLoading} />

            <Tabs
                defaultValue={currentTab}
                onValueChange={handleTabChange}
                className="px-1 md:px-5 mt-5"
                position="end"
            >
                <div className="flex flex-wrap justify-between px-2">
                    <Link
                        href="/portal/hosts/events/create"
                        className="btn btn-neutral mb-4 btn-block sm:btn-wide"
                    >
                        <CalendarPlus />
                        <span>Add New Event</span>
                    </Link>
                    <TabsList>
                        <TabsTrigger value="approved">
                            <span className="text-green-600 text-lg font-semibold ">
                                Approved ({approvedEvents?.length || 0})
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="for-approval">
                            <span className="text-warning text-lg font-semibold ">
                                For Approval ({eventsForApproval?.length || 0})
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="others">
                            <span className="text-lg font-semibold px-5">
                                Others ({otherEvents?.length || 0})
                            </span>
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="approved">
                    <DataTable
                        data={approvedEvents}
                        columns={columns}
                        isLoading={eventIsLoading}
                    />
                </TabsContent>
                <TabsContent value="others">
                    <DataTable
                        data={otherEvents}
                        columns={columns}
                        isLoading={eventIsLoading}
                    />
                </TabsContent>
                <TabsContent value="for-approval">
                    <h1 className="text-2xl font-bold">
                        For Approval ({eventsForApproval?.length || 0})
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                        <ForApprovalEventList
                            events={eventsForApproval}
                            isFetching={eventsIsFetching}
                            avatarClassName="md:w-[150px] md:h-[150px]"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
