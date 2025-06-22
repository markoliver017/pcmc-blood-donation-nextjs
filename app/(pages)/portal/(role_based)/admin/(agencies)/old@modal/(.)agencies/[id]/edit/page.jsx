import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

import { fetchluzonDemographics } from "@/action/locationAction";
// import AgencyUpdateForm from "@/(pages)/admin/(agencies)/agencies/[id]/edit/AgencyUpdateForm";
// AgencyUpdateForm
import { fetchAgency } from "@/action/agencyAction";

import InterceptModal from "@components/layout/InterceptModal";
import AgencyUpdateForm from "../../../../../../../../../../components/organizers/AgencyUpdateForm";

export default async function Page({ params }) {
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
        <InterceptModal>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="w-full md:w-9/10 2xl:w-8-10 mx-auto shadow-lg">
                    <AgencyUpdateForm agency_id={agency_id} />
                </div>
            </HydrationBoundary>
        </InterceptModal>
    );
}
