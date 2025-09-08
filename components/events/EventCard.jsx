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

import parse from "html-react-parser";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import BookEventButton from "@components/donors/BookEventButton";
import clsx from "clsx";
import CancelEventButton from "@components/donors/CancelEventButton";

export default function EventCard({
    event,
    onLoad = () => {},
    onFinish = () => {},
    isRegistrationOpen = false,
    isAlreadyBooked = () => true,
    appointmentId = null,
}) {
    let isCancellable = true;
    const dateNow = moment();
    const eventDate = moment(event?.date, "YYYY-MM-DD");

    if (eventDate.isSameOrBefore(dateNow, "day")) {
        isCancellable = false;
        console.log("Event is today or has passed");
    } else {
        console.log("Event is in the future");
    }

    return (
        <Card
            key={event.id}
            className=" hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40 max-h-max"
        >
            <CardHeader>
                <CardTitle className="flex flex-wrap justify-between">
                    <span className="text-xl">{event.title}</span>
                    <span className="flex-items-center text-sm text-slate-600 dark:text-slate-300">
                        Posted: {moment(event.createdAt).format("MMM DD, YYYY")}
                    </span>
                </CardTitle>
                <CardDescription className="flex flex-wrap flex-col gap-1 dark:text-slate-300">
                    <span>Description: {parse(event?.description)}</span>
                    <span>Address: {event?.agency?.agency_address}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className=" px-2 md:px-15">
                <div className="flex flex-wrap items-center justify-center gap-4  transform transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110">
                    <div>
                        <CustomAvatar
                            avatar={event?.file_url || "/logo-1.jpeg"}
                            className="flex-none w-[100px] h-[100px] md:w-[150px] md:h-[150px] "
                        />
                    </div>
                    <div className="md:flex-1 flex flex-col gap-2">
                        <div className="flex">
                            <div className="flex-1 flex flex-wrap items-center gap-5">
                                <label className="text-xs block">
                                    Event Date:
                                </label>
                                <span className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                    {moment(event?.date).format("MMM DD, YYYY")}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="text-xs">Organizer:</label>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-5 py-2">
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={
                                                event?.requester?.image ||
                                                "/default_avatar.png"
                                            }
                                            alt="Avatar"
                                            fill
                                            className="rounded-full border"
                                            style={{
                                                objectFit: "contain",
                                            }}
                                            unoptimized={
                                                process.env
                                                    .NEXT_PUBLIC_NODE_ENV ===
                                                "production"
                                            }
                                        />
                                    </div>
                                    <div>
                                        <div className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                            {event?.requester?.name}
                                        </div>
                                        <div className="text-blue-800 dark:text-blue-300 font-semibold">
                                            ({event?.requester?.email})
                                        </div>

                                        <span className="block text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                            +63
                                            {event?.requester?.coordinator
                                                ?.contact_number ||
                                                event?.agency?.contact_number}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-5">
                    <h2 className="text-blue-600 font-semibold md:text-xl">
                        Time Schedule(s)
                    </h2>
                    {/* Desktop/Tablet table */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table className="min-w-[500px]">
                            <TableCaption>
                                Available time schedules.
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead>ID</TableHead> */}

                                    {isRegistrationOpen && (
                                        <>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Participants</TableHead>
                                            <TableHead>Action</TableHead>
                                        </>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {event?.time_schedules.map((sched) => (
                                    <TableRow
                                        key={sched.id}
                                        className={clsx(
                                            "font-semibold text-green-700 dark:text-green-600",
                                            isAlreadyBooked(sched.id) &&
                                                "font-bold italic text-slate-400 dark:text-slate-400",
                                            sched.status === "closed" &&
                                                "font-medium italic text-red-400 dark:text-red-500"
                                        )}
                                    >
                                        {/* <TableCell>{sched.id}</TableCell> */}
                                        <TableCell className="whitespace-normal break-words">
                                            <span>
                                                {moment(
                                                    sched.time_start,
                                                    "HH:mm"
                                                ).format("hh:mm A")}
                                            </span>
                                            {" - "}
                                            <span>
                                                {moment(
                                                    sched.time_end,
                                                    "HH:mm"
                                                ).format("hh:mm A")}
                                            </span>
                                        </TableCell>
                                        {isRegistrationOpen && (
                                            <>
                                                <TableCell className="whitespace-normal break-words">
                                                    <span>
                                                        {sched?.status.toUpperCase()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="whitespace-normal break-words">
                                                    <span>
                                                        {sched.donors.length}
                                                    </span>
                                                    {sched?.has_limit && (
                                                        <span>
                                                            /{sched?.max_limit}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="flex items-center flex-wrap gap-2">
                                                    <BookEventButton
                                                        event={event}
                                                        schedule={sched}
                                                        isDisabled={
                                                            isAlreadyBooked(
                                                                sched.id
                                                            ) ||
                                                            sched.status ==
                                                                "closed"
                                                        }
                                                        onLoad={onLoad}
                                                        onFinish={onFinish}
                                                    />
                                                    {isCancellable &&
                                                        isAlreadyBooked(
                                                            sched.id
                                                        ) && (
                                                            <CancelEventButton
                                                                event={event}
                                                                schedule={sched}
                                                                appointmentId={
                                                                    appointmentId
                                                                }
                                                                onLoad={onLoad}
                                                                onFinish={
                                                                    onFinish
                                                                }
                                                            />
                                                        )}
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {/* Mobile stacked list */}
                    <div className="md:hidden">
                        <div className="space-y-3">
                            {event?.time_schedules.map((sched) => (
                                <div
                                    key={sched.id}
                                    className={clsx(
                                        "rounded-lg border p-3 bg-white dark:bg-slate-900",
                                        "text-green-700 dark:text-green-500",
                                        isAlreadyBooked(sched.id) &&
                                            "italic text-slate-500 dark:text-slate-400",
                                        sched.status === "closed" &&
                                            "italic text-red-500 dark:text-red-400"
                                    )}
                                >
                                    <div className="flex flex-col gap-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-slate-600 dark:text-slate-300">
                                                Time
                                            </span>
                                            <span className="font-semibold">
                                                {moment(
                                                    sched.time_start,
                                                    "HH:mm"
                                                ).format("hh:mm A")}{" "}
                                                -{" "}
                                                {moment(
                                                    sched.time_end,
                                                    "HH:mm"
                                                ).format("hh:mm A")}
                                            </span>
                                        </div>
                                        {isRegistrationOpen && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">
                                                        Status
                                                    </span>
                                                    <span className="font-semibold">
                                                        {sched?.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">
                                                        Participants
                                                    </span>
                                                    <span className="font-semibold">
                                                        {sched.donors.length}
                                                        {sched?.has_limit && (
                                                            <>
                                                                {"/"}
                                                                {
                                                                    sched?.max_limit
                                                                }
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <BookEventButton
                                                        event={event}
                                                        schedule={sched}
                                                        isDisabled={
                                                            isAlreadyBooked(
                                                                sched.id
                                                            ) ||
                                                            sched.status ===
                                                                "closed"
                                                        }
                                                        onLoad={onLoad}
                                                        onFinish={onFinish}
                                                    />
                                                    {isCancellable &&
                                                        isAlreadyBooked(
                                                            sched.id
                                                        ) && (
                                                            <CancelEventButton
                                                                event={event}
                                                                schedule={sched}
                                                                appointmentId={
                                                                    appointmentId
                                                                }
                                                                onLoad={onLoad}
                                                                onFinish={
                                                                    onFinish
                                                                }
                                                            />
                                                        )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
