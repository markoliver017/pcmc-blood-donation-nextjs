import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

import { fetchluzonDemographics } from "@/action/locationAction";
import CreateForm from "./NewAgencyForm";
import Link from "next/link";
import { X } from "lucide-react";

export default async function AgenciesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link href="/agencies" className="mb-3 absolute top-5 right-4">
                    <button
                        className="btn btn-circle btn-warning w-max p-3"
                        tabIndex={-1}
                    >
                        <span className="hidden sm:inline-block">Cancel</span>{" "}
                        <X />
                    </button>
                </Link>

                <CreateForm />
            </div>
        </HydrationBoundary>
    );
}
