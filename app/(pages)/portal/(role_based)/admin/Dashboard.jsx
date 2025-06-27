"use client";
import AllEventCalendar from "@components/organizers/AllEventCalendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Calendar, HandCoins, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "@/action/adminEventAction";
import { BiBuildings } from "react-icons/bi";
import ForApprovalEventList from "./(admin-events)/events/(index)/ForApprovalEventList";
import ForApprovalAgencyList from "./(agencies)/agencies/(index)/ForApprovalAgencyList";
import { fetchAgencyByStatus } from "@/action/agencyAction";
import { getLastDonationExamData } from "@/action/donorAction";

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
        staleTime: 5 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
    });

    const {
        data: forApprovalAgencies,
        isLoading: forApprovalAgencyIsFetching,
    } = useQuery({
        queryKey: ["agencies", "for approval"],
        queryFn: async () => fetchAgencyByStatus("for approval"),
        staleTime: 5 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
    });
    const { data } = useQuery({
        queryKey: ["getLastDonationExamStatus"],
        queryFn: async () =>
            getLastDonationExamData("354043dd-2394-42a6-8b7f-3e954d5835ce"),
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
                            href="/portal/admin/blood-donations"
                        >
                            View List
                        </Link>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Calendar className="w-6 h-6" />
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
                    <Card className="w-full">
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
                    <Card>
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
                                <div className="max-h-72 overflow-y-auto mt-2 flex flex-col gap-4 p-2">
                                    <ForApprovalEventList target="_blank" />
                                </div>
                            </div>
                            <div className="divider" />
                            <div>
                                <Link
                                    href="/portal/admin/agencies?tab=for-approval"
                                    className="btn btn-block justify-between text-orange-800 dark:text-orange-400"
                                >
                                    For Approval - Agencies (
                                    {forApprovalAgencies?.length || 0})
                                    <FaArrowRight />
                                </Link>
                                <div className="max-h-72 overflow-y-auto mt-2 flex flex-col gap-4 p-2">
                                    <ForApprovalAgencyList
                                        agencies={forApprovalAgencies}
                                        isFetching={forApprovalAgencyIsFetching}
                                        target="_blank"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
