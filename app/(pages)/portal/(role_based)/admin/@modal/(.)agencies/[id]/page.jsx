import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { fetchAgency } from "@/action/agencyAction";
import ShowAgency from "@role_based/admin/(agencies)/agencies/[id]/ShowAgency";


import InterceptModal from "@components/layout/InterceptModal";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["agency", id],
        queryFn: async () => await fetchAgency(id)
    });

    return (
        <InterceptModal>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="w-full md:w-9/10 2xl:w-8-10 mx-auto shadow-lg">
                    <ShowAgency agencyId={id} />
                </div>
            </HydrationBoundary>
        </InterceptModal>
    );
}
