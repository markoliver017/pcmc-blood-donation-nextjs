import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

import { fetchluzonDemographics } from "@/action/locationAction";
import AgencyUpdateForm from "./AgencyUpdateForm";
import { fetchAgency } from "@/action/agencyAction";

export default async function AgenciesPage({ params }) {
    const { id: agency_id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
    });

    await queryClient.prefetchQuery({
        queryKey: ["agency", agency_id],
        queryFn: async () => {
            const res = await fetchAgency(agency_id);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full 2xl:w-8/10 mx-auto shadow-lg space-y-3">
                <AgencyUpdateForm agency_id={agency_id} />
            </div>
        </HydrationBoundary>
    );
}
