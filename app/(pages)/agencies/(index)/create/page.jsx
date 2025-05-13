
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { fetchluzonDemographics } from "@/action/agencyAction";
import CreateForm from "./CreateForm";

export default async function AgenciesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full md:w-3/4 mx-auto shadow-lg space-y-3">
                <CreateForm />
            </div>
        </HydrationBoundary>
    )
}

