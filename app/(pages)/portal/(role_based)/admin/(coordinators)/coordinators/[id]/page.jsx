import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import ShowAgency from "@role_based/admin/(agencies)/agencies/[id]/ShowAgency";
import InterceptModal from "@components/layout/InterceptModal";
import { getCoordinatorById } from "@/action/coordinatorAction";
import ShowCoordinator from "@components/coordinators/ShowCoordinator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["coordinator", id],
        queryFn: async () => await getCoordinatorById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link
                    href="/portal/admin/coordinators"
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
                <ShowCoordinator coorId={id} />
            </div>
        </HydrationBoundary>
    );
}
