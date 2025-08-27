"use client";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import LoadingModal from "@components/layout/LoadingModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { getApprovedEventsByAgency } from "@/action/donorAction";
import Skeleton_user from "@components/ui/Skeleton_user";
import AllEventCalendar from "@components/organizers/AllEventCalendar";
import moment from "moment";
import { getBookedAppointmentsByDonor } from "@/action/donorAppointmentAction";
import EventCardList from "@components/events/EventCardList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import WidgetEventCalendar from "@components/organizers/WidgetEventCalendar";
import { CalendarCheck, CalendarClock } from "lucide-react";

export default function BloodDriveEvents() {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "ongoing";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const queryClient = useQueryClient();
    const {
        data: events,
        isLoading: eventIsLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["upcoming_blood_drives"],
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

    const {
        data: donor_booked_appointments,
        isLoading: donorBookedAppointmentIsLoading,
        error: donorBookedAppointmentError,
        isError: donorBookedAppointmentIsError,
    } = useQuery({
        queryKey: ["donor_booked_appointments"],
        queryFn: async () => {
            const res = await getBookedAppointmentsByDonor();

            if (!res.success) {
                throw res?.message || "unknown error";
            }
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const onLoad = () => {
        setIsLoading(true);
    };

    const handleProcessedBooking = () => {
        setIsLoading(false);
        queryClient.invalidateQueries({
            queryKey: ["upcoming_blood_drives"],
        });
        queryClient.invalidateQueries({
            queryKey: ["donor_booked_appointments"],
        });
    };

    if (isError)
        return (
            <div className="alert alert-error">
                <pre>{JSON.stringify(error?.message || error, null, 2)}</pre>
                <pre>
                    {JSON.stringify(
                        donorBookedAppointmentError?.message ||
                            donorBookedAppointmentError,
                        null,
                        2
                    )}
                </pre>
            </div>
        );
    if (donorBookedAppointmentIsError)
        return (
            <div className="alert alert-error">
                <pre>
                    {JSON.stringify(
                        donorBookedAppointmentError?.message ||
                            donorBookedAppointmentError,
                        null,
                        2
                    )}
                </pre>
            </div>
        );

    if (eventIsLoading || donorBookedAppointmentIsLoading) {
        return <Skeleton_user />;
    }

    const ongoingEvents = events.filter(
        (event) => event.registration_status == "ongoing"
    );

    const upcomingEvents = events.filter(
        (event) => event.registration_status == "not started"
    );

    return (
        <div className="mb-5">
            <LoadingModal imgSrc="/loader_3.gif" isLoading={isLoading} />
            <Tabs
                defaultValue={currentTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="mt-4 bg-muted p-1 rounded-md flex flex-col md:flex-row">
                    <TabsTrigger
                        value="ongoing"
                        className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400 border"
                    >
                        <CalendarCheck />
                        Ongoing ({ongoingEvents.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="upcoming"
                        className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400 border"
                    >
                        <CalendarClock />
                        Upcoming ({upcomingEvents.length})
                    </TabsTrigger>
                </TabsList>

                {/* Ongoing Tab */}
                <TabsContent
                    value="ongoing"
                    className="mt-4 grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 xl:h-[calc(100vh-10rem)]"
                >
                    {/* Left: Event List */}
                    <div className="flex flex-col h-full border border-gray-300 rounded-lg p-3 md:p-4 overflow-hidden">
                        <div className="flex flex-wrap gap-2 items-center justify-between">
                            <h2 className="text-lg md:text-2xl font-extrabold">
                                Available Donation Drives
                            </h2>
                            <span className="font-semibold text-sm text-slate-500 dark:text-slate-300">
                                As of: {moment().format("MMMM DD, YYYY")}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 md:p-2">
                            <EventCardList
                                events={ongoingEvents}
                                booked_appointments={donor_booked_appointments.map(
                                    (app) => ({
                                        appointment_id: app.id,
                                        time_schedule_id: app.time_schedule_id,
                                        event_id: app.event_id,
                                    })
                                )}
                                onLoad={onLoad}
                                onFinish={handleProcessedBooking}
                                isRegistrationOpen={true}
                            />
                        </div>
                    </div>

                    {/* Right: Calendar */}
                    <div className="flex flex-col border border-gray-300 rounded-lg p-4 overflow-x-auto">
                        <h2 className="text-lg md:text-2xl font-extrabold mb-4">
                            Event Calendar
                        </h2>
                        <div className="flex-1 min-w-[500px] overflow-x-auto">
                            <WidgetEventCalendar />
                        </div>
                    </div>
                </TabsContent>

                {/* Upcoming Tab */}
                <TabsContent
                    value="upcoming"
                    className="mt-4 grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 xl:h-[calc(100vh-10rem)]"
                >
                    {/* Left: Event List */}
                    <div className="flex flex-col h-full border border-gray-300 rounded-lg p-3 md:p-4 overflow-hidden">
                        <div className="flex flex-wrap gap-2 items-center justify-between">
                            <h2 className="text-lg md:text-2xl font-extrabold">
                                Upcoming Donation Drives
                            </h2>
                            <span className="font-semibold text-sm text-slate-500 dark:text-slate-300">
                                {moment().format("MMMM DD, YYYY")}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 md:p-2">
                            <EventCardList
                                events={upcomingEvents}
                                booked_appointments={donor_booked_appointments.map(
                                    (appointnments) =>
                                        appointnments.time_schedule_id
                                )}
                                onLoad={onLoad}
                                onFinish={handleProcessedBooking}
                            />
                        </div>
                    </div>

                    {/* Right: Calendar */}
                    <div className="flex flex-col h-full border border-gray-300 rounded-lg p-3 md:p-4 overflow-x-auto">
                        <h2 className="text-lg md:text-2xl font-extrabold mb-4">
                            Event Calendar
                        </h2>
                        <div className="flex-1 min-w-[500px] overflow-x-auto">
                            <WidgetEventCalendar />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
