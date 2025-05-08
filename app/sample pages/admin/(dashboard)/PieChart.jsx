"use client";

import { PieChartIcon } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@components/ui/chart";
import { use, useEffect, useState } from "react";

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

export function PieChartComponent({ reports }) {
    // const { chartData, chartConfig, total } = reports;
    const { data, total } = use(reports);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const generateChartData = () => {
            return data.map((report) => ({
                ...report,
                name: report.name + " - " + report.count,
                fill: getRandomColor(),
            }));
        };

        setChartData(generateChartData());
    }, [data]);

    const chartConfig = data.reduce(
        (acc, curr) => {
            acc[curr.name] = {
                label: curr.name,
            };
            return acc;
        },
        {
            count: {
                label: "No of reports",
            },
        }
    );

    if (!chartData.length) return null;

    return (
        <Card className="w-full md:w-96">
            <CardHeader className="items-center pb-0">
                <CardTitle>INMERS </CardTitle>
                <CardDescription>Medication Error Report Chart</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    nameKey="count"
                                    hideLabel
                                />
                            }
                        />
                        <Pie data={chartData} dataKey="count">
                            <LabelList
                                dataKey="name"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value) => chartConfig[value]?.label}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    INMERS
                    <PieChartIcon className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total number of reports ({total})
                </div>
                <div>
                    <ul className="list-none">
                        {chartData.map((report) => (
                            <li key={report.id} className="flex items-center">
                                <span
                                    style={{ backgroundColor: report.fill }}
                                    className=" mr-2 h-2 w-3"
                                ></span>
                                {report.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardFooter>
        </Card>
    );
}
