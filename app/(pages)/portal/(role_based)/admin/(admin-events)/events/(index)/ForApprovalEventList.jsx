"use client";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import moment from "moment";

import { CheckIcon, Command, Eye, FileClock, SquareMenu } from "lucide-react";
import parse from "html-react-parser";

import Link from "next/link";
import Skeleton_line from "@components/ui/skeleton_line";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import VerifyEvent from "@components/events/VerifyEvent";
import RejectEvent from "@components/events/RejectEvent";

export default function ForApprovalEventList({
    target = "",
    events,
    eventsIsFetching,
}) {
    if (eventsIsFetching)
        return (
            <>
                <Skeleton_line />
                <Skeleton_line />
                <Skeleton_line />
            </>
        );

    if (!events || events.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                <FileClock className="w-12 h-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold">No Pending Approvals</h2>
                <p className="text-gray-500 mt-2">You're all caught up! 🎉</p>
            </Card>
        );

    return (
        <>
            {events.map((event) => (
                // <Link key={event.id} href={`/portal/admin/events/${event.id}`}>
                <Card
                    key={event.id}
                    className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40"
                >
                    <CardHeader>
                        <CardTitle className="flex flex-wrap justify-between">
                            <span className="text-xl">
                                {event?.agency?.name}
                            </span>

                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                {moment(event?.createdAt).format(
                                    "MMM DD, YYYY"
                                )}
                            </span>
                        </CardTitle>
                        <CardDescription className="flex flex-col justify-between gap-1 dark:text-slate-200">
                            <span>
                                <span>Title:</span> &nbsp;
                                <div className="text-lg pl-2 text-black dark:text-white">
                                    {parse(event?.title)}
                                </div>
                            </span>
                            <span>
                                Description:
                                <br /> {parse(event?.description)}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="h-8 w-min p-0 dark:border hover:ring-offset-2 hover:ring-1 cursor-pointer"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        Actions
                                        <SquareMenu className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel className="flex items-center space-x-2">
                                        <Command className="w-3 h-3" />
                                        <span>Actions</span>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

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
                                    <Link
                                        href={`/portal/admin/events/${event.id}`}
                                        target={target}
                                    >
                                        <DropdownMenuItem className="space-x-2 btn btn-ghost btn-primary">
                                            <Eye className="w-4 h-4" />
                                            <span>Details</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    {/* <Link
                                            href={`/portal/admin/events/${event.id}/edit`}
                                            // target={target}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <DropdownMenuItem
                                                className="space-x-2 btn btn-ghost btn-warning"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Pencil className="w-4 h-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                        </Link> */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-center gap-4 px-2 md:px-15 transform transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110 dark:text-slate-200">
                        <div>
                            <CustomAvatar
                                avatar={
                                    event?.file_url || "/upload-event-photo.png"
                                }
                                className="flex-none w-[150px] h-[150px] "
                            />
                        </div>
                        <div className="md:flex-1 flex flex-col gap-2">
                            <label className="text-xs">Event Date:</label>
                            <span className="text-lg  font-semibold">
                                {moment(event?.date).format("MMM DD, YYYY")}
                            </span>
                            <label className="text-xs">Organizer:</label>
                            <span className="text-lg font-semibold">
                                {event?.requester?.name}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                // </Link>
            ))}
        </>
    );
}
