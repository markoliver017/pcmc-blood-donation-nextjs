"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAgencyEventsAnalytics } from "@/action/hostEventAction";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@components/ui/loading";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#A4DE6C",
    "#D0ED57",
];

const STATUS_COLORS = {
    APPROVED: "#4CAF50",
    "FOR APPROVAL": "#FFC107",
    REJECTED: "#F44336",
    CANCELLED: "#9E9E9E",
};

export default function EventsAnalytics() {
    const {
        data: analyticsData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["agency-events-analytics"],
        queryFn: async () => {
            const res = await getAgencyEventsAnalytics();
            if (!res.success) {
                throw new Error(
                    res.message || "Failed to fetch analytics data"
                );
            }
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        Error Loading Analytics
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {error.message}
                    </p>
                    <Button onClick={() => refetch()} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Events Analytics</h2>
                <Button
                    onClick={() => refetch()}
                    variant="outline"
                    size="sm"
                    className="ring-offset-2 ring-offset-white dark:ring-offset-black hover:ring-2 hover:ring-blue-400"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Events Over Time */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Events Over Time (Last 12 Months)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={analyticsData?.eventsOverTime || []}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="count"
                                    name="Number of Events"
                                    fill="#8884d8"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Event Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={
                                        analyticsData?.statusDistribution || []
                                    }
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({
                                        cx,
                                        cy,
                                        midAngle,
                                        innerRadius,
                                        outerRadius,
                                        percent,
                                        index,
                                        name,
                                    }) => {
                                        const item =
                                            analyticsData?.statusDistribution[
                                                index
                                            ];
                                        return `${item.status} (${(
                                            percent * 100
                                        ).toFixed(0)}%)`;
                                    }}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {analyticsData?.statusDistribution?.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    STATUS_COLORS[
                                                        entry.status
                                                    ] ||
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Participant Trends */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>
                            Participant Trends (Last 6 Months)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={analyticsData?.participantTrends || []}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Number of Participants"
                                    stroke="#82ca9d"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Blood Type Distribution */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Blood Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={
                                        analyticsData?.bloodTypeDistribution ||
                                        []
                                    }
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({
                                        cx,
                                        cy,
                                        midAngle,
                                        innerRadius,
                                        outerRadius,
                                        percent,
                                        index,
                                    }) => {
                                        const item =
                                            analyticsData
                                                ?.bloodTypeDistribution[index];
                                        return `${item.bloodType} (${(
                                            percent * 100
                                        ).toFixed(0)}%)`;
                                    }}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="bloodType"
                                >
                                    {analyticsData?.bloodTypeDistribution?.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Blood Type Breakdown */}
                        {(() => {
                            const total =
                                analyticsData.bloodTypeDistribution.reduce(
                                    (sum, item) => sum + item.count,
                                    0
                                );
                            return (
                                <div className="mt-6 space-y-3">
                                    {analyticsData.bloodTypeDistribution.map(
                                        (item, index) => {
                                            const percent =
                                                total > 0
                                                    ? (item.count / total) * 100
                                                    : 0;
                                            return (
                                                <div
                                                    key={item.bloodType}
                                                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border bg-muted/50"
                                                >
                                                    <div className="flex items-center gap-2 min-w-[90px]">
                                                        <div
                                                            className="w-5 h-5 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ],
                                                            }}
                                                        />
                                                        <span className="font-bold text-lg tracking-wide">
                                                            {item.bloodType}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-base">
                                                                {item.count}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                (
                                                                {percent.toFixed(
                                                                    1
                                                                )}
                                                                %)
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                                            <div
                                                                className="h-2 rounded-full"
                                                                style={{
                                                                    width: `${percent}%`,
                                                                    backgroundColor:
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ],
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
