import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import InterceptModal from "@components/layout/InterceptModal";
import { getEventsById } from "@/action/hostEventAction";
import ShowEvents from "@components/events/ShowEvents";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["agency_events", id],
        queryFn: async () => await getEventsById(id),
    });

    return (
        <InterceptModal>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="w-full md:w-9/10 2xl:w-8-10 mx-auto shadow-lg">
                    <ShowEvents eventId={id} />
                </div>
            </HydrationBoundary>
        </InterceptModal>
    );
}
