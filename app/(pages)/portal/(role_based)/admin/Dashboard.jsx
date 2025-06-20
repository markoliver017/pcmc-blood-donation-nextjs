"use client";
import AllEventCalendar from "@components/organizers/AllEventCalendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    CalendarArrowUp,
    CalendarCheck2,
    HandCoins,
    Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { MdBloodtype } from "react-icons/md";
import {
    getApprovedEventsByAgency,
    getDonorDashboard,
} from "@/action/donorAction";
import DashboardEventCardList from "@components/dashboard/DashboardEventCardList";
import Skeleton_line from "@components/ui/skeleton_line";
import {
    getAdminDashboard,
    getForApprovalEvents,
} from "@/action/adminEventAction";
import { BiBuildings } from "react-icons/bi";
import ForApprovalEventList from "./(admin-events)/events/@approval/ForApprovalEventList";
import ForApprovalAgencyList from "./(agencies)/agencies/@approval/ForApprovalAgencyList";

export default function Dashboard() {
    const { data: dashboard, isLoading: dashboardIsLoading } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: async () => {
            const res = await getAdminDashboard();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const {
        data: events,
        isLoading: eventIsLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["for-approval-blood-drives"],
        queryFn: async () => {
            const res = await getForApprovalEvents();

            if (!res.success) {
                throw res?.message || "unknown error";
            }
            return res.data;
        },
    });

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="w-full">
                    <CardHeader className="flex flex-col items-center gap-2 ">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Users className="w-6 h-6" />
                            Registered Donors
                        </CardTitle>
                        <CardDescription>
                            Total number of registered donors
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <h2 className="text-4xl font-bold text-red-500 text-shadow-lg/25 text-shadow-red-400">
                            {dashboardIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>{dashboard?.donorCount || 0}</span>
                            )}
                        </h2>
                        <Link
                            className="btn btn-primary btn-outline"
                            href="/portal/admin/donors"
                        >
                            View List
                        </Link>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <HandCoins className="w-6 h-6" />
                            Blood Donations
                        </CardTitle>
                        <CardDescription>
                            Track successful donations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <h2 className="text-4xl font-bold text-red-500 text-shadow-lg/25 text-shadow-red-400">
                            {dashboardIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>{dashboard?.donationCount || "0"}</span>
                            )}
                        </h2>
                        <Link
                            className="btn btn-primary btn-outline"
                            href="/portal/admin/events"
                        >
                            View List
                        </Link>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <HandCoins className="w-6 h-6" />
                            Blood Drives
                        </CardTitle>
                        <CardDescription>
                            Count of all approved blood donation events.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <h2 className="text-4xl font-bold text-red-500 text-shadow-lg/25 text-shadow-red-400">
                            {dashboardIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>{dashboard?.eventCount || "0"}</span>
                            )}
                        </h2>
                        <Link
                            className="btn btn-primary btn-outline"
                            href="/portal/admin/events"
                        >
                            View List
                        </Link>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <BiBuildings className="w-6 h-6" />
                            Partner Agencies
                        </CardTitle>
                        <CardDescription>
                            Know your partner agencies
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <h2 className="text-4xl font-bold text-red-500 text-shadow-lg/25 text-shadow-red-400">
                            {dashboardIsLoading ? (
                                <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                            ) : (
                                <span>{dashboard?.agencyCount}</span>
                            )}
                        </h2>
                        <Link
                            className="btn btn-primary btn-outline"
                            href="/portal/admin/agencies"
                        >
                            View List
                        </Link>
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
                                Action Needed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Link
                                    href="/portal/admin/events?tab=for-approval"
                                    className="btn btn-block justify-between text-orange-800 dark:text-orange-400"
                                >
                                    For Approval - Blood Drives
                                    <FaArrowRight />
                                </Link>
                                <div className="max-h-72 overflow-y-auto mt-2 space-y-2 p-2">
                                    <ForApprovalEventList target="_blank" />
                                </div>
                            </div>
                            <div className="divider" />
                            <div>
                                <Link
                                    href="/portal/admin/agencies?tab=for-approval"
                                    className="btn btn-block justify-between text-orange-800 dark:text-orange-400"
                                >
                                    For Approval - Agencies
                                    <FaArrowRight />
                                </Link>
                                <div className="max-h-72 overflow-y-auto mt-2 space-y-2 p-2">
                                    <ForApprovalAgencyList target="_blank" />
                                </div>
                            </div>
                            {/* <div className="divider" />
                            <div>
                                <Link
                                    href="/portal/admin/events?tab=for-approval"
                                    className="btn btn-block justify-between text-orange-800 dark:text-orange-400"
                                >
                                    For Approval - Blood Drives (
                                    {events?.length})
                                    <FaArrowRight />
                                </Link>
                                <div className="max-h-60 overflow-y-auto mt-2 space-y-2 p-2">
                                    {eventIsLoading ? (
                                        <Skeleton_line />
                                    ) : !isError ? (
                                        <DashboardEventCardList
                                            events={events}
                                        />
                                    ) : (
                                        <div className="alert alert-error">
                                            {JSON.stringify(error)}
                                        </div>
                                    )}
                                </div>
                            </div> */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
