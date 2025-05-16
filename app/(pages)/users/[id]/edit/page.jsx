import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    useQuery,
} from "@tanstack/react-query";
import UserUpdateForm from "./UserUpdateForm";

const fetchRoles = async () => {
    const url = new URL(`/api/roles`, process.env.NEXT_PUBLIC_DOMAIN);
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });
    return await response.json();
};

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const res = await fetchRoles();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full mx-auto 2xl:w-8/10 shadow-lg">
                <UserUpdateForm />
            </div>
        </HydrationBoundary>
    );
}
