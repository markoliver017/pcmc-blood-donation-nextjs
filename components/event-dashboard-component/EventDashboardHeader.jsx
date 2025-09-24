"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import parse from "html-react-parser";
import {
    Calendar,
    MapPin,
    User,
    Building,
    Clock,
    ArrowLeft,
    Download,
    Printer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import moment from "moment";

export default function EventDashboardHeader({ event, onProgress }) {
    const router = useRouter();

    if (!event) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        Loading event information...
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "for approval":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    const getRegistrationStatusColor = (status) => {
        switch (status) {
            case "ongoing":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "closed":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "not started":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button> */}
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                {event.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Event Dashboard
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="flex items-center gap-2"
                            onClick={() => {
                                // TODO: Implement export functionality
                                console.log("Export event data");
                            }}
                        >
                            <Download className="h-4 w-4" />
                            {/* <span className="hidden sm:inline">Export</span> */}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="flex items-center gap-2"
                            onClick={() => {
                                // TODO: Implement print functionality
                                console.log("print");
                                // window.print();
                            }}
                        >
                            <Printer className="h-4 w-4" />
                            {/* <span className="hidden sm:inline">Print</span> */}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Event Date */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium">Event Date</p>
                            <p className="text-sm text-muted-foreground">
                                {moment(event.date).format("MMM DD, YYYY")}
                            </p>
                        </div>
                    </div>

                    {/* Event Location */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <MapPin className="h-5 w-5 text-red-600" />
                        <div>
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-sm text-muted-foreground">
                                {event.agency?.name || "Not specified"}
                            </p>
                        </div>
                    </div>

                    {/* Event Status */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Clock className="h-5 w-5 text-green-600" />
                        <div>
                            <p className="text-sm font-medium">Event Status</p>
                            <Badge
                                className={`text-xs ${getStatusColor(
                                    event.status
                                )}`}
                            >
                                {event.status?.replace("_", " ").toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    {/* Registration Status */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <User className="h-5 w-5 text-purple-600" />
                        <div>
                            <p className="text-sm font-medium">Registration</p>
                            <Badge
                                className={`text-xs ${getRegistrationStatusColor(
                                    event.registration_status
                                )}`}
                            >
                                {event.registration_status
                                    ?.replace("_", " ")
                                    .toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>
                {/* Event Description */}
                {event.description && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                            Event Description
                        </h4>
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <span>{parse(event.description)}</span>
                        </div>
                    </div>
                )}
                {/* Event Organizer Info */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <User className="h-5 w-5 text-indigo-600" />
                        <div>
                            <p className="text-sm font-medium">
                                Event Organizer
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {event.requester?.name || "Not specified"}
                            </p>
                            {event.requester?.email && (
                                <p className="text-xs text-muted-foreground">
                                    {event.requester.email}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                +63
                                {event.requester?.coordinator ? (
                                    <>
                                        {
                                            event?.requester?.coordinator
                                                ?.contact_number
                                        }
                                    </>
                                ) : (
                                    <>{event?.agency?.contact_number}</>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Building className="h-5 w-5 text-orange-600" />
                        <div>
                            <p className="text-sm font-medium">
                                Hosting Agency
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {event.agency?.name || "Not specified"}
                            </p>
                            {event.agency?.address && (
                                <p className="text-xs text-muted-foreground">
                                    {event.agency.address}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Event Progress Indicator */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                            Event Progress
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {moment(event.date).isBefore(moment())
                                ? "Completed"
                                : moment(event.date).isSame(moment(), "day")
                                ? "Today"
                                : "Upcoming"}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        {/* <div
                            className={`h-2 rounded-full transition-all duration-300 ${moment(event.date).isBefore(moment())
                                ? "bg-green-500 w-full"
                                : moment(event.date).isSame(moment(), "day")
                                    ? "bg-blue-500 w-3/4"
                                    : "bg-gray-400 w-1/4"
                                }`}
                        /> */}
                        <div
                            className={`h-2 rounded-full transition-all duration-300 bg-green-500 w-[${
                                (onProgress || 0) * 100
                            }%]`}
                        />
                    </div>
                </div>
                <div className="text-sm text-muted-foreground text-end">
                    {(onProgress || 0) * 100}%
                </div>
            </CardContent>
        </Card>
    );
}
