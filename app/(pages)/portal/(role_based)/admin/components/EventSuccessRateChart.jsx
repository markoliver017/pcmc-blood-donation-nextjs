"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function EventSuccessRateChart({ data, isLoading }) {
    if (isLoading) {
        return (
            <Card className="w-full lg:col-span-2">
                <CardHeader>
                    <div className="skeleton h-8 w-1/3 mb-4"></div>
                </CardHeader>
                <CardContent>
                    <div className="skeleton h-96 w-full"></div>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Blood Type Distribution </CardTitle>
                </CardHeader>
                <CardContent className="">
                    <div className="flex items-center justify-center h-96">
                        <p className="text-gray-500">No data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="lg:col-span-2 overflow-x-auto">
            <CardHeader>
                <CardTitle>Event Success Rate (Last 5 Events)</CardTitle>
            </CardHeader>
            <CardContent className="min-w-[600px]">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="participants"
                            fill="#8884d8"
                            name="Participants"
                        />
                        <Bar
                            dataKey="donations"
                            fill="#82ca9d"
                            name="Successful Donations"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
