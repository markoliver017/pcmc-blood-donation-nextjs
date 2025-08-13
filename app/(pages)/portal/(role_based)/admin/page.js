import { auth } from "@lib/auth";
import { Suspense } from "react";
import Dashboard from "./Dashboard";
import DashboardSkeleton from "./DashboardSkeleton";
import getQueryClient from "@lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getDashboardData } from "@/action/adminDashboardAction";
import { queryKeys } from "@lib/queryKeys";
import { LogIn } from "lucide-react";
import { PiHandHeart } from "react-icons/pi";
import StarRating from "@components/reusable_components/StarRating";
import { DonorAppointmentInfo, sequelize } from "@lib/models";
import { Op } from "sequelize";

export const metadata = {
    title: "Admin Dashboard",
};

export default async function page() {
    const session = await auth();
    if (!session) throw "You are not allowed to access this page.";
    const { user } = session;
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: queryKeys.adminDashboard,
        queryFn: async () => {
            const res = await getDashboardData();
            if (!res.success) {
                // In a real app, you'd want to handle this error more gracefully
                console.error("Failed to fetch dashboard data:", res.message);
                return null;
            }
            return res.data;
        },
    });

    const { participantOverallFeedback } = await DonorAppointmentInfo.findOne({
        where: {
            status: { [Op.notIn]: ["cancelled"] },
            feedback_average: { [Op.not]: null },
        },
        attributes: [
            [
                sequelize.fn("AVG", sequelize.col("feedback_average")),
                "participantOverallFeedback",
            ],
        ],
        raw: true,
    });

    return (
        <div className="p-1 md:p-5 overflow-scroll">
            <div className="flex flex-wrap gap-2 justify-between items-center border-b border-gray-200 dark:border-gray-800">
                <div className="font-bold">
                    <h1 className="text-base md:text-3xl flex-items-center">
                        <PiHandHeart /> WELCOME, {user.name}
                    </h1>
                    <h2 className="flex-items-center">
                        <LogIn className="h-4 w-4" /> Logged In as :{" "}
                        {user?.role_name || "Donor"}
                    </h2>
                </div>
                <div className="flex items-center flex-none gap-2 p-2 rounded-md bg-base-300">
                    <span className="text-sm font-medium">Overall Rating:</span>
                    <StarRating rating={participantOverallFeedback || 0} />
                </div>
            </div>

            <div className="py-2">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Suspense fallback={<DashboardSkeleton />}>
                        <Dashboard />
                    </Suspense>
                </HydrationBoundary>
            </div>
        </div>
    );
}
