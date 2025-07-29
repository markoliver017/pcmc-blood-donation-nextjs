"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    Calendar,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { useMemo } from "react";

/**
 * Dashboard stats component for appointments overview
 * @param {Object} props - Component props
 * @param {Array} props.appointments - Array of appointment data
 * @returns {JSX.Element} Dashboard stats component
 */
export default function DashboardStats({ appointments = [] }) {
    const stats = useMemo(() => {
        // The appointments are pre-filtered by the parent component (AppointmentList)
        // based on the selected date range. This component now only needs to count them.

        const statusCounts = appointments.reduce((acc, appointment) => {
            const status = appointment.status || "registered";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return {
            total: appointments.length,
            registered: statusCounts.registered || 0,
            examined: statusCounts.examined || 0,
            collected: statusCounts.collected || 0,
            cancelled: statusCounts.cancelled || 0,
            deferred: statusCounts.deferred || 0,
            noShow: statusCounts["no show"] || 0,
        };
    }, [appointments]);

    const statCards = [
        {
            title: "Total Appointments",
            value: stats.total,
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Registered",
            value: stats.registered,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Examined",
            value: stats.examined,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Collected",
            value: stats.collected,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Cancelled/No Show",
            value: stats.cancelled + stats.noShow,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "Deferred",
            value: stats.deferred,
            icon: AlertTriangle,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <Card
                        key={index}
                        className="hover:shadow-md transition-shadow"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <IconComponent
                                    className={`h-4 w-4 ${stat.color}`}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
