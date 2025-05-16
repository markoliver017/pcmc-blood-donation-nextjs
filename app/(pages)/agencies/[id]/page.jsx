import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { fetchAgency } from "@/action/agencyAction";
import ShowAgency from "./ShowAgency";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["agency", id],
        queryFn: async () => {
            const res = await fetchAgency(id);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full md:w-8/10 lg:w-3/4 mx-auto">
                <ShowAgency agencyId={id} />
            </div>
        </HydrationBoundary>
    );
}
