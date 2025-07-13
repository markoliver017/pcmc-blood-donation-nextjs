"use client";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { CheckIcon, Command, Eye, MenuSquare, MoreHorizontal, Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import { calculateAge, formatFormalName } from "@lib/utils/string.utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import parse from "html-react-parser";

import { getEventsById } from "@/action/hostEventAction";
import React, { useState } from "react";
import EventRegistrationStatus from "@components/organizers/EventRegistrationStatus";
import LoadingModal from "@components/layout/LoadingModal";
import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Skeleton_line from "@components/ui/skeleton_line";
import VerifyEvent from "./VerifyEvent";
import RejectEvent from "./RejectEvent";

export default function ShowEvents({ eventId }) {
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const { data: event, isLoading: isFetching } = useQuery({
        queryKey: ["agency_events", eventId],
        queryFn: async () => await getEventsById(eventId),
        enabled: !!eventId,
    });

    if (isFetching) return <Skeleton_line />;

    const { status, registration_status } = event;
    let statusClass = "badge-error";
    if (status == "approved") {
        statusClass = "badge-success";
    } else if (status == "deactivated") {
        statusClass = "badge-warning";
    } else if (status == "for approval") {
        statusClass = "badge-primary";
    }

    let regStatusClass = "badge-error";
    if (registration_status == "ongoing") {
        regStatusClass = "badge-success";
    } else if (registration_status == "not started") {
        regStatusClass = "badge-warning";
    }

    if (session.status === "loading") return <Skeleton_line />;
    const currentRole = session?.data?.user?.role_name;

    return (
        <Card className="mt-2 p-5 h-full">
            <CardHeader>
                <CardTitle className="flex">
                    <div className="text-4xl">{event?.title}</div>
                </CardTitle>
                <CardDescription className="flex justify-between">
                    <span>{parse(event?.description)}</span>

                    {(currentRole == "Organizer" ||
                        currentRole == "Agency Administrator") && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <span className="sr-only">Open menu</span>
                                    <MenuSquare className="h-4 w-4" />
                                    <span className="hidden md:inline-block">
                                        Action
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="flex items-center space-x-2">
                                    <Command className="w-3 h-3" />
                                    <span>Actions</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {event.status == "for approval" ? (
                                    <Link
                                        href={`/portal/hosts/events/${event.id}/edit`}
                                    >
                                        <DropdownMenuItem className="flex items-center space-x-2">
                                            <Pencil className="w-4 h-4" />
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                    </Link>
                                ) : (
                                    ""
                                )}

                                {event.status == "approved" ? (
                                    <DropdownMenuItem>
                                        <EventRegistrationStatus
                                            data={event}
                                            setIsLoading={setIsLoading}
                                        />
                                    </DropdownMenuItem>
                                ) : (
                                    ""
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {(currentRole == "Admin") && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <span className="sr-only">Open menu</span>
                                    <MenuSquare className="h-4 w-4" />
                                    <span className="hidden md:inline-block">
                                        Action
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="flex items-center space-x-2">
                                    <Command className="w-3 h-3" />
                                    <span>Actions</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {event.status == "for approval" ? (
                                    <>
                                        <DropdownMenuItem className="flex items-center space-x-2">
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
                                        <RejectEvent
                                            eventId={event.id}
                                            className="w-full btn btn-ghost btn-error"
                                        />
                                    </>
                                ) : (
                                    ""
                                )}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent
                id="form-modal"
                className="flex flex-wrap xl:flex-nowrap gap-2"
            >
                <LoadingModal imgSrc="/loader_3.gif" isLoading={isLoading} />
                <CustomAvatar
                    avatar={event?.file_url || "/blood-logo.png"}
                    className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] xl:w-[350px] xl:h-[350px] flex-none"
                />
                <div className="w-full sm:min-w-sm">
                    <Table className="w-full sm:min-w-sm">
                        <TableBody>
                            {/* <TableRow>
                                <TableCell className="font-semibold">
                                    ID
                                </TableCell>
                                <TableCell>{event?.id}</TableCell>
                            </TableRow> */}
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Status
                                </TableCell>
                                <TableCell>
                                    <div
                                        className={`badge p-2 font-semibold text-xs ${statusClass}`}
                                    >
                                        {event?.status.toUpperCase()}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Registration Status
                                </TableCell>
                                <TableCell>
                                    <div
                                        className={`badge p-2 font-semibold text-xs ${regStatusClass}`}
                                    >
                                        {event?.registration_status.toUpperCase()}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Agency Name
                                </TableCell>
                                <TableCell>{event?.agency.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Organizer:
                                </TableCell>
                                <TableCell>{event?.requester.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Email Address:
                                </TableCell>
                                <TableCell>{event?.requester.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Contact Number
                                </TableCell>
                                <TableCell>
                                    +63
                                    {event?.requester?.coordinator
                                        ?.contact_number ||
                                        event?.agency?.contact_number}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-semibold">
                                    Event Date
                                </TableCell>
                                <TableCell>
                                    {moment(event.date).format("MMM DD, YYYY")}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-semibold">
                                    Remarks
                                </TableCell>
                                <TableCell>
                                    {event?.remarks || "None"}
                                </TableCell>
                            </TableRow>
                            <TableRow className="bg-neutral-200 dark:bg-neutral-700 ">
                                <TableCell
                                    colSpan="2"
                                    className="font-semibold"
                                >
                                    Time Schedule(s)
                                </TableCell>
                            </TableRow>

                            {event?.time_schedules.map((sched) => (
                                <TableRow key={sched.id}>
                                    <TableCell colSpan="2">
                                        <div className="border rounded-xl p-4 bg-neutral-100 dark:bg-neutral-800 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="font-semibold">
                                                    From:
                                                </span>
                                                <span>
                                                    {moment(
                                                        sched.time_start,
                                                        "HH:mm"
                                                    ).format("hh:mm A")}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold">
                                                    To:
                                                </span>
                                                <span>
                                                    {moment(
                                                        sched.time_end,
                                                        "HH:mm"
                                                    ).format("hh:mm A")}
                                                </span>
                                            </div>

                                            {sched?.has_limit && (
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">
                                                        Max Limit:
                                                    </span>
                                                    <span>
                                                        {sched?.max_limit}
                                                    </span>
                                                </div>
                                            )}
                                            {/* <div className="flex justify-between" >
                                                <span className="font-semibold">
                                                    Status:
                                                </span>
                                                <span
                                                    className={clsx(
                                                        "flex justify-between badge p-2",
                                                        sched?.status == "open" ? "badge-success" : "badge-error"
                                                    )}
                                                >
                                                    {formatFormalName(sched?.status)}
                                                </span>
                                            </div> */}
                                            <div className="flex justify-between">
                                                <span className="font-semibold">
                                                    Participants:
                                                </span>
                                                <span
                                                    className={clsx(
                                                        "flex justify-between badge p-2"
                                                    )}
                                                >
                                                    {sched?.donors.length}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
