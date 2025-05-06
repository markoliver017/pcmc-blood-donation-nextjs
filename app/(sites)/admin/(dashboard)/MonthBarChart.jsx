"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@components/ui/chart";
import { use, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import YearPicker from "@components/reusable_components/YearPicker";
import { fetchMonthYearReports } from "./action";
import Skeleton from "@components/ui/skeleton";

const defaultMonths = [
    { month: "January", count: 0 },
    { month: "February", count: 0 },
    { month: "March", count: 0 },
    { month: "April", count: 0 },
    { month: "May", count: 0 },
    { month: "June", count: 0 },
    { month: "July", count: 0 },
    { month: "August", count: 0 },
    { month: "September", count: 0 },
    { month: "October", count: 0 },
    { month: "November", count: 0 },
    { month: "December", count: 0 },
];

const chartConfig = {
    count: {
        label: "Reports",
        color: "hsl(var(--chart-1))",
    },
};

export function MonthBarChart({ reports }) {
    const { data, total, error } = use(reports);
    const [year, setYear] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const [chartData, setChartData] = useState(() => {
        if (error) return defaultMonths;
        return data.reduce((acc, current) => {
            const monthIndex = acc.findIndex(
                (item) => item.month === current.month
            );
            acc[monthIndex].count = current.count;
            return acc;
        }, defaultMonths);
    });

    const [totalReports, setTotalReports] = useState(total);
    const prevYear = useRef(year.getFullYear());

    useEffect(() => {
        if (prevYear.current == year.getFullYear()) {
            // console.log("skipppppppppppp", prevYear.current);
            return; // 🔕 Skip first render
        }

        prevYear.current = year.getFullYear();
        setIsLoading(true);
        const fetchReports = async () => {
            const res = await fetchMonthYearReports(year.getFullYear());
            const json = await res;
            // console.log("json>>>>>>>>>>>>>", json);
            const { data, total } = json;

            const updatedData = defaultMonths.map((month) => {
                const match = data.find((d) => d.month === month.month);
                return {
                    ...month,
                    count: match ? match.count : 0,
                };
            });

            setChartData(updatedData);
            setTotalReports(total);
            setIsLoading(false);
        };

        fetchReports();
    }, [year]);

    const { systemTheme } = useTheme();
    const labelFill = systemTheme === "dark" ? "white" : "black";
    const barFill = systemTheme === "dark" ? "blue" : "black";

    if (isLoading) {
        return <Skeleton className="w-full h-80 rounded-xl" />;
    }

    return (
        <Card className="flex-1 flex flex-col justify-between min-w-96">
            <CardHeader>
                <CardTitle>
                    <div className="flex justify-between items-center">
                        <p>
                            Integrated National Medication Error Reporting
                            System
                        </p>
                        <div className="flex justify-center items-base gap-1">
                            <h1 className="text-xl">Select a Year:</h1>
                            <YearPicker
                                selectedYear={year}
                                onChange={setYear}
                            />
                        </div>
                    </div>
                </CardTitle>
                <CardDescription>
                    January - December {year.getFullYear()} ({totalReports || 0}{" "}
                    reports)
                </CardDescription>
                {/* <div>
                    <h1 className="text-xl mb-4">Select a Year:</h1>
                    <p className="mt-4">Selected Year: {year.getFullYear()}</p>
                </div> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 30,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" fill={barFill} radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                style={{ fill: labelFill }}
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                </div> */}
                <div className="leading-none text-muted-foreground">
                    Showing total reports per month for the the selected year
                </div>
            </CardFooter>
        </Card>
    );
}
