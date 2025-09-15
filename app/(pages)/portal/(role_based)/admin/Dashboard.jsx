"use client";
import dynamic from "next/dynamic";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Calendar, HandCoins, Users } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "@/action/adminDashboardAction";
import { BiBuildings } from "react-icons/bi";
import ActionPanel from "./components/ActionPanel";
import DonationsChart from "./components/DonationsChart";
import BloodTypeDistributionChart from "./components/BloodTypeDistributionChart";
import EventSuccessRateChart from "./components/EventSuccessRateChart";

const AllEventCalendar = dynamic(
    () => import("@components/organizers/AllEventCalendar"),
    {
        loading: () => <div className="skeleton h-96 w-full"></div>,
        ssr: false,
    }
);

export default function Dashboard() {
    const { data: dashboard, isLoading: dashboardIsLoading } = useQuery({
        queryKey: ["admin-dashboard-data"],
        queryFn: async () => {
            const res = await getDashboardData();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                <span>{dashboard?.donationCount || 0}</span>
                            )}
                        </h2>
                        <Link
                            className="btn btn-primary btn-outline"
                            href="/portal/admin/blood-collections"
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
                                <span>{dashboard?.activeEventCount || 0}</span>
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
                                <span>{dashboard?.agencyCount || 0}</span>
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

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonationsChart
                    data={dashboard?.donationsByMonth}
                    isLoading={dashboardIsLoading}
                />
                <BloodTypeDistributionChart
                    data={dashboard?.bloodTypeDistribution}
                    isLoading={dashboardIsLoading}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EventSuccessRateChart
                    data={dashboard?.eventSuccessData}
                    isLoading={dashboardIsLoading}
                />
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <Card className="w-full overflow-x-auto">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Event Calendar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="min-w-[600px]">
                            <AllEventCalendar />
                        </CardContent>
                    </Card>
                </div>

                {/* Action Panel */}
                <div className="w-full">
                    <ActionPanel
                        events={dashboard?.forApprovalEvents}
                        agencies={dashboard?.forApprovalAgencies}
                        isLoading={dashboardIsLoading}
                    />
                </div>
            </div>
        </div>
    );
}
