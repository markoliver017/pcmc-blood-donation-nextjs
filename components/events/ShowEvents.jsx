"use client";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import { calculateAge } from "@lib/utils/string.utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import parse from "html-react-parser";

import React from "react";

export default function ShowEvents({ eventId }) {
    const { data: event } = useQuery({
        queryKey: ["agency_events", eventId],
        queryFn: async () => await getEventsById(eventId),
        enabled: !!eventId,
    });

    const { status } = event;
    let statusClass = "badge-primary";
    if (status == "activated") {
        statusClass = "badge-success";
    } else if (status == "deactivated") {
        statusClass = "badge-warning";
    } else if (status == "rejected") {
        statusClass = "badge-error";
    }
    // return "";
    return (
        <Card className="mt-2 p-5 h-full">
            <CardHeader>
                <CardTitle className="flex">
                    <div className="text-4xl">{event?.title}</div>
                </CardTitle>
                <CardDescription>{parse(event?.description)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap xl:flex-nowrap gap-2">
                <CustomAvatar
                    avatar={event?.file_url || "/blood-logo.png"}
                    className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] xl:w-[350px] xl:h-[350px] flex-none"
                />
                <div className="w-full sm:min-w-sm">
                    <Table className="w-full sm:min-w-sm">
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    ID
                                </TableCell>
                                <TableCell>{event?.id}</TableCell>
                            </TableRow>
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
                                    {
                                        event?.requester?.coordinator
                                            ?.contact_number
                                    }
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-semibold">
                                    Date Started
                                </TableCell>
                                <TableCell>
                                    {moment(event.from_date).format(
                                        "MMM DD, YYYY"
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Date Ended
                                </TableCell>
                                <TableCell>
                                    {moment(event.to_date).format(
                                        "MMM DD, YYYY"
                                    )}
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
                                            <div className="flex justify-between">
                                                <span className="font-semibold">
                                                    Has Limit:
                                                </span>
                                                <span>
                                                    {sched?.has_limit
                                                        ? "Yes"
                                                        : "No"}
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
