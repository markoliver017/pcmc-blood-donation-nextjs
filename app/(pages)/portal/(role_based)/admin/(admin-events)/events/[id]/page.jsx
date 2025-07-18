import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { getEventsById } from "@/action/hostEventAction";

import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { IoInformation } from "react-icons/io5";
import ShowEvents1 from "@components/events/ShowEvents";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["agency_events", id],
        queryFn: async () => await getEventsById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WrapperHeadMain
                icon={<CalendarCheck />}
                pageTitle="Blood Drive Details"
                breadcrumbs={[
                    {
                        path: "/portal/admin/events",
                        icon: <CalendarCheck className="w-4" />,
                        title: "Blood Drives",
                    },
                    {
                        path: `/portal/admin/events/${id}`,
                        icon: <IoInformation className="w-4" />,
                        title: "Blood Drive Details",
                    },
                ]}
            />
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link
                    href="/portal/admin/events"
                    className="absolute top-5 right-4"
                >
                    <button
                        className="btn btn-circle btn-default w-max p-3"
                        tabIndex={-1}
                    >
                        <ArrowLeft />
                        <span className="hidden sm:inline-block">
                            Back
                        </span>{" "}
                    </button>
                </Link>
                <ShowEvents1 eventId={id} />
            </div>
        </HydrationBoundary>
    );
}
