import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/action/userAction";
import ShowUser from "@/(pages)/portal/admin/(users)/users/[id]/ShowUser";
import InterceptModal from "@components/layout/InterceptModal";

const fetchRoles = async () => {
    const url = new URL(`/api/roles`, process.env.NEXT_PUBLIC_DOMAIN);
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });
    return await response.json();
};

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["user", id],
        queryFn: async () => {
            const res = await getUser(id);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
    });

    return (
        <InterceptModal>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="px-5">
                    <ShowUser userId={id} />
                </div>
            </HydrationBoundary>
        </InterceptModal>
    );
}
