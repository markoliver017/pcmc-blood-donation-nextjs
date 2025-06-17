import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { fetchAgency } from "@/action/agencyAction";
import ShowAgency from "./ShowAgency";

import Link from "next/link";
import { ArrowLeft, Building } from "lucide-react";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { BiBuildings } from "react-icons/bi";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["agency", id],
        queryFn: async () => await fetchAgency(id)
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WrapperHeadMain
                icon={<BiBuildings />}
                pageTitle="Agencies Management"
                breadcrumbs={[
                    {
                        path: "/portal/admin/agencies",
                        icon: <BiBuildings className="w-4" />,
                        title: "Agencies Management",
                    },
                    {
                        path: `/portal/admin/agencies/${id}`,
                        icon: <Building className="w-4" />,
                        title: "Agency Details",
                    },
                ]}
            />
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link href="/portal/admin/agencies" className="absolute top-5 right-4">
                    <button
                        className="btn btn-circle btn-default w-max p-3"
                        tabIndex={-1}
                    >
                        <ArrowLeft />
                        <span className="hidden sm:inline-block">
                            Back
                        </span>{" "}
                    </button>
                </Link>
                <ShowAgency agencyId={id} />
            </div>
        </HydrationBoundary>
    );
}
