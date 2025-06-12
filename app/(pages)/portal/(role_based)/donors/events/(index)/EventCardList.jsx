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

import { FileClock } from "lucide-react";
import parse from "html-react-parser";


export default function EventCardList({ events }) {


    if (!events || events.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                <FileClock className="w-12 h-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold">No Ongoing Blood Drives</h2>
                <p className="text-gray-500 mt-2">Stay tuned — upcoming drives will be announced here. 🎉</p>
            </Card>
        );

    return (
        <>
            {events.map((event) => (
                <Card
                    key={event.id}
                    className=" hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40 max-h-max"
                >

                    <CardHeader>
                        <CardTitle className="flex flex-wrap justify-between">
                            <span className="text-xl">
                                {event.title}
                            </span>
                            <span className="flex-items-center text-sm text-slate-600 dark:text-slate-300">
                                Posted: {moment(event.createdAt).format("MMM DD, YYYY")}
                            </span>
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
                                avatar={
                                    event?.file_url ||
                                    "/logo-1.jpeg"
                                }
                                className="flex-none w-[150px] h-[150px] "
                            />
                        </div>
                        <div className="md:flex-1 flex flex-col gap-2">
                            <div className="flex">
                                <div className="flex-1">

                                    <label className="text-xs block">From:</label>
                                    <span className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                        {moment(event?.from_date).format(
                                            "MMM DD, YYYY"
                                        )}
                                    </span>
                                </div>
                                <div className="flex-1">

                                    <label className="text-xs block">To:</label>
                                    <span className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                        {moment(event?.to_date).format(
                                            "MMM DD, YYYY"
                                        )}
                                    </span>
                                </div>
                            </div>
                            <label className="text-xs">Organizer:</label>
                            <span className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                {event?.requester?.name}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
