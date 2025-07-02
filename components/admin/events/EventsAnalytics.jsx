"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";
import {
    Calendar,
    TrendingUp,
    Users,
    Award,
    Activity,
    RefreshCw,
} from "lucide-react";
import { getEventsAnalytics } from "@/action/adminEventAction";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@components/ui/button";

const COLORS = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#EC4899", // Pink
    "#84CC16", // Lime
    "#6366F1", // Indigo
];

const statusColors = {
    "FOR APPROVAL": "#F59E0B",
    APPROVED: "#10B981",
    REJECTED: "#EF4444",
    CANCELLED: "#6B7280",
};

// Leaderboard for Top Performing Agencies
const medalIcons = [
    <span key="gold" role="img" aria-label="gold">
        🥇
    </span>,
    <span key="silver" role="img" aria-label="silver">
        🥈
    </span>,
    <span key="bronze" role="img" aria-label="bronze">
        🥉
    </span>,
];

export default function EventsAnalytics() {
    const {
        data: analyticsData,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["events-analytics"],
        queryFn: async () => {
            const result = await getEventsAnalytics();
            if (!result.success) {
                throw new Error(
                    result.message || "Failed to fetch analytics data"
                );
            }
            return result.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-red-600">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">
                            Failed to load analytics
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {error?.message || "Unknown error"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!analyticsData) {
        return null;
    }

    return (
        <>
            <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                className={`absolute top-[-50px] right-0 ring-offset-2 ring-offset-white dark:ring-offset-black hover:ring-2 hover:ring-blue-400`}
            >
                <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="space-y-6">
                {/* Events Over Time Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                <CardTitle>Events Over Time</CardTitle>
                            </div>
                            <CardDescription>
                                Blood donation events created over the last 12
                                months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analyticsData.eventsOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "#3B82F6",
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Status Distribution and Agency Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-stretch">
                    {/* Status Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-green-600" />
                                    <CardTitle>
                                        Event Status Distribution
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    Distribution of events by approval status
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={
                                                analyticsData.statusDistribution
                                            }
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ status, percent }) =>
                                                `${status} ${(
                                                    percent * 100
                                                ).toFixed(0)}%`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {analyticsData.statusDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            statusColors[
                                                                entry.status
                                                            ] ||
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-2">
                                    {analyticsData.statusDistribution.map(
                                        (item, index) => (
                                            <div
                                                key={item.status}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                statusColors[
                                                                    item.status
                                                                ] ||
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ],
                                                        }}
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <Badge variant="secondary">
                                                    {item.count}
                                                </Badge>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Agency Performance Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-600" />
                                    <CardTitle>
                                        Top Performing Agencies
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    Agencies with the most events organized
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col ">
                                <div className="space-y-4">
                                    {analyticsData.agencyPerformance.length ===
                                        0 && (
                                        <div className="text-center text-muted-foreground py-8">
                                            No agency data available.
                                        </div>
                                    )}
                                    {analyticsData.agencyPerformance.map(
                                        (item, idx) => {
                                            const total =
                                                analyticsData.agencyPerformance.reduce(
                                                    (sum, a) =>
                                                        sum + a.eventCount,
                                                    0
                                                );
                                            const percent =
                                                total > 0
                                                    ? (item.eventCount /
                                                          total) *
                                                      100
                                                    : 0;
                                            return (
                                                <div
                                                    key={item.agency}
                                                    className="flex items-center gap-4"
                                                >
                                                    <div className="w-8 text-2xl flex-shrink-0 flex items-center justify-center">
                                                        {medalIcons[idx] ||
                                                            idx + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium text-base truncate max-w-[10rem]">
                                                                {item.agency}
                                                            </span>
                                                            <span className="font-bold text-lg text-purple-700">
                                                                {
                                                                    item.eventCount
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-purple-100 rounded-full mt-1">
                                                            <div
                                                                className="h-2 rounded-full bg-purple-500 transition-all"
                                                                style={{
                                                                    width: `${percent}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Participant Trends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-orange-600" />
                                <CardTitle>Participant Trends</CardTitle>
                            </div>
                            <CardDescription>
                                Donor participation trends over the last 6
                                months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart
                                    data={analyticsData.participantTrends}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#F97316"
                                        fill="#F97316"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Blood Type Distribution */}
                {analyticsData.bloodTypeDistribution.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-red-600" />
                                    <CardTitle>
                                        Blood Type Distribution
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    Distribution of donors by blood type
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={
                                                analyticsData.bloodTypeDistribution
                                            }
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ bloodType, percent }) =>
                                                `${bloodType} ${(
                                                    percent * 100
                                                ).toFixed(0)}%`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {analyticsData.bloodTypeDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "8px",
                                            }}
                                        />
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
                                                            ? (item.count /
                                                                  total) *
                                                              100
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
                                                                    {
                                                                        item.bloodType
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-base">
                                                                        {
                                                                            item.count
                                                                        }
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
                    </motion.div>
                )}
            </div>
        </>
    );
}
