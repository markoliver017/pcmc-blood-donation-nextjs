"use client";
import AllEventCalendar from "@components/organizers/AllEventCalendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { CalendarCheck2, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import ForApprovalDonorList from "./(hosts-donors)/donors/@approval/ForApprovalDonorList";
import { FaArrowRight } from "react-icons/fa";
import ForApprovalEventList from "./(hosts-events)/events/(index)/ForApprovalEventList";
import { useQuery } from "@tanstack/react-query";
import {
    getHostDonorsByStatus,
    getVerifiedDonorsCount,
} from "@/action/hostDonorAction";
import {
    getAllEventsCount,
    getForApprovalEventsByAgency,
} from "@/action/hostEventAction";
import ScrollableContainer from "@components/reusable_components/ScrollableContainer";

export default function Dashboard() {
    const { data: donors_count, isLoading: donorsCountIsLoading } = useQuery({
        queryKey: ["agency-donors-count"],
        queryFn: async () => {
            const res = await getVerifiedDonorsCount();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });
    const { data: donorsForApproval, isLoading: donorsIsFetching } = useQuery({
        queryKey: ["donors", "for approval"],
        queryFn: async () => getHostDonorsByStatus("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });

    const { data: events_count, isLoading: eventsCountIsLoading } = useQuery({
        queryKey: ["agency-events-count"],
        queryFn: async () => {
            const res = await getAllEventsCount();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });
    const { data: eventsForApproval, isLoading: eventsIsFetching } = useQuery({
        queryKey: ["agency_events", "for approval"],
        queryFn: async () => getForApprovalEventsByAgency("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });

    return (
        <div className="space-y-2 md:space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                <Card className="w-full">
                    <CardHeader className="py-1 md:py-5 flex flex-col items-center gap-2">
                        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                            <Users className="w-4 h-4 md:w-6 md:h-6" />
                            Registered Donors
                        </CardTitle>
                        <CardDescription>
                            View all verified donors
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex md:pt-0 flex-col items-center gap-4">
                        <h2 className="text-2xl md:text-4xl font-bold">
                            {donorsCountIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>{donors_count}</span>
                            )}
                        </h2>
                        <Link
                            className="btn btn-sm md:btn-md btn-primary btn-outline"
                            href="/portal/hosts/donors"
                        >
                            View List
                        </Link>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="py-1 md:py-5 flex flex-col items-center gap-2">
                        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                            <CalendarCheck2 className="w-4 h-4 md:w-6 md:h-6" />
                            Blood Drives
                        </CardTitle>
                        <CardDescription>
                            Track blood drive events
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex md:pt-0 flex-col items-center gap-4">
                        <h2 className="text-2xl md:text-4xl font-bold">
                            {eventsCountIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>{events_count}</span>
                            )}
                        </h2>
                        <Link
                            className="btn btn-sm md:btn-md btn-primary btn-outline"
                            href="/portal/hosts/events"
                        >
                            View List
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <Card className="w-full h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">
                                Event Calendar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <AllEventCalendar />
                        </CardContent>
                    </Card>
                </div>

                {/* Action Panel */}
                <div className="w-full">
                    <Card className="min-h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">
                                Action Needed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Link
                                    href="/portal/hosts/donors?tab=for-approval"
                                    className="btn btn-block justify-between rounded-2xl text-green-700 dark:text-green-400"
                                >
                                    Donors For Approval (
                                    {donorsForApproval?.length || 0})
                                    <FaArrowRight />
                                </Link>
                                <ScrollableContainer
                                    maxHeight="40rem"
                                    className="mt-2 space-y-2 p-2"
                                >
                                    <ForApprovalDonorList
                                        donors={donorsForApproval}
                                        isFetching={donorsIsFetching}
                                    />
                                </ScrollableContainer>
                            </div>
                            <div className="divider" />
                            <div>
                                <Link
                                    href="/portal/hosts/events?tab=for-approval"
                                    className="btn btn-block justify-between rounded-2xl text-orange-700 dark:text-orange-400"
                                >
                                    <span className="text-xs md:text-sm">
                                        Donation Drives Awaiting Approval (
                                        {eventsForApproval?.length || 0})
                                    </span>
                                    <FaArrowRight />
                                </Link>
                                <ScrollableContainer
                                    maxHeight="40rem"
                                    className="mt-2 p-2 flex flex-col gap-4"
                                >
                                    <ForApprovalEventList
                                        events={eventsForApproval}
                                        isFetching={eventsIsFetching}
                                        editable={false}
                                    />
                                </ScrollableContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
