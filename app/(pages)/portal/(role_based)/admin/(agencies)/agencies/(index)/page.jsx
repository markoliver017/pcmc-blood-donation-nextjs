import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import AgencyList from "./AgencyList";
import { fetchAgencies } from "@/action/agencyAction";

export default async function AgenciesPage() {
    // const queryClient = new QueryClient();

    // await queryClient.prefetchQuery({
    //     queryKey: ["agencies"],
    //     queryFn: fetchAgencies,
    // });

    return (
        // <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg space-y-3">
            <AgencyList />
        </div>
        // </HydrationBoundary/>
    );
}
