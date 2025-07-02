"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { eventColumns } from "./eventColumns";
import {
    getAllAgencyOptions,
    getAllEvents,
    getEventsByStatus,
    getPresentEvents,
} from "@/action/adminEventAction";
import LoadingModal from "@components/layout/LoadingModal";
import { DataTable } from "@components/events/Datatable";

import { useRouter, useSearchParams } from "next/navigation";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Calendar, CalendarCheck, Check, Text, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import ForApprovalEventList from "./ForApprovalEventList";
import Skeleton from "@components/ui/skeleton";
import { BloodDrivesDatatable } from "@components/admin/events/BloodDrivesDatatable";
import { presentEventColumns } from "./presentEventColumns";
import {
    ExclamationTriangleIcon,
    QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { MdUpcoming } from "react-icons/md";
import { Card } from "@components/ui/card";
import EventsDashboard from "@components/admin/events/EventsDashboard";

export default function ListofEvents() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "dashboard";

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

    const {
        data: presentEvents,
        isLoading: presentEventsLoading,
        error: presentEventsError,
        isError: presentEventsIsError,
    } = useQuery({
        queryKey: ["present_events"],
        queryFn: async () => {
            const res = await getPresentEvents();

            if (!res.success) {
                throw res?.message || "unknown error";
            }
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const {
        data: agencyOptions,
        error: errorAgency,
        isError: isErrorAgency,
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

    const { data: forApprovalEvents, isLoading: eventsIsFetching } = useQuery({
        queryKey: ["all_events", "for approval"],
        queryFn: async () => getEventsByStatus("for approval"),
        staleTime: 0,
    });

    if (isError)
        return (
            <div className="alert alert-error">
                <pre>{JSON.stringify(error?.message || error, null, 2)}</pre>
            </div>
        );

    if (presentEventsIsError)
        return (
            <div className="alert alert-error">
                <pre>
                    {JSON.stringify(
                        presentEventsError?.message || presentEventsError,
                        null,
                        2
                    )}
                </pre>
            </div>
        );

    if (isErrorAgency)
        return (
            <div className="alert alert-error">
                <pre>
                    {JSON.stringify(
                        errorAgency?.message || errorAgency,
                        null,
                        2
                    )}
                </pre>
            </div>
        );

    if (isLoading || presentEventsLoading || isLoadingAgency)
        return <Skeleton />;

    const ongoingEvents = presentEvents.filter(
        (event) => event?.registration_status === "ongoing"
    );

    const upcomingEvents = presentEvents.filter(
        (event) => event?.registration_status === "not started"
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
                className="mt-5 px-2 sm:px-5 mb-5 relative"
            >
                <TabsList className="mt-4 bg-muted p-1 rounded-md w-max">
                    <TabsTrigger
                        value="dashboard"
                        className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <BarChart3 className="h-4 w-4" />
                            Dashboard
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="ongoing"
                        className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <Check className="h-4 w-4" />
                            Ongoing ({ongoingEvents?.length})
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="upcoming"
                        className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <MdUpcoming />
                            Upcoming ({upcomingEvents?.length})
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-800 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <Text className="h-4 w-4" />
                            All ({events?.length})
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="for-approval"
                        className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <QuestionMarkCircledIcon />
                            For Approval (
                            {!eventsIsFetching
                                ? forApprovalEvents?.length || 0
                                : 0}
                            )
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                    <EventsDashboard />
                </TabsContent>

                <TabsContent value="ongoing">
                    {!ongoingEvents?.length ? (
                        <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                            <Calendar className="w-12 h-12 mb-4 text-primary" />
                            <h2 className="text-xl font-semibold">
                                No Ongoing Events
                            </h2>
                            <p className="text-gray-500 mt-2">
                                You're all caught up! 🎉
                            </p>
                        </Card>
                    ) : (
                        <BloodDrivesDatatable
                            data={ongoingEvents || []}
                            columns={presentEventColumns(setModalIsLoading)}
                            isLoading={presentEventsLoading}
                            agencyOptions={agencyOptions || []}
                        />
                    )}
                </TabsContent>
                <TabsContent value="upcoming">
                    {!upcomingEvents.length ? (
                        <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                            <Calendar className="w-12 h-12 mb-4 text-primary" />
                            <h2 className="text-xl font-semibold">
                                No Upcoming Events
                            </h2>
                            <p className="text-gray-500 mt-2">
                                You're all caught up! 🎉
                            </p>
                        </Card>
                    ) : (
                        <BloodDrivesDatatable
                            data={upcomingEvents || []}
                            columns={presentEventColumns(setModalIsLoading)}
                            isLoading={presentEventsLoading}
                            agencyOptions={agencyOptions || []}
                        />
                    )}
                </TabsContent>
                <TabsContent value="all">
                    <BloodDrivesDatatable
                        data={events || []}
                        columns={eventColumns(setModalIsLoading)}
                        isLoading={isLoading}
                        agencyOptions={agencyOptions || []}
                    />
                </TabsContent>

                <TabsContent value="for-approval">
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                        <ForApprovalEventList
                            events={forApprovalEvents}
                            eventsIsFetching={eventsIsFetching}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
