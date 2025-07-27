"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19FFD1', '#FFD119'];

export default function BloodTypeDistributionChart({ data, isLoading }) {
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
        <Card>
            <CardHeader>
                <CardTitle>Blood Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={(entry) => `${entry.name} (${entry.value})`}
                        >
                            {data?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
