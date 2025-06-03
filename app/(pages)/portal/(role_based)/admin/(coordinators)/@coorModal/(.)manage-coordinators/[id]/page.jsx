import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import ShowAgency from "@role_based/admin/(agencies)/agencies/[id]/ShowAgency";
import InterceptModal from "@components/layout/InterceptModal";
import { getCoordinatorById } from "@/action/coordinatorAction";
import ShowCoordinator from "@components/coordinators/ShowCoordinator";

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["coordinator", id],
        queryFn: async () => await getCoordinatorById(id),
    });

    return (
        <InterceptModal>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="w-full md:w-9/10 2xl:w-8-10 mx-auto shadow-lg">
                    <ShowCoordinator coorId={id} />
                </div>
            </HydrationBoundary>
        </InterceptModal>
    );
}
