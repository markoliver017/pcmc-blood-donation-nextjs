import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import InterceptModal from "@components/layout/InterceptModal";
import { getDonorById } from "@/action/donorAction";
import ShowDonor from "@components/donors/ShowDonor";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["donor", id],
        queryFn: async () => await getDonorById(id),
    });

    return (
        <InterceptModal>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="w-full md:w-9/10 2xl:w-8-10 mx-auto shadow-lg">
                    <ShowDonor donorId={id} />
                </div>
            </HydrationBoundary>
        </InterceptModal>
    );
}
