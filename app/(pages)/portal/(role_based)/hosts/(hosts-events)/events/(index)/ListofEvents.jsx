"use client";
import { DataTable } from "@components/reusable_components/Datatable";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { eventColumns } from "./eventColumns";
import {
    getAllEventsByAgency,
    getForApprovalEventsByAgency,
} from "@/action/hostEventAction";
import { CalendarCheck, CalendarPlus, Check, FileClock } from "lucide-react";
import Link from "next/link";
import LoadingModal from "@components/layout/LoadingModal";
import { useRouter, useSearchParams } from "next/navigation";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import ForApprovalEventList from "./ForApprovalEventList";
import Skeleton from "@components/ui/skeleton";
import {
    ExclamationTriangleIcon,
    QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { MdBloodtype } from "react-icons/md";
import { Card } from "@components/ui/card";
import clsx from "clsx";

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
                className="mt-5 px-2 sm:px-5 relative"
            >
                <Link
                    href="/portal/hosts/events/create"
                    className={clsx(
                        "btn absolute right-5 bg-gradient-to-b from-red-700 to-red-500 text-white text-2xl font-bold px-4 py-6 rounded-md shadow-[7px_10px_2px_0px_rgba(0,_0,_0,_0.3)] dark:shadow-red-400/60 hover:from-pink-500 hover:to-purple-400 hover:ring transition duration-300",
                        approvedEvents.length === 0 && "hidden"
                    )}
                >
                    <MdBloodtype className="h-6 w-6" />
                    <span className="hidden sm:inline-block">
                        Create New Blood Drive
                    </span>
                </Link>

                <TabsList className="mt-4 bg-muted p-1 rounded-md w-max">
                    <TabsTrigger
                        value="approved"
                        className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <Check className="h-4 w-4" /> Approved (
                            {approvedEvents?.length || 0})
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="for-approval"
                        className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <QuestionMarkCircledIcon /> For Approval (
                            {eventsForApproval?.length || 0})
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="others"
                        className="data-[state=active]:bg-red-300 data-[state=active]:text-red-800 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <ExclamationTriangleIcon /> Others (
                            {otherEvents?.length || 0})
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="approved" className="mt-6">
                    {!approvedEvents || approvedEvents.length === 0 ? (
                        <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                            <FileClock className="w-12 h-12 mb-4 text-primary" />
                            <h2 className="text-xl font-semibold">
                                No approved blood drives to show.
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Get started and book a drive today! 🎉
                            </p>
                            <div className="mt-3">
                                <Link
                                    className="btn  bg-gradient-to-b from-red-700 to-red-500 text-white hover:from-pink-500 hover:to-purple-400 hover:ring transition duration-300"
                                    href="/portal/hosts/events/create"
                                >
                                    <MdBloodtype className="h-4 w-4" />
                                    Create New Blood Drive
                                </Link>
                            </div>
                        </Card>
                    ) : (
                        <DataTable
                            data={approvedEvents}
                            columns={columns}
                            isLoading={eventIsLoading}
                        />
                    )}
                </TabsContent>

                <TabsContent value="others" className="mt-6">
                    {!otherEvents || otherEvents.length === 0 ? (
                        <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                            <FileClock className="w-12 h-12 mb-4 text-primary" />
                            <h2 className="text-xl font-semibold">
                                No rejected or cancelled blood drives to show.
                            </h2>
                            <p className="text-gray-500 mt-2">
                                All clear! No cancelled blood drives here. 🎉
                            </p>
                        </Card>
                    ) : (
                        <DataTable
                            data={otherEvents}
                            columns={columns}
                            isLoading={eventIsLoading}
                        />
                    )}
                </TabsContent>

                <TabsContent value="for-approval" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
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
