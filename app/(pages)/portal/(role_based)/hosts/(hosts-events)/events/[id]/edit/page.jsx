import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getEventsById } from "@/action/hostEventAction";

import UpdateEventForm from "@components/events/UpdateEventForm";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["agency_events", id],
        queryFn: async () => await getEventsById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full p-5 h-full md:w-9/10 2xl:w-3/4 mx-auto relative">
                <UpdateEventForm eventId={id} />
            </div>
        </HydrationBoundary>
    );
}
