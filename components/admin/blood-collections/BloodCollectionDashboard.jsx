"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import {
    Heart,
    Droplets,
    Users,
    Calendar,
    TrendingUp,
    Activity,
} from "lucide-react";
import {
    getAllBloodCollections,
    getAllDonorsBloodCollections,
} from "@/action/bloodCollectionAction";
import { getAllBloodDonationHistoryCount } from "@/action/bloodDonationHistoryAction";

const BloodCollectionDashboard = () => {
    const { data: bloodCollections, isLoading: collectionsLoading } = useQuery({
        queryKey: ["blood_donations"],
        queryFn: async () => {
            const res = await getAllBloodCollections();
            if (!res.success) throw res;
            return res.data;
        },
    });
    const { data: bloodCollectionsHistory } = useQuery({
        queryKey: ["blood_donations_history"],
        queryFn: async () => {
            const res = await getAllBloodDonationHistoryCount();
            if (!res.success) throw res;
            return res.data;
        },
    });

    const { data: donorCollections, isLoading: donorsLoading } = useQuery({
        queryKey: ["donor_blood_collections"],
        queryFn: async () => {
            const res = await getAllDonorsBloodCollections();
            if (!res.success) throw res;
            return res.data;
        },
    });

    // Calculate metrics
    const calculateMetrics = () => {
        if (!bloodCollections || !donorCollections) {
            return {
                totalCollections: 0,
                totalVolume: 0,
                uniqueDonors: 0,
                averageVolume: 0,
                todayCollections: 0,
                thisMonthCollections: 0,
            };
        }

        const today = new Date();
        const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
        );

        const totalCollections = bloodCollections.length;
        const totalVolume = bloodCollections.reduce(
            (sum, collection) => sum + (parseFloat(collection.volume) || 0),
            0
        );
        const uniqueDonors = new Set(
            bloodCollections.map((collection) => collection.donor_id)
        ).size;
        const averageVolume =
            totalCollections > 0 ? totalVolume / totalCollections : 0;

        const todayCollections = bloodCollections.filter((collection) => {
            const collectionDate = new Date(collection?.event?.date);

            return (
                collectionDate.getFullYear() === today.getFullYear() &&
                collectionDate.getMonth() === today.getMonth() &&
                collectionDate.getDate() === today.getDate()
            );
        }).length;

        const thisMonthCollections = bloodCollections.filter((collection) => {
            const collectionDate = new Date(collection?.event?.date);
            return (
                collectionDate >= startOfMonth && collectionDate <= endOfMonth
            );
        }).length;

        return {
            totalCollections,
            totalVolume,
            uniqueDonors,
            averageVolume,
            todayCollections,
            thisMonthCollections,
        };
    };

    const metrics = calculateMetrics();
    const isLoading = collectionsLoading || donorsLoading;

    const MetricCard = ({
        title,
        value,
        icon: Icon,
        subtitle,
        trend,
        color = "blue",
    }) => (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {title}
                </CardTitle>
                <Icon className={`h-4 w-4 text-${color}-600`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isLoading ? (
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                        value
                    )}
                </div>
                {subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {subtitle}
                    </p>
                )}
                {trend && (
                    <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium">
                            {trend}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <MetricCard
                title="Total Collections"
                value={metrics.totalCollections.toLocaleString()}
                icon={Heart}
                subtitle="All time blood collections"
                color="red"
            />

            <MetricCard
                title="Total Volume"
                value={`${Math.round(metrics.totalVolume).toLocaleString()} mL`}
                icon={Droplets}
                subtitle="Total blood collected"
                color="blue"
            />

            <MetricCard
                title="Unique Donors"
                value={metrics.uniqueDonors.toLocaleString()}
                icon={Users}
                subtitle="Active blood donors"
                color="green"
            />

            <MetricCard
                title="Average Volume"
                value={`${Math.round(metrics.averageVolume)} mL`}
                icon={Activity}
                subtitle="Per collection"
                color="purple"
            />

            <MetricCard
                title="Today's Collections"
                value={metrics.todayCollections.toLocaleString()}
                icon={Calendar}
                subtitle="Collections today"
                trend={
                    metrics.todayCollections > 0
                        ? `+${metrics.todayCollections} today`
                        : null
                }
                color="orange"
            />

            <MetricCard
                title="This Month"
                value={metrics.thisMonthCollections.toLocaleString()}
                icon={TrendingUp}
                subtitle="Monthly collections"
                trend={
                    metrics.thisMonthCollections > 0
                        ? `${metrics.thisMonthCollections} this month`
                        : null
                }
                color="indigo"
            />
        </div>
    );
};

export default BloodCollectionDashboard;
