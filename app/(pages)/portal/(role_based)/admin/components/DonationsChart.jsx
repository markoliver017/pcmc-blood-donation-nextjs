"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function DonationsChart({ data, isLoading }) {
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <div className="skeleton h-8 w-1/3 mb-4"></div>
                </CardHeader>
                <CardContent>
                    <div className="skeleton h-96 w-full"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-x-auto">
            <CardHeader>
                <CardTitle>Donations Over Time (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="min-w-[400px]">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
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
                        <Line
                            type="monotone"
                            dataKey="donations"
                            stroke="#ef4444"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
