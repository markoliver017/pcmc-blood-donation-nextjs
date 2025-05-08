"use client";
import { use, useEffect, useState } from "react";
import { PieChartComponent } from "./PieChart";
import { MonthBarChart } from "./MonthBarChart";

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

export default function Dashboard({ reports }) {
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
        <div className="flex flex-wrap gap-2">
            {/* Dashboard Page */}
            <PieChartComponent
                chartData={chartData}
                chartConfig={chartConfig}
                total={total}
            />
            {/* <BarChart
                chartData={chartData}
                chartConfig={chartConfig}
                total={total}
            /> */}
            <MonthBarChart />
            {/* <Chart data={data} /> */}
        </div>
    );
}
