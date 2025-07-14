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
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-xl font-bold truncate">
                        {event.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                            {moment(event.date).format("MMM DD, YYYY")}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="flex items-center space-x-2">
                                    <Command className="w-3 h-3" />
                                    <span>Actions</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href={`/portal/admin/events/${event.id}`}>
                                    <DropdownMenuItem className="space-x-2 btn btn-ghost btn-primary">
                                        <Eye className="w-4 h-4" />
                                        <span>Details</span>
                                    </DropdownMenuItem>
                                </Link>
                                {actionsType === "present" &&
                                    event.status === "approved" &&
                                    event.registration_status === "ongoing" && (
                                        <DropdownMenuItem>
                                            <Link
                                                href={`/portal/admin/events/${event.id}/event-dashboard`}
                                                className="btn btn-ghost btn-info btn-block space-x-2 flex justify-center"
                                            >
                                                <CalendarCog className="w-4 h-4" />
                                                <span>Manage Event</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                {event.status === "approved" &&
                                    event.registration_status === "ongoing" && (
                                        <DropdownMenuItem>
                                            <Link
                                                href={`/portal/admin/events/${event.id}/participants`}
                                                className="btn btn-ghost btn-secondary btn-block space-x-2 flex justify-center"
                                            >
                                                <Users className="w-4 h-4" />
                                                <span>View Donors</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                {event.status === "for approval" && (
                                    <>
                                        <DropdownMenuItem className="space-x-2 flex justify-between">
                                            <VerifyEvent
                                                eventData={{
                                                    id: event.id,
                                                    status: "approved",
                                                }}
                                                label="Approve"
                                                className="btn btn-ghost btn-success"
                                                formClassName="w-full"
                                                icon={<CheckIcon />}
                                            />
                                        </DropdownMenuItem>
                                        <div className="px-2 flex justify-between">
                                            <RejectEvent
                                                eventId={event.id}
                                                className="w-full btn btn-ghost btn-error"
                                            />
                                        </div>
                                    </>
                                )}
                                {event.status === "approved" &&
                                    event.registration_status !==
                                        "completed" && (
                                        <>
                                            <DropdownMenuItem>
                                                <EventRegistrationStatus
                                                    data={event}
                                                    setIsLoading={setIsLoading}
                                                    className="btn btn-ghost btn-warning flex items-center gap-1"
                                                />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="space-x-2 flex justify-between">
                                                <VerifyEvent
                                                    eventData={{
                                                        id: event.id,
                                                        status: "cancelled",
                                                    }}
                                                    label="Cancel Blood Drive"
                                                    className="btn btn-ghost btn-error w-full"
                                                    formClassName="w-full"
                                                    icon={<IoCloseCircle />}
                                                />
                                            </DropdownMenuItem>
                                        </>
                                    )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <CardDescription className="flex flex-col gap-1 mt-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {parse(
                            event.description?.length > 80
                                ? event.description.slice(0, 80) + "..."
                                : event.description
                        )}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-2">
                    <CustomAvatar
                        avatar={
                            event?.agency?.logo_url ||
                            event?.file_url ||
                            "/logo-1.jpeg"
                        }
                        className="w-12 h-12 border rounded-full"
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
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="flex-items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">
                        <CheckCircle className="w-4 h-4" />
                        {formatFormalName(event.status)}
                    </span>
                    {getRegStatusBadge(
                        formatFormalName(event.registration_status)
                    )}
                    <span className="flex-items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold">
                        <Users className="w-4 h-4" />
                        {event.time_schedules?.reduce(
                            (acc, sched) => acc + sched?.donors?.length,
                            0
                        ) ?? 0}{" "}
                        donors
                    </span>
                </div>
                <div className="flex flex-wrap gap-2"></div>
            </CardContent>
        </Card>
    );
}
