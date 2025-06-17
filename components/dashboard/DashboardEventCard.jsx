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
import clsx from "clsx";

export default function DashboardEventCard({
    event,
    isRegistrationOpen = false,
}) {
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
                            className="flex-none w-[150px] h-[150px] "
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
                                <div className="flex flex-wrap items-center justify-center md:justify-start  gap-2 md:gap-5 py-2">
                                    <div className="relative w-12 h-12 border rounded-full">
                                        <Image
                                            src={
                                                event?.requester?.image ||
                                                "/default_avatar.png"
                                            }
                                            alt="Avatar"
                                            fill
                                            style={{
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>
                                    <div className="max-w-68">
                                        <div className="flex-items-center flex-wrap">
                                            <span className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                                {event?.requester?.name}
                                            </span>
                                            <span className="text-blue-800 dark:text-blue-300 font-semibold">
                                                ({event?.requester?.email})
                                            </span>
                                        </div>
                                        <span className="block text-lg text-slate-800 dark:text-slate-300 font-semibold">
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
                    <h2 className="text-blue-600 font-semibold text-xl">
                        Time Schedule(s)
                    </h2>
                    <Table>
                        <TableCaption>Available time schedules.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Time</TableHead>
                                {isRegistrationOpen && (
                                    <>
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
                                        sched.status == "closed" &&
                                            "font-medium italic text-red-400 dark:text-red-500"
                                    )}
                                >
                                    <TableCell>{sched.id}</TableCell>
                                    <TableCell>
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
                                            <TableCell>
                                                <span>
                                                    {sched?.status.toUpperCase()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span>
                                                    {sched.donors.length}
                                                </span>
                                                {sched?.has_limit && (
                                                    <span>
                                                        /{sched?.max_limit}
                                                    </span>
                                                )}
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
