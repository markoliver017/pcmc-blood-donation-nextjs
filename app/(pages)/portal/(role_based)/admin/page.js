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

    return (
        <div className="p-5 overflow-scroll">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-3xl flex-items-center">
                        <PiHandHeart /> WELCOME, {user.name}
                    </h1>
                    <h2 className="flex-items-center">
                        <LogIn className="h-4" /> Logged In as :{" "}
                        {user?.role_name || "Donor"}
                    </h2>
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
