"use client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@components/ui/card";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import moment from "moment";
import parse from "html-react-parser";
import Link from "next/link";
import {
    Eye,
    Users,
    CheckIcon,
    XIcon,
    CalendarCog,
    MoreHorizontal,
    Command,
    Calendar,
} from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { GiClosedDoors, GiOpenBook } from "react-icons/gi";
import VerifyEvent from "@components/events/VerifyEvent";
import RejectEvent from "@components/events/RejectEvent";
import EventRegistrationStatus from "@components/organizers/EventRegistrationStatus";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { CheckCircle } from "lucide-react";
import { formatFormalName } from "@lib/utils/string.utils";
import { IoCloseCircle } from "react-icons/io5";

export default function AdminEventCard({
    event,
    actionsType = "present",
    setIsLoading,
}) {
    // Helper for status badges
    const getRegStatusBadge = (status) => {
        if (status === "closed")
            return (
                <div className="badge p-2 font-semibold text-xs badge-error">
                    <GiClosedDoors /> Closed
                </div>
            );
        if (status === "completed")
            return (
                <div className="badge p-2 font-semibold text-xs badge-success">
                    <CheckIcon className="w-4 h-4" /> Completed
                </div>
            );
        if (status === "ongoing")
            return (
                <div className="badge p-2 font-semibold text-xs badge-primary">
                    <GiOpenBook /> Ongoing
                </div>
            );
        return (
            <div className="badge p-2 font-semibold text-xs badge-warning">
                <ExclamationTriangleIcon /> {status}
            </div>
        );
    };

    return (
        <Card className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40 max-h-max flex flex-col justify-between">
            <CardContent className="relative flex flex-wrap items-center justify-between gap-3">
                {event.status === "approved" &&
                    event.registration_status !== "completed" && (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                asChild
                                className="absolute top-5 right-5"
                            >
                                <Button variant="outline" className="ml-auto">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <EventRegistrationStatus
                                        data={event}
                                        setIsLoading={setIsLoading}
                                        className="btn btn-sm btn-ghost btn-warning flex items-center gap-1"
                                    />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <VerifyEvent
                                        eventData={{
                                            id: event.id,
                                            status: "cancelled",
                                        }}
                                        label="Cancel Blood Drive"
                                        className="btn btn-sm btn-ghost btn-error w-full"
                                        formClassName="w-full"
                                        icon={<IoCloseCircle />}
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                <div className="flex items-center">
                    <CustomAvatar
                        avatar={
                            event?.file_url ||
                            event?.agency?.logo_url ||
                            "/logo-1.jpeg"
                        }
                        className="w-20 h-20 border rounded-full"
                    />
                    <div>
                        <CardHeader className="pb-0">
                            <div className="flex flex-col gap-2">
                                <CardTitle className="flex items-center gap-5">
                                    <h2 className="text-xl font-bold truncate">
                                        {event.title}
                                    </h2>
                                    <div className="flex items-center badge badge-primary gap-2 p-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className=" font-semibold">
                                            {moment(event.date).format(
                                                "MMM DD, YYYY"
                                            )}
                                        </span>
                                    </div>
                                </CardTitle>
                                <div className="flex flex-wrap gap-2">
                                    <span className="flex-items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">
                                        <CheckCircle className="w-4 h-4" />
                                        {formatFormalName(event.status)}
                                    </span>
                                    {getRegStatusBadge(
                                        formatFormalName(
                                            event.registration_status
                                        )
                                    )}
                                    <span className="flex-items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold">
                                        <Users className="w-4 h-4" />
                                        {event.time_schedules?.reduce(
                                            (acc, sched) =>
                                                acc + sched?.donors?.length,
                                            0
                                        ) ?? 0}{" "}
                                        donors
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mb-2">
                                    <CustomAvatar
                                        avatar={
                                            event?.agency?.logo_url ||
                                            "/logo-1.jpeg"
                                        }
                                        className="w-8 h-8 border rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                                            {event?.agency?.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {event?.agency?.agency_address}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <CardDescription className="flex flex-col gap-1">
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {parse(
                                        event.description?.length > 200
                                            ? event.description.slice(0, 200) +
                                                  "..."
                                            : event.description
                                    )}
                                </span>
                            </CardDescription>
                        </CardHeader>
                    </div>
                </div>
                <div className="flex flex-wrap items-end gap-2 lg:pt-20 ">
                    <Link
                        href={`/portal/admin/events/${event.id}`}
                        className="space-x-2 btn btn-outline btn-primary"
                    >
                        <Eye className="w-4 h-4" />
                        <span>Details</span>
                    </Link>

                    {actionsType === "present" &&
                        event.status === "approved" &&
                        event.registration_status === "ongoing" && (
                            <Link
                                href={`/portal/admin/events/${event.id}/event-dashboard`}
                                className="btn btn-outline btn-info space-x-2 flex justify-center"
                            >
                                <CalendarCog className="w-4 h-4" />
                                <span>Manage Event</span>
                            </Link>
                        )}
                    {event.status === "approved" &&
                        event.registration_status === "ongoing" && (
                            <Link
                                href={`/portal/admin/events/${event.id}/participants`}
                                className="btn btn-outline btn-secondary space-x-2 flex justify-center"
                            >
                                <Users className="w-4 h-4" />
                                <span>View Donors</span>
                            </Link>
                        )}
                    {event.status === "for approval" && (
                        <>
                            <div className="space-x-2 flex justify-between">
                                <VerifyEvent
                                    eventData={{
                                        id: event.id,
                                        status: "approved",
                                    }}
                                    label="Approve"
                                    className="btn btn-outline btn-success"
                                    formClassName="w-full"
                                    icon={<CheckIcon />}
                                />
                            </div>
                            <div className="px-2 flex justify-between">
                                <RejectEvent
                                    eventId={event.id}
                                    className="w-full btn btn-outline btn-error"
                                />
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
