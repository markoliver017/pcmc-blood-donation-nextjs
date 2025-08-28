"use client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@components/ui/card";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import moment from "moment";
import parse from "html-react-parser";
import Link from "next/link";
import {
    Eye,
    Users,
    CheckIcon,
    CalendarCog,
    MoreHorizontal,
    Calendar,
    CheckCircle,
    Clock,
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
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { formatFormalName } from "@lib/utils/string.utils";
import { IoCloseCircle } from "react-icons/io5";
import { Badge } from "@components/ui/badge";
import StarRating from "@components/reusable_components/StarRating";
import { getFeedbackAverage } from "@lib/utils/event.utils";

export default function AdminEventCard({
    event,
    actionsType = "present",
    setIsLoading,
}) {
    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return (
                    <Badge variant="success" className="bg-green-500">
                        Approved
                    </Badge>
                );
            case "for approval":
                return <Badge variant="warning">For Approval</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            case "cancelled":
                return <Badge variant="outline">Cancelled</Badge>;
            default:
                return (
                    <Badge variant="secondary">
                        {formatFormalName(status)}
                    </Badge>
                );
        }
    };

    const getRegStatusBadge = (status) => {
        switch (status) {
            case "ongoing":
                return (
                    <Badge
                        variant="primary"
                        className="bg-blue-500 flex items-center gap-1"
                    >
                        <GiOpenBook className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
            case "not started":
                return (
                    <Badge variant="info" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
            case "completed":
                return (
                    <Badge
                        variant="success"
                        className="bg-green-500 flex items-center gap-1"
                    >
                        <CheckCircle className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
            case "closed":
                return (
                    <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                    >
                        <GiClosedDoors className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="warning"
                        className="flex items-center gap-1"
                    >
                        <ExclamationTriangleIcon className="h-3 w-3" />
                        {formatFormalName(status)}
                    </Badge>
                );
        }
    };

    return (
        <Card className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40 flex flex-col justify-between h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <CardTitle className="text-xl font-bold">
                        {event.title}
                    </CardTitle>

                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 pt-2">
                            {getStatusBadge(event.status)}
                            {event.registration_status &&
                                getRegStatusBadge(event.registration_status)}
                        </div>

                        {event.status === "approved" &&
                            event.registration_status !== "completed" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="py-2"
                                    >
                                        <DropdownMenuItem asChild>
                                            <EventRegistrationStatus
                                                data={event}
                                                setIsLoading={setIsLoading}
                                                className="btn w-full btn-sm cursor-pointer"
                                            />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <VerifyEvent
                                                eventData={{
                                                    id: event.id,
                                                    status: "cancelled",
                                                }}
                                                label="Cancel Blood Drive"
                                                className="btn w-full btn-sm text-red-500 cursor-pointer"
                                                formClassName="w-full"
                                                icon={<IoCloseCircle />}
                                            />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Calendar className="h-4 w-4" />
                        <span>{moment(event.date).format("MMMM D, YYYY")}</span>
                    </div>
                    <StarRating rating={getFeedbackAverage(event.donors)} />
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4 p-2">
                    <CustomAvatar
                        avatar={event.agency?.file_url || "/logo-1.jpeg"}
                        className="w-12 h-12 flex-none border rounded-full"
                    />
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Agency
                        </h4>
                        <p className="font-medium">{event.agency?.name}</p>
                        <p className="text-xs text-gray-500">
                            {event.agency?.agency_address}
                        </p>
                    </div>
                </div>
                <CardDescription className="text-justify">
                    <span className="text-gray-600 dark:text-gray-400">
                        {parse(
                            event.description?.length > 150
                                ? event.description.slice(0, 150) + "..."
                                : event.description
                        )}
                    </span>
                </CardDescription>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-start gap-2 bg-gray-50 dark:bg-gray-900/50 p-4 mt-auto">
                <Button asChild variant="outline" size="sm">
                    <Link
                        href={`/portal/admin/events/${event.id}`}
                        scroll={false}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                    </Link>
                </Button>

                {actionsType === "present" &&
                    event.status === "approved" &&
                    (event.registration_status === "ongoing" ||
                        event.registration_status === "completed") && (
                        <>
                            <Button asChild variant="outline" size="sm">
                                <Link
                                    href={`/portal/admin/events/${event.id}/event-dashboard`}
                                >
                                    <CalendarCog className="w-4 h-4 mr-2" />
                                    Manage Event
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link
                                    href={`/portal/admin/events/${event.id}/participants`}
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    View Donors ({event.donors?.length})
                                </Link>
                            </Button>
                        </>
                    )}

                {event.status === "for approval" && (
                    <div className="flex items-center gap-2">
                        <VerifyEvent
                            eventData={{
                                id: event.id,
                                status: "approved",
                            }}
                            label="Approve"
                            className="btn btn-success btn-sm"
                            formClassName="w-auto"
                            icon={<CheckIcon className="w-4 h-4" />}
                        />
                        <RejectEvent
                            eventId={event.id}
                            className="btn btn-error btn-sm"
                        />
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
