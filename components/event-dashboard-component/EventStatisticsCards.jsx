"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    Users,
    Clock,
    CheckCircle,
    Droplets,
    XCircle,
    TrendingUp,
    AlertTriangle,
    Activity,
} from "lucide-react";

export default function EventStatisticsCards({ statistics }) {
    if (!statistics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Total Registered",
            value: statistics.total_registered || 0,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            description: "Total donors registered",
            trend: null,
        },
        {
            title: "Pending Examination",
            value: statistics.pending_examination || 0,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            description: "Awaiting physical examination",
            trend: statistics.pending_examination > 0 ? "warning" : "success",
        },
        {
            title: "Examined",
            value: statistics.examined || 0,
            icon: Activity,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
            description: "Physical examination completed",
            trend: "neutral",
        },
        {
            title: "Blood Collected",
            value: statistics.collected || 0,
            icon: Droplets,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            description: "Successful blood collections",
            trend: "success",
        },
        {
            title: "Total Blood Volume",
            value: `${statistics.total_blood_volume || 0}ml`,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            description: "Total blood collected",
            trend: "success",
        },
        {
            title: "Success Rate",
            value: `${statistics.success_rate || 0}%`,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            description: "Collection success rate",
            trend:
                statistics.success_rate >= 80
                    ? "success"
                    : statistics.success_rate >= 60
                    ? "warning"
                    : "error",
        },
        {
            title: "Deferred",
            value: statistics.deferred || 0,
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            description: "Donors deferred",
            trend: statistics.deferred > 0 ? "error" : "success",
        },
        {
            title: "No Show",
            value: statistics.no_show || 0,
            icon: XCircle,
            color: "text-gray-600",
            bgColor: "bg-gray-50 dark:bg-gray-800",
            description: "Donors who didn't show",
            trend: statistics.no_show > 0 ? "error" : "success",
        },
    ];

    const getTrendIcon = (trend) => {
        switch (trend) {
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
            case "error":
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                    <Card
                        key={index}
                        className="hover:shadow-md transition-shadow duration-200"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                <IconComponent
                                    className={`h-4 w-4 ${card.color}`}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold">
                                        {card.value}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {card.description}
                                    </p>
                                </div>
                                {card.trend && getTrendIcon(card.trend)}
                            </div>

                            {/* Progress bar for success rate */}
                            {card.title === "Success Rate" && (
                                <div className="mt-3">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                statistics.success_rate >= 80
                                                    ? "bg-green-500"
                                                    : statistics.success_rate >=
                                                      60
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                            }`}
                                            style={{
                                                width: `${Math.min(
                                                    statistics.success_rate ||
                                                        0,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
