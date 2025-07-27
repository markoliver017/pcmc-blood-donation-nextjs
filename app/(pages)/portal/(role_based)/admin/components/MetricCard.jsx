"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import Link from "next/link";

export default function MetricCard({ icon, title, description, value, link, isLoading }) {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col items-center gap-2 ">
                <CardTitle className="text-2xl flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <h2 className="text-4xl font-bold text-red-500 text-shadow-lg/25 text-shadow-red-400">
                    {isLoading ? (
                        <div className="skeleton h-12 w-20 shrink-0 rounded-full"></div>
                    ) : (
                        <span>{value}</span>
                    )}
                </h2>
                <Link
                    className="btn btn-primary btn-outline"
                    href={link}
                >
                    View List
                </Link>
            </CardContent>
        </Card>
    );
}
