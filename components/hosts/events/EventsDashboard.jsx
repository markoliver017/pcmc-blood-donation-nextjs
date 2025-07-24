"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAgencyDashboard } from "@/action/hostEventAction";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
    Calendar,
    Users,
    Building,
    Droplets,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Plus,
    BarChart3,
    RefreshCw,
    LayoutDashboard,
    Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@components/ui/loading";
import numeral from "numeral";
import EventsAnalytics from "./EventsAnalytics";
import { useRouter, useSearchParams } from "next/navigation";

const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    subtitle,
    onClick,
    suffix = null,
}) => {
    const CardWrapper = onClick ? Button : Card;
    const cardProps = onClick
        ? {
            variant: "outline",
            className:
                "w-full h-full p-0 hover:shadow-md transition-all duration-200 cursor-pointer",
            onClick,
        }
        : {
            className: "hover:shadow-md transition-shadow duration-200",
        };

    return (
        <CardWrapper {...cardProps}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                            {title}
                        </p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold">
                                {numeral(value).format("0,0")}{" "}
                                <small>{suffix}</small>
                            </h3>
                            {trend && (
                                <Badge
                                    variant={
                                        trend > 0 ? "default" : "secondary"
                                    }
                                    className={`text-xs ${trend > 0
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {trend > 0 ? "+" : ""}
                                    {trend}%
                                </Badge>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
                    >
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </CardWrapper>
    );
};

const QuickActionCard = ({
    title,
    description,
    icon: Icon,
    onClick,
    variant = "default",
}) => {
    const variantStyles = {
        default:
            "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800",
        success:
            "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800",
        warning:
            "bg-yellow-50 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800",
    };

    return (
        <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${variantStyles[variant]}`}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-sm">{title}</h4>
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function EventsDashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("dashboardTab") || "overview";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("dashboardTab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };
    const {
        data: dashboardData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["agency-dashboard"],
        queryFn: async () => {
            const res = await getAgencyDashboard();
            if (!res.success) {
                throw new Error(
                    res.message || "Failed to fetch dashboard data"
                );
            }
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnMount: true,
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
                        Error Loading Dashboard
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

    const stats = [
        {
            title: "Total Events",
            value: dashboardData?.approvedEventCount || 0,
            icon: Calendar,
            color: "bg-blue-500",
            subtitle: "All blood donation events",
        },
        {
            title: "Active Events",
            value: dashboardData?.activeEventCount || 0,
            icon: TrendingUp,
            color: "bg-green-500",
            subtitle: "Approved events with ongoing registrations",
        },
        {
            title: "Pending Approval",
            value: dashboardData?.pendingApprovalCount || 0,
            icon: Clock,
            color: "bg-yellow-500",
            subtitle: "Awaiting review",
        },
        {
            title: "Total Participants",
            value: dashboardData?.totalParticipants || 0,
            icon: Users,
            color: "bg-purple-500",
            subtitle: "Registered donors",
        },
        {
            title: "Completion Rate",
            value: dashboardData?.successRate || 0,
            icon: CheckCircle,
            color: "bg-emerald-500",
            subtitle: "Completed events",
            suffix: "%",
        },
        {
            title: "Avg. Event Size",
            value: dashboardData?.averageParticipants || 0,
            icon: BarChart3,
            color: "bg-indigo-500",
            subtitle: "Participants per event",
        },
    ];

    const quickActions = [
        {
            title: "Ongoing Events",
            description: "Manage ongoing blood donation events",
            icon: Check,
            variant: "default",
            onClick: () =>
                (window.location.href = "/portal/hosts/events?tab=ongoing"),
        },
        {
            title: "View Analytics",
            description: "Detailed reports and insights",
            icon: BarChart3,
            variant: "success",
            onClick: () =>
            (window.location.href =
                "/portal/hosts/events?dashboardTab=analytics"),
        },
        {
            title: "Create New Event",
            description: "Schedule a new blood drive",
            icon: Plus,
            variant: "warning",
            onClick: () => router.push("/portal/hosts/events/create"),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Agency Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Overview of your agency's blood donation events and statistics
                    </p>
                </div>
            </div>

            <Tabs
                defaultValue={currentTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="flex gap-2 bg-muted/60 p-1 rounded-full shadow-sm w-max mx-auto mb-6">
                    <TabsTrigger
                        value="overview"
                        className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-700 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                        <LayoutDashboard className="h-5 w-5 mr-1" /> Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="flex items-center gap-2 px-6 py-2 rounded-full transition-colors font-semibold text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:bg-transparent data-[state=inactive]:text-purple-700 hover:bg-purple-100 focus-visible:ring-2 focus-visible:ring-purple-400"
                    >
                        <BarChart3 className="h-5 w-5 mr-1" /> Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="relative">
                    {/* Statistics Grid */}
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        size="sm"
                        className={`absolute top-[-50px] right-0 ring-offset-2 ring-offset-white dark:ring-offset-black hover:ring-2 hover:ring-blue-400`}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                    }}
                                >
                                    <StatCard
                                        title={stat.title}
                                        value={stat.value}
                                        icon={stat.icon}
                                        color={stat.color}
                                        subtitle={stat.subtitle}
                                        trend={stat.trend}
                                        suffix={stat.suffix}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {quickActions.map((action, index) => (
                                    <motion.div
                                        key={action.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                        }}
                                    >
                                        <QuickActionCard
                                            title={action.title}
                                            description={action.description}
                                            icon={action.icon}
                                            variant={action.variant}
                                            onClick={action.onClick}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Agency Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">
                                                Total Events
                                            </span>
                                            <span className="font-semibold">
                                                {numeral(
                                                    dashboardData?.totalEventCount ||
                                                    0
                                                ).format("0,0")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">
                                                Recent Events (30 days)
                                            </span>
                                            <span className="font-semibold">
                                                {numeral(
                                                    dashboardData?.recentEventCount ||
                                                    0
                                                ).format("0,0")}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Droplets className="h-5 w-5" />
                                        Donation Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">
                                                Total Donors
                                            </span>
                                            <span className="font-semibold">
                                                {numeral(
                                                    dashboardData?.donorCount ||
                                                    0
                                                ).format("0,0")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">
                                                Total Donations
                                            </span>
                                            <span className="font-semibold">
                                                {numeral(
                                                    dashboardData?.donationCount ||
                                                    0
                                                ).format("0,0")}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="relative">
                    <EventsAnalytics />
                </TabsContent>
            </Tabs>
        </div>
    );
}