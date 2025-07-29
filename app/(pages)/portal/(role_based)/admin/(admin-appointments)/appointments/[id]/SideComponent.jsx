"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import parse from "html-react-parser";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default function SideComponent({ appointment }) {
    const schedule = appointment?.time_schedule;
    const event = schedule?.event;
    const donor = appointment?.donor;
    const user = donor?.user;

    return (
        <Card className="p-4 flex flex-col gap-4 h-max">
            <CardHeader className="border-b p-2">
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded overflow-hidden border">
                        <Image
                            src={event?.file_url || "/logo-1.png"}
                            alt="Event Image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-semibold">
                            {event?.title || "Untitled Event"}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-gray-500">
                            {moment(event?.date).format("MMM DD, YYYY")} —{" "}
                            {schedule?.formatted_time || "No Time"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="text-sm text-gray-700 dark:text-gray-300">
                {event?.description ? (
                    <div className="prose">{parse(event.description)}</div>
                ) : (
                    <p className="italic text-gray-400">
                        No description provided.
                    </p>
                )}

                <div className="mt-4 space-y-1">
                    <div className="font-semibold">Organized by:</div>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                            <Image
                                src={
                                    donor?.agency?.file_url ||
                                    "/default_company_avatar.png"
                                }
                                alt="Agency Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">
                                {donor?.agency?.name}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                {donor?.agency?.agency_address}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-y-1">
                    <div className="font-semibold">Coordinator:</div>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                            <Image
                                src={user?.image || "/default_avatar.png"}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">
                                {event?.requester?.name}
                            </div>

                            <div className="text-gray-500 dark:text-gray-400">
                                Email: {event?.requester?.email}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                Contact: {donor?.contact_number}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-y-1">
                    <div className="font-semibold">Donor:</div>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                            <Image
                                src={user?.image || "/default_avatar.png"}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">{user?.name}</div>
                            <div className="text-gray-500 dark:text-gray-400">
                                {donor?.full_address}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                Email: {user?.email}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                Contact: {donor?.contact_number}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
