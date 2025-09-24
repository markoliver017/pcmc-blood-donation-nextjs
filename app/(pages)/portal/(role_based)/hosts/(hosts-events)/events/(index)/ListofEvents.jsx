"use client";
import { DataTable } from "@components/reusable_components/Datatable";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { eventColumns } from "./eventColumns";
import {
    getAllEventsByAgency,
    getForApprovalEventsByAgency,
    getPresentEventsByAgency,
    getEventsByRegistrationStatus,
} from "@/action/hostEventAction";
import {
    CalendarCheck,
    Check,
    FileClock,
    Text,
    BarChart3,
    CreditCard,
    TableIcon,
    Calendar,
} from "lucide-react";
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
import { MdBloodtype, MdUpcoming } from "react-icons/md";
import { Card } from "@components/ui/card";
import clsx from "clsx";
import EventsDashboard from "@components/hosts/events/EventsDashboard";
import {
    Tabs as ViewModeTabs,
    TabsList as ViewModeTabsList,
    TabsTrigger as ViewModeTabsTrigger,
    TabsContent as ViewModeTabsContent,
} from "@components/ui/tabs";
import AgencyEventCard from "@components/hosts/events/AgencyEventCard";
import EventFilterBar from "@components/hosts/events/EventFilterBar";

export default function ListofEvents() {
    const router = useRouter();
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "dashboard";

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

    const {
        data: presentEvents,
        isLoading: presentEventsLoading,
        error: presentEventsError,
        isError: presentEventsIsError,
    } = useQuery({
        queryKey: ["present_events"],
        queryFn: async () => {
            const res = await getPresentEventsByAgency();

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
        { value: "closed", label: "Closed" },
    ];

    // Handler for card actions
    const handleViewDetails = (event) => {
        router.push(`/portal/hosts/events/${event.id}`);
    };
    const handleEdit = (event) => {
        router.push(`/portal/hosts/events/${event.id}/edit`);
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

            // Registration status filter
            if (
                filters.registration_status !== "All" &&
                filters.registration_status &&
                event.registration_status !== filters.registration_status
            ) {
                return false;
            }

            return true;
        });
    };

    // Apply filters to events
    const ongoingEvents = useMemo(() => {
        if (!presentEvents) return [];
        const filtered = presentEvents.filter(
            (event) => event?.registration_status === "ongoing"
        );
        return filterEvents(filtered, ongoingFilters);
    }, [presentEvents, ongoingFilters]);

    const upcomingEvents = useMemo(() => {
        if (!presentEvents) return [];
        const filtered = presentEvents.filter(
            (event) => event?.registration_status === "not started"
        );
        return filterEvents(filtered, upcomingFilters);
    }, [presentEvents, upcomingFilters]);

    const allEvents = useMemo(() => {
        return filterEvents(events, allFilters);
    }, [events, allFilters]);

    const filteredForApprovalEvents = useMemo(() => {
        return filterEvents(eventsForApproval, forApprovalFilters);
    }, [eventsForApproval, forApprovalFilters]);

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

    if (eventIsLoading || presentEventsLoading || eventsIsFetching) {
        return <Skeleton />;
    }

    const columns = eventColumns(setModalIsLoading);
    const approvedEvents =
        events.filter((event) => event.status === "approved") || [];
    const otherEvents =
        events.filter((event) => event.status !== "approved") || [];

    return (
        <div className="mb-5">
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
            <LoadingModal imgSrc="/loader_3.gif" isLoading={modalIsLoading} />

            <Tabs
                defaultValue={currentTab}
                onValueChange={handleTabChange}
                className="mt-5 px-2 sm:px-5 relative"
            >
                <TabsList className="mt-4 bg-muted p-1 rounded-md w-max">
                    <TabsTrigger
                        value="dashboard"
                        className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline-block">
                                Dashboard
                            </span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="ongoing"
                        className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <Check className="h-4 w-4" />
                            <span className="hidden sm:inline-block">
                                Ongoing ({ongoingEvents?.length || 0})
                            </span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="upcoming"
                        className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <MdUpcoming />
                            <span className="hidden sm:inline-block">
                                Upcoming ({upcomingEvents?.length || 0})
                            </span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-800 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <Text className="h-4 w-4" />
                            <span className="hidden sm:inline-block">
                                All ({events?.length || 0})
                            </span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="for-approval"
                        className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                    >
                        <div className="flex-items-center">
                            <QuestionMarkCircledIcon />
                            <span className="hidden sm:inline-block">
                                For Approval ({eventsForApproval?.length || 0})
                            </span>
                        </div>
                    </TabsTrigger>
                </TabsList>
                {/* <Link
                    href="/portal/hosts/events/create"
                    className={clsx(
                        "btn absolute right-5 bg-gradient-to-b from-red-700 to-red-500 text-white text-lg md:text-xl font-bold md:px-4 md:py-6 rounded-md shadow-[7px_5px_2px_0px_rgba(0,_0,_0,_0.3)] dark:shadow-red-400/60 hover:from-pink-500 hover:to-purple-400 hover:ring transition duration-300",
                        approvedEvents.length === 0 && "hidden"
                    )}
                >
                    <MdBloodtype className="h-6 w-6" />
                    <span>New Blood Drive</span>
                </Link> */}

                <TabsContent value="dashboard">
                    <EventsDashboard />
                </TabsContent>

                {/* Ongoing Tab Content */}
                <TabsContent value="ongoing">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Ongoing Events
                            </h1>
                            <p className="text-muted-foreground">
                                List of ongoing events
                            </p>
                        </div>
                    </div>
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
                                    Card{" "}
                                    <span className="hidden sm:inline-block">
                                        View
                                    </span>
                                </ViewModeTabsTrigger>
                                <ViewModeTabsTrigger
                                    value="table"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                                >
                                    <TableIcon />
                                    Table
                                    <span className="hidden sm:inline-block">
                                        View
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
                            <DataTable
                                data={ongoingEvents || []}
                                columns={columns}
                                isLoading={presentEventsLoading}
                            />
                        )
                    ) : (
                        <div className="space-y-4">
                            {ongoingEvents?.length ? (
                                ongoingEvents.map((event) => (
                                    <AgencyEventCard
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

                {/* Upcoming Tab Content */}
                <TabsContent value="upcoming">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Upcoming Events
                            </h1>
                            <p className="text-muted-foreground">
                                List of upcoming events
                            </p>
                        </div>
                    </div>
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
                                    Card
                                    <span className="hidden sm:inline-block">
                                        View
                                    </span>
                                </ViewModeTabsTrigger>
                                <ViewModeTabsTrigger
                                    value="table"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                                >
                                    <TableIcon />
                                    Table
                                    <span className="hidden sm:inline-block">
                                        View
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
                        !upcomingEvents?.length ? (
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
                            <DataTable
                                data={upcomingEvents || []}
                                columns={columns}
                                isLoading={presentEventsLoading}
                            />
                        )
                    ) : (
                        <div className="space-y-4">
                            {upcomingEvents?.length ? (
                                upcomingEvents.map((event) => (
                                    <AgencyEventCard
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

                {/* All Tab Content */}
                <TabsContent value="all">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                All Events
                            </h1>
                            <p className="text-muted-foreground">
                                List of all events
                            </p>
                        </div>
                    </div>
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
                                    Card
                                    <span className="hidden sm:inline-block">
                                        View
                                    </span>
                                </ViewModeTabsTrigger>
                                <ViewModeTabsTrigger
                                    value="table"
                                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                                >
                                    <TableIcon />
                                    Table
                                    <span className="hidden sm:inline-block">
                                        View
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
                                        : "Get started and book a drive today! 🎉"}
                                </p>
                                {!allEvents?.length && (
                                    <div className="mt-3">
                                        <Link
                                            className="btn bg-gradient-to-b from-red-700 to-red-500 text-white hover:from-pink-500 hover:to-purple-400 hover:ring transition duration-300"
                                            href="/portal/hosts/events/create"
                                        >
                                            <MdBloodtype className="h-4 w-4" />
                                            Create New Blood Drive
                                        </Link>
                                    </div>
                                )}
                            </Card>
                        ) : (
                            <DataTable
                                data={allEvents || []}
                                columns={columns}
                                isLoading={eventIsLoading}
                            />
                        )
                    ) : (
                        <div className="space-y-4">
                            {allEvents?.length ? (
                                allEvents.map((event) => (
                                    <AgencyEventCard
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
                                            : "Get started and book a drive today! 🎉"}
                                    </p>
                                    {!allEvents?.length && (
                                        <div className="mt-3">
                                            <Link
                                                className="btn bg-gradient-to-b from-red-700 to-red-500 text-white hover:from-pink-500 hover:to-purple-400 hover:ring transition duration-300"
                                                href="/portal/hosts/events/create"
                                            >
                                                <MdBloodtype className="h-4 w-4" />
                                                Create New Blood Drive
                                            </Link>
                                        </div>
                                    )}
                                </Card>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* For Approval Tab Content */}
                <TabsContent value="for-approval">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                For Approval Events
                            </h1>
                            <p className="text-muted-foreground">
                                List of for approval events
                            </p>
                        </div>
                    </div>
                    <EventFilterBar
                        onChange={setForApprovalFilters}
                        defaultValues={forApprovalFilters}
                        statusOptions={statusOptions}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
                        <ForApprovalEventList
                            events={filteredForApprovalEvents}
                            isFetching={eventsIsFetching}
                            avatarClassName="md:w-[150px] md:h-[150px]"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
