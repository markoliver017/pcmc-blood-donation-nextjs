import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@lib/auth";
import { getEventDashboardData } from "@action/adminEventAction";
import EventDashboardClient from "@components/event-dashboard-component/EventDashboardClient";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

export default async function EventDashboardPage({ params }) {
    const paramsData = await params;
    const session = await auth();

    // Check authentication
    if (!session) {
        redirect("/auth/login");
    }

    // Check if user is admin
    if (session.user.role_name !== "Admin") {
        redirect("/portal");
    }

    const eventId = paramsData.id;

    if (!eventId) {
        notFound();
    }

    const queryClient = new QueryClient();

    try {
        // Prefetch event dashboard data
        await queryClient.prefetchQuery({
            queryKey: ["event-dashboard", eventId],
            queryFn: async () => {
                const res = await getEventDashboardData(eventId);
                if (!res.success) {
                    throw res;
                }
                return res.data;
            },
        });

        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <EventDashboardClient eventId={eventId}
                        roleName={session.user.role_name}
                    />
                </div>
            </HydrationBoundary>
        );
    } catch (error) {
        console.error("Error loading event dashboard:", error);

        // Handle specific error cases
        if (
            error.message?.includes("not found") ||
            error.message?.includes("404")
        ) {
            notFound();
        }

        // For other errors, show error page
        throw new Error(
            "Failed to load event dashboard. Please try again later."
        );
    }
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
    const paramsData = await params;
    try {
        const dashboardData = await getEventDashboardData(paramsData.id);

        if (!dashboardData.success || !dashboardData.data.event) {
            return {
                title: "Event Dashboard - Blood Bank Portal",
                description: "Event dashboard for blood donation events",
            };
        }

        const { event } = dashboardData.data;

        return {
            title: `${event.title} - Event Dashboard | Blood Bank Portal`,
            description: `Dashboard for blood donation event: ${event.title
                } on ${new Date(event.event_date).toLocaleDateString()}`,
            keywords: [
                "blood donation",
                "event dashboard",
                "admin",
                "blood bank",
            ],
            openGraph: {
                title: `${event.title} - Event Dashboard`,
                description: `Manage and track blood donation event: ${event.title}`,
                type: "website",
            },
        };
    } catch (error) {
        return {
            title: "Event Dashboard - Blood Bank Portal",
            description: "Event dashboard for blood donation events",
        };
    }
}
