"use client";
import AllEventCalendar from "@components/organizers/AllEventCalendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { CalendarArrowUp, CalendarCheck2, CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { MdBloodtype } from "react-icons/md";
import {
    getApprovedEventsByAgency,
    getDonorDashboard,
    getLastDonationDateDonated,
    getLastDonationExamData,
} from "@/action/donorAction";
import DashboardEventCardList from "@components/dashboard/DashboardEventCardList";
import Skeleton_line from "@components/ui/skeleton_line";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export default function Dashboard() {
    const { data: dashboard, isLoading: dashboardIsLoading } = useQuery({
        queryKey: ["donor-dashboard"],
        queryFn: async () => {
            const res = await getDonorDashboard();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const { data: lastDonation } = useQuery({
        queryKey: ["last-donation"],
        queryFn: async () => {
            const res = await getLastDonationExamData();
            if (!res.success) {
                throw res;
            }
            return res;
        },
    });

    const {
        data: events,
        isLoading: eventIsLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["blood-drives"],
        queryFn: async () => {
            const res = await getApprovedEventsByAgency();

            if (!res.success) {
                throw res?.message || "unknown error";
            }
            return res.data;
        },
    });

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="w-full">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <MdBloodtype className="w-6 h-6" />
                            Blood Type
                        </CardTitle>
                        <CardDescription>
                            Your registered blood type
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <h2 className="text-4xl font-bold text-red-500 text-shadow-lg/25 text-shadow-red-400">
                            {dashboardIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>
                                    {dashboard?.blood_type || "Not Specified"}
                                </span>
                            )}
                        </h2>
                        {dashboardIsLoading ? (
                            <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                        ) : dashboard?.is_bloodtype_verified ? (
                            <div className="badge badge-success px-2 py-5">
                                <CheckCircle />
                                Verified
                            </div>
                        ) : (
                            <div className="badge badge-warning px-2 py-5">
                                <QuestionMarkCircledIcon /> Not Verified
                            </div>
                        )}
                        {/* <Link
                            className="btn btn-primary btn-outline"
                            href="/portal/donors/profile"
                        >
                            View Profile
                        </Link> */}
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <CalendarCheck2 className="w-6 h-6" />
                            Successful Donations
                        </CardTitle>
                        <CardDescription>
                            Track successful donations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <h2 className="text-4xl font-bold text-green-500 text-shadow-lg/25 text-shadow-green-400">
                            {dashboardIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>{dashboard?.no_donations || "0"}</span>
                            )}
                        </h2>
                        <Link
                            className="btn btn-primary btn-outline"
                            href="/portal/donors/donor-appointments"
                        >
                            View List
                        </Link>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <CalendarArrowUp className="w-6 h-6" />
                            Next Eligible Donation
                        </CardTitle>
                        <CardDescription>Days to Go</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <h2 className="text-4xl font-bold text-blue-500 text-shadow-lg/25 text-shadow-blue-400">
                            {dashboardIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>{dashboard?.days_remaining}</span>
                            )}
                        </h2>
                        <span className="p-2 italic text-link font-semibold text-lg text-blue-700 dark:text-blue-300 ">
                            {dashboard?.next_eligible_date
                                ? `${dashboard?.next_eligible_date}`
                                : ""}
                        </span>
                    </CardContent>
                </Card>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <Card className="w-full h-full">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Event Calendar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AllEventCalendar />
                        </CardContent>
                    </Card>
                </div>

                {/* Action Panel */}
                <div className="w-full">
                    <Card className="min-h-full">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Blood Donation Drives
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Link
                                    href="/portal/donors/events?tab=ongoing"
                                    className="btn btn-block justify-between text-green-500"
                                >
                                    Ongoing Blood Drives
                                    <FaArrowRight />
                                </Link>
                                <div className="max-h-60 overflow-y-auto mt-2 space-y-2 p-2">
                                    {eventIsLoading ? (
                                        <Skeleton_line />
                                    ) : !isError ? (
                                        <DashboardEventCardList
                                            events={events.filter(
                                                (event) =>
                                                    event.registration_status ==
                                                    "ongoing"
                                            )}
                                        />
                                    ) : (
                                        <div className="alert alert-error">
                                            {JSON.stringify(error)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="divider" />
                            <div>
                                <Link
                                    href="/portal/donors/events?tab=upcoming"
                                    className="btn btn-block justify-between text-orange-500"
                                >
                                    Upcoming Blood Drives
                                    <FaArrowRight />
                                </Link>
                                <div className="max-h-60 overflow-y-auto mt-2 space-y-2 p-2">
                                    {eventIsLoading ? (
                                        <Skeleton_line />
                                    ) : !isError ? (
                                        <DashboardEventCardList
                                            events={events.filter(
                                                (event) =>
                                                    event.registration_status ==
                                                    "not started"
                                            )}
                                        />
                                    ) : (
                                        <div className="alert alert-error">
                                            {JSON.stringify(error)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
