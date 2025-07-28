"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
    Calendar,
    Clock,
    Eye,
    MoreVertical,
    Pencil,
    Settings,
    Users,
} from "lucide-react";
import { GiClosedDoors, GiOpenBook } from "react-icons/gi";
import { CheckCircle2 } from "lucide-react";
import { DashboardIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { formatFormalName } from "@lib/utils/string.utils";
import moment from "moment";
import Link from "next/link";
import { NotifyEventRegistration } from "@components/events/NotifyEventRegistration";
import EventRegistrationStatus from "@components/organizers/EventRegistrationStatus";

export default function AgencyEventCard({
    event,
    onView,
    onEdit,
    setIsLoading,
}) {
    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Approved
                    </Badge>
                );
            case "for approval":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        For Approval
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        Rejected
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
                        Cancelled
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
                        {status}
                    </Badge>
                );
        }
    };

    const getRegistrationStatusBadge = (status) => {
        switch (status) {
            case "ongoing":
                return (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 flex items-center gap-1">
                        <GiOpenBook className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
            case "not started":
                return (
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
            case "completed":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
            case "closed":
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 flex items-center gap-1">
                        <GiClosedDoors className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 flex items-center gap-1">
                        <ExclamationTriangleIcon className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
        }
    };

    const totalParticipants =
        event.time_schedules?.reduce(
            (acc, schedule) => acc + (schedule.donors?.length || 0),
            0
        ) || 0;

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">
                        {event.title}
                    </CardTitle>
                    <div className="flex gap-2">
                        {getStatusBadge(event.status)}
                        {event.registration_status &&
                            getRegistrationStatusBadge(
                                event.registration_status
                            )}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>{moment(event.date).format("MMMM D, YYYY")}</span>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Organizer
                        </h4>
                        <p className="font-medium">{event.requester?.name}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Participants
                        </h4>
                        <p className="font-medium">{totalParticipants}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Time Slots
                        </h4>
                        <p className="font-medium">
                            {event.time_schedules?.length || 0}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Created
                        </h4>
                        <p className="font-medium">
                            {moment(event.createdAt).format("MMM D, YYYY")}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between py-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex-1 flex gap-2">
                    <button
                        className="btn btn-sm btn-outline rounded-4xl"
                        onClick={() => onView(event)}
                    >
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </button>

                    {event.status === "for approval" && (
                        <button
                            className="btn btn-sm btn-outline rounded-4xl"
                            onClick={() => onEdit(event)}
                        >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </button>
                    )}

                    {event.status === "approved" && (
                        <>
                            {" "}
                            <Link
                                href={`/portal/hosts/events/${event.id}/event-dashboard`}
                                className="btn btn-sm btn-outline rounded-4xl"
                            >
                                <DashboardIcon className="h-4 w-4" /> Dashboard
                            </Link>
                            {event.registration_status === "not started" ||
                                (event.registration_status === "ongoing" && (
                                    <EventRegistrationStatus
                                        data={event}
                                        setIsLoading={setIsLoading}
                                        className="btn btn-sm btn-outline rounded-4xl"
                                    />
                                ))}
                        </>
                    )}
                </div>

                {event.status === "approved" &&
                    event.registration_status === "ongoing" && (
                        <DropdownMenu className="flex-none">
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4" /> Others
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex-none">
                                <Link
                                    href={`/portal/hosts/events/${event.id}/participants`}
                                >
                                    <DropdownMenuItem className="btn btn-ghost btn-block">
                                        <Users className="mr-2 h-4 w-4" /> View
                                        Participants
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem>
                                    <NotifyEventRegistration
                                        donorsData={event?.agency?.donors || []}
                                        eventData={event}
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
            </CardFooter>
        </Card>
    );
}
