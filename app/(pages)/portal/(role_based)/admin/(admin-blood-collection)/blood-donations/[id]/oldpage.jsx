import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getDonorById } from "@/action/donorAction";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ShowDonor from "@components/donors/ShowDonor";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["donor", id],
        queryFn: async () => await getDonorById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link
                    href="/portal/admin/donors"
                    className="absolute top-5 right-4"
                >
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
                <ShowDonor donorId={id} />
            </div>
        </HydrationBoundary>
    );
}
