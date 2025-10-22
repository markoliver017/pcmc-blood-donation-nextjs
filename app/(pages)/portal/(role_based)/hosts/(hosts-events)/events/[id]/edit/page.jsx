import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getEventsById } from "@/action/hostEventAction";

import UpdateEventForm from "@components/events/UpdateEventForm";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import {
    ArrowLeft,
    ArrowLeftCircle,
    ArrowLeftIcon,
    Calendar,
    CalendarCheck,
} from "lucide-react";
import { BiLeftArrow } from "react-icons/bi";
import Link from "next/link";

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
                icon={
                    <Link href={`/portal/hosts/events`}>
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                }
                pageTitle={`Blood Donation Event`}
                breadcrumbs={[
                    {
                        path: `/portal/hosts/events`,
                        icon: <CalendarCheck className="w-4" />,
                        title: `Update Blood Donation Event`,
                    },
                ]}
            />
            <div className="w-full p-1 md:p-5 h-full md:w-9/10 2xl:w-3/4 mx-auto relative">
                <UpdateEventForm eventId={id} />
            </div>
        </HydrationBoundary>
    );
}
