import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

import { fetchluzonDemographics } from "@/action/locationAction";
import AgencyUpdateForm from "./AgencyUpdateForm";
import { fetchAgency } from "@/action/agencyAction";

import Link from "next/link";
import { X } from "lucide-react";

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
            <div className="w-full h-full md:w-9/10 2xl:w-3/4 mx-auto relative">
                <Link href="/agencies" className="mb-3 absolute top-5 left-5">
                    <button
                        className="btn btn-circle btn-warning w-max p-3"
                        tabIndex={-1}
                    >
                        <span className="hidden sm:inline-block">Cancel</span>{" "}
                        <X />
                    </button>
                </Link>
                <AgencyUpdateForm agency_id={agency_id} />
            </div>
        </HydrationBoundary>
    );
}
