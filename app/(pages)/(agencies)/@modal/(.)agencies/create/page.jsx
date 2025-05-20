import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { fetchluzonDemographics } from "@/action/locationAction";
import InterceptModal from "@components/layout/InterceptModal";
import CreateForm from "@/(pages)/(agencies)/agencies/create/CreateForm";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <InterceptModal>
                <div className="w-full md:w-9/10 2xl:w-8-10 mx-auto shadow-lg">
                    <CreateForm />
                </div>
            </InterceptModal>
        </HydrationBoundary>
    );
}
