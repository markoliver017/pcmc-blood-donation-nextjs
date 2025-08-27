"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { eventColumns } from "./eventColumns";
import {
    getAllAgencyOptions,
    getAllEvents,
    getEventsByStatus,
    getPresentEvents,
} from "@/action/adminEventAction";
import LoadingModal from "@components/layout/LoadingModal";

import { useRouter, useSearchParams } from "next/navigation";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import {
    Calendar,
    CalendarCheck,
    Check,
    Text,
    BarChart3,
    CreditCard,
    TableIcon,
} from "lucide-react";
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
import {
    Tabs as ViewModeTabs,
    TabsList as ViewModeTabsList,
    TabsTrigger as ViewModeTabsTrigger,
    TabsContent as ViewModeTabsContent,
} from "@components/ui/tabs";
import AdminEventCard from "@components/events/AdminEventCard";
import EventFilterBar from "@components/admin/events/EventFilterBar";
import { GiCard3Diamonds } from "react-icons/gi";

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

    // Add view mode state for each tab
    const [ongoingViewMode, setOngoingViewMode] = useState("card");
    const [upcomingViewMode, setUpcomingViewMode] = useState("card");
    const [allViewMode, setAllViewMode] = useState("card");

    // Add filter state for each tab
    const [ongoingFilters, setOngoingFilters] = useState({});
    const [upcomingFilters, setUpcomingFilters] = useState({});
    const [allFilters, setAllFilters] = useState({});
    const [forApprovalFilters, setForApprovalFilters] = useState({});

    // Status options for filter
    const statusOptions = [
        { value: "ongoing", label: "Ongoing" },
        { value: "not started", label: "Not Started" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        // { value: "for approval", label: "For Approval" },
    ];

    // Handler for card actions
    const handleViewDetails = (event) => {
        router.push(`/portal/admin/events/${event.id}`);
    };
    const handleEdit = (event) => {
        router.push(`/portal/admin/events/${event.id}/edit`);
    };

    // Filter function
    const filterEvents = (events, filters) => {
        if (!events || !filters) return events;

        return events.filter((event) => {
            // Search filter
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const searchableFields = [
                    event.title,
                    event.status,
                    event.agency?.name,
                    event.agency?.agency_address,
                    event.description,
                ].filter(Boolean);

                if (
                    !searchableFields.some((field) =>
                        field.toLowerCase().includes(searchTerm)
                    )
                ) {
                    return false;
                }
            }

            // Date range filter
            if (filters.dateRange?.from || filters.dateRange?.to) {
                const eventDate = new Date(event.date);
                if (
                    filters.dateRange.from &&
                    eventDate < new Date(filters.dateRange.from)
                ) {
                    return false;
                }
                if (
                    filters.dateRange.to &&
                    eventDate > new Date(filters.dateRange.to)
                ) {
                    return false;
                }
            }

            // Agency filter
            if (filters.agency_id && event.agency_id !== filters.agency_id) {
                return false;
            }

            return true;
        });
    };

    // Apply filters to events
    const ongoingEvents = useMemo(() => {
        if (!presentEvents) return;
        const filtered = presentEvents.filter(
            (event) => event?.registration_status === "ongoing"
        );
        return filterEvents(filtered, ongoingFilters);
    }, [presentEvents, ongoingFilters]);

    const upcomingEvents = useMemo(() => {
        if (!presentEvents) return;
        const filtered = presentEvents.filter(
            (event) => event?.registration_status === "not started"
        );
        return filterEvents(filtered, upcomingFilters);
    }, [presentEvents, upcomingFilters]);

    const allEvents = useMemo(() => {
        return filterEvents(events, allFilters);
    }, [events, allFilters]);

    const filteredForApprovalEvents = useMemo(() => {
        return filterEvents(forApprovalEvents, forApprovalFilters);
    }, [forApprovalEvents, forApprovalFilters]);

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
                <TabsList className="mt-4 p-1 rounded-md flex flex-col md:flex-row">
                    <TabsTrigger
                        value="dashboard"
                        className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600 border flex-1"
                    >
                        <div className="flex-items-center">
                            <BarChart3 className="h-4 w-4" />
                            Dashboard
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="ongoing"
                        className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600 border flex-1"
                    >
                        <div className="flex-items-center">
                            <Check className="h-4 w-4" />
                            Ongoing ({ongoingEvents?.length})
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="upcoming"
                        className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600 border flex-1"
                    >
                        <div className="flex-items-center">
                            <MdUpcoming />
                            Upcoming ({upcomingEvents?.length})
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-800 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600 border flex-1"
                    >
                        <div className="flex-items-center">
                            <Text className="h-4 w-4" />
                            All ({events?.length})
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="for-approval"
                        className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600 border flex-1"
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

                {/* Ongoing Tab Content */}
                <TabsContent value="ongoing">
                    <div className="flex justify-end mt-5">
                        <ViewModeTabs
                            value={ongoingViewMode}
                            onValueChange={setOngoingViewMode}
                            className="flex gap-2 bg-muted/60 p-1 rounded-full shadow-sm w-max mx-auto mb-3"
                        >
                            <ViewModeTabsList>
                                <ViewModeTabsTrigger
                                    value="card"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-purple-700 hover:bg-purple-100 focus-visible:ring-2 focus-visible:ring-purple-400"
                                >
                                    <CreditCard />
                                    <span className="hidden md:block">
                                        Card View
                                    </span>
                                </ViewModeTabsTrigger>
                                <ViewModeTabsTrigger
                                    value="table"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                                >
                                    <TableIcon />
                                    <span className="hidden md:block">
                                        Table View
                                    </span>
                                </ViewModeTabsTrigger>
                            </ViewModeTabsList>
                        </ViewModeTabs>
                    </div>
                    <EventFilterBar
                        onChange={setOngoingFilters}
                        defaultValues={ongoingFilters}
                        statusOptions={statusOptions}
                    />

                    {ongoingViewMode === "table" ? (
                        !ongoingEvents?.length ? (
                            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                                <Calendar className="w-12 h-12 mb-4 text-primary" />
                                <h2 className="text-xl font-semibold">
                                    {Object.keys(ongoingFilters).length > 0
                                        ? "No Events Match Your Filters"
                                        : "No Ongoing Events"}
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    {Object.keys(ongoingFilters).length > 0
                                        ? "Try adjusting your filters to see more results."
                                        : "You're all caught up! 🎉"}
                                </p>
                            </Card>
                        ) : (
                            <BloodDrivesDatatable
                                data={ongoingEvents || []}
                                columns={presentEventColumns(setModalIsLoading)}
                                isLoading={presentEventsLoading}
                                agencyOptions={agencyOptions || []}
                            />
                        )
                    ) : (
                        <div className="space-y-4">
                            {ongoingEvents?.length ? (
                                ongoingEvents.map((event) => (
                                    <AdminEventCard
                                        key={event.id}
                                        event={event}
                                        onView={handleViewDetails}
                                        onEdit={handleEdit}
                                        setIsLoading={setModalIsLoading}
                                    />
                                ))
                            ) : (
                                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                                    <Calendar className="w-12 h-12 mb-4 text-primary" />
                                    <h2 className="text-xl font-semibold">
                                        {Object.keys(ongoingFilters).length > 0
                                            ? "No Events Match Your Filters"
                                            : "No Ongoing Events"}
                                    </h2>
                                    <p className="text-gray-500 mt-2">
                                        {Object.keys(ongoingFilters).length > 0
                                            ? "Try adjusting your filters to see more results."
                                            : "You're all caught up! 🎉"}
                                    </p>
                                </Card>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* Repeat similar structure for Upcoming, All, For-Approval tabs */}
                <TabsContent value="upcoming">
                    <div className="flex justify-end mt-5">
                        <ViewModeTabs
                            value={upcomingViewMode}
                            onValueChange={setUpcomingViewMode}
                            className="flex gap-2 bg-muted/60 p-1 rounded-full shadow-sm w-max mx-auto mb-3"
                        >
                            <ViewModeTabsList>
                                <ViewModeTabsTrigger
                                    value="card"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-purple-700 hover:bg-purple-100 focus-visible:ring-2 focus-visible:ring-purple-400"
                                >
                                    <CreditCard />

                                    <span className="hidden md:block">
                                        Card View
                                    </span>
                                </ViewModeTabsTrigger>
                                <ViewModeTabsTrigger
                                    value="table"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                                >
                                    <TableIcon />
                                    <span className="hidden md:block">
                                        Table View
                                    </span>
                                </ViewModeTabsTrigger>
                            </ViewModeTabsList>
                        </ViewModeTabs>
                    </div>
                    <EventFilterBar
                        onChange={setUpcomingFilters}
                        defaultValues={upcomingFilters}
                        statusOptions={statusOptions}
                    />

                    {upcomingViewMode === "table" ? (
                        !upcomingEvents.length ? (
                            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                                <Calendar className="w-12 h-12 mb-4 text-primary" />
                                <h2 className="text-xl font-semibold">
                                    {Object.keys(upcomingFilters).length > 0
                                        ? "No Events Match Your Filters"
                                        : "No Upcoming Events"}
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    {Object.keys(upcomingFilters).length > 0
                                        ? "Try adjusting your filters to see more results."
                                        : "You're all caught up! 🎉"}
                                </p>
                            </Card>
                        ) : (
                            <BloodDrivesDatatable
                                data={upcomingEvents || []}
                                columns={presentEventColumns(setModalIsLoading)}
                                isLoading={presentEventsLoading}
                                agencyOptions={agencyOptions || []}
                            />
                        )
                    ) : (
                        <div className="space-y-4">
                            {upcomingEvents?.length ? (
                                upcomingEvents.map((event) => (
                                    <AdminEventCard
                                        key={event.id}
                                        event={event}
                                        onView={handleViewDetails}
                                        onEdit={handleEdit}
                                        setIsLoading={setModalIsLoading}
                                    />
                                ))
                            ) : (
                                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                                    <Calendar className="w-12 h-12 mb-4 text-primary" />
                                    <h2 className="text-xl font-semibold">
                                        {Object.keys(upcomingFilters).length > 0
                                            ? "No Events Match Your Filters"
                                            : "No Upcoming Events"}
                                    </h2>
                                    <p className="text-gray-500 mt-2">
                                        {Object.keys(upcomingFilters).length > 0
                                            ? "Try adjusting your filters to see more results."
                                            : "You're all caught up! 🎉"}
                                    </p>
                                </Card>
                            )}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="all">
                    <div className="flex justify-end mt-5">
                        <ViewModeTabs
                            value={allViewMode}
                            onValueChange={setAllViewMode}
                            className="flex gap-2 bg-muted/60 p-1 rounded-full shadow-sm w-max mx-auto mb-3"
                        >
                            <ViewModeTabsList>
                                <ViewModeTabsTrigger
                                    value="card"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-purple-700 hover:bg-purple-100 focus-visible:ring-2 focus-visible:ring-purple-400"
                                >
                                    <CreditCard />
                                    <span className="hidden md:block">
                                        Card View
                                    </span>
                                </ViewModeTabsTrigger>
                                <ViewModeTabsTrigger
                                    value="table"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                                >
                                    <TableIcon />
                                    <span className="hidden md:block">
                                        Table View
                                    </span>
                                </ViewModeTabsTrigger>
                            </ViewModeTabsList>
                        </ViewModeTabs>
                    </div>
                    <EventFilterBar
                        onChange={setAllFilters}
                        defaultValues={allFilters}
                        statusOptions={statusOptions}
                    />
                    {allViewMode === "table" ? (
                        !allEvents?.length ? (
                            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                                <Calendar className="w-12 h-12 mb-4 text-primary" />
                                <h2 className="text-xl font-semibold">
                                    {Object.keys(allFilters).length > 0
                                        ? "No Events Match Your Filters"
                                        : "No Events Found"}
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    {Object.keys(allFilters).length > 0
                                        ? "Try adjusting your filters to see more results."
                                        : "No events found in the database."}
                                </p>
                            </Card>
                        ) : (
                            <BloodDrivesDatatable
                                data={allEvents || []}
                                columns={eventColumns(setModalIsLoading)}
                                isLoading={isLoading}
                                agencyOptions={agencyOptions || []}
                            />
                        )
                    ) : (
                        <div className="space-y-4">
                            {allEvents?.length ? (
                                allEvents.map((event) => (
                                    <AdminEventCard
                                        key={event.id}
                                        event={event}
                                        onView={handleViewDetails}
                                        onEdit={handleEdit}
                                        setIsLoading={setModalIsLoading}
                                    />
                                ))
                            ) : (
                                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                                    <Calendar className="w-12 h-12 mb-4 text-primary" />
                                    <h2 className="text-xl font-semibold">
                                        {Object.keys(allFilters).length > 0
                                            ? "No Events Match Your Filters"
                                            : "No Events Found"}
                                    </h2>
                                    <p className="text-gray-500 mt-2">
                                        {Object.keys(allFilters).length > 0
                                            ? "Try adjusting your filters to see more results."
                                            : "No events found in the database."}
                                    </p>
                                </Card>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="for-approval">
                    <EventFilterBar
                        onChange={setForApprovalFilters}
                        statusOptions={statusOptions}
                        defaultValues={forApprovalFilters}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                        <ForApprovalEventList
                            events={filteredForApprovalEvents}
                            eventsIsFetching={eventsIsFetching}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
