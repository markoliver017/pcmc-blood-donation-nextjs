import { Suspense } from "react";
import Skeleton from "@components/ui/skeleton";
import { MonthBarChart } from "./MonthBarChart";
import { PieChartComponent } from "./PieChart";
import { fetchMonthYearReports } from "./action";

export const metadata = {
    title: "Inmerse Portal - Dashboard",
    description:
        "Integrated National Medication Error Reporting System - Administrator Dashboard",
};

async function fetchErrorTypeReports() {
    const url = new URL(`/api/dashboard/error_type_count`, process.env.host);
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });
    return response.json();
}

export default function Page() {
    const error_type_reports = fetchErrorTypeReports();
    const month_year_reports = fetchMonthYearReports();

    return (
        <div className="flex flex-wrap gap-2">
            <Suspense fallback={<Skeleton className="flex-1" />}>
                <PieChartComponent reports={error_type_reports} />
            </Suspense>
            <Suspense fallback={<Skeleton className="flex-1" />}>
                <MonthBarChart reports={month_year_reports} />
            </Suspense>
        </div>
    );
}
