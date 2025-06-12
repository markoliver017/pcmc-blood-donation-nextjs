"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import LoadingModal from "@components/layout/LoadingModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { getApprovedEventsByAgency } from "@/action/donorAction";
import Skeleton_user from "@components/ui/Skeleton_user";
import EventCardList from "./EventCardList";
import AllEventCalendar from "@components/organizers/AllEventCalendar";

export default function BloodDriveEvents() {
    const [isLoading, setIsLoading] = useState(false)
    const {
        data: events,
        isLoading: eventIsLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["blood_drives"],
        queryFn: async () => {
            const res = await getApprovedEventsByAgency();

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

    if (eventIsLoading) {
        return <Skeleton_user />
    }

    return (
        <div>
            <LoadingModal imgSrc="/loader_3.gif" isLoading={isLoading} />
            <Tabs defaultValue="ongoing" className="w-full">
                <TabsList>
                    <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                </TabsList>

                {/* Ongoing Tab */}
                <TabsContent
                    value="ongoing"
                    className="mt-4 grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 xl:h-[calc(100vh-10rem)]"
                >
                    {/* Left: Event List */}
                    <div className="flex flex-col h-full border border-gray-300 rounded-lg p-4 overflow-hidden">
                        <h2 className="text-2xl font-semibold mb-4">Available Donation Drives</h2>
                        <div className="flex-1 overflow-y-auto space-y-4 p-2">
                            <EventCardList events={events} />
                        </div>
                    </div>

                    {/* Right: Calendar */}
                    <div className="flex flex-col h-full border border-gray-300 rounded-lg p-4 overflow-hidden">
                        <h2 className="text-2xl font-semibold mb-4">Event Calendar</h2>
                        <div className="flex-1 overflow-auto">
                            <AllEventCalendar />
                        </div>
                    </div>
                </TabsContent>

                {/* Upcoming Tab */}
                <TabsContent value="upcoming" className="mt-4">
                    <div className="border border-gray-300 rounded-lg p-4">
                        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
                        {/* Add content here */}
                    </div>
                </TabsContent>
            </Tabs>


        </div>
    );
}
