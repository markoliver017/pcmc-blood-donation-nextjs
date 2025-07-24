"use client";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import Skeleton_user from "@components/ui/Skeleton_user";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { FileClock, Pencil } from "lucide-react";
import parse from "html-react-parser";

import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function ForApprovalEventList({
    avatarClassName = "",
    editable = true,
    events = [],
    isFetching = true,
}) {
    const router = useRouter();

    if (isFetching)
        return (
            <>
                <Skeleton_user />
                <Skeleton_user />
                <Skeleton_user />
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
                <Link href={`/portal/hosts/events/${event.id}`} key={event.id}>
                    <Card className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40">
                        <CardHeader>
                            <CardTitle className="flex flex-wrap justify-between">
                                <span className="text-xl">{event?.title}</span>
                                <div className="flex gap-1">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {moment(event?.createdAt).format(
                                            "MMM DD, YYYY"
                                        )}
                                    </span>
                                    {editable && (
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-ghost"
                                            title="Edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                router.push(
                                                    `/portal/hosts/events/${event.id}/edit`
                                                );
                                            }}
                                        >
                                            <Pencil className="h-4" />
                                        </button>
                                    )}
                                </div>
                            </CardTitle>
                            <CardDescription className="flex flex-wrap flex-col gap-1 dark:text-slate-300">
                                <span>
                                    Description: {parse(event?.description)}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-center justify-center gap-4 px-2 md:px-15 transform transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110">
                            <div>
                                <CustomAvatar
                                    avatar={event?.file_url || event?.agency?.file_url || "/default_company_avatar.png"}
                                    className={clsx(
                                        "flex-none w-[50px] h-[50px]",
                                        avatarClassName
                                    )}
                                />
                            </div>
                            <div className="md:flex-1 flex flex-col gap-2">
                                <label className="text-xs">Event Date:</label>
                                <span className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                    {moment(event?.date).format("MMM DD, YYYY")}
                                </span>

                                <label className="text-xs">Organizer:</label>
                                <span className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                    {event?.requester?.name}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </>
    );
}
