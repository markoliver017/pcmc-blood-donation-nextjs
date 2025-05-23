import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/action/userAction";
import InterceptModal from "@components/layout/InterceptModal";
import UserUpdateForm from "@components/user/UserUpdateForm";
import { auth } from "@lib/auth";
import { fetchRoles } from "@/action/roleAction";

export default async function Page() {
    const session = await auth();
    const { user } = session;
    if (!user) throw "No Authenticated users found!";

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["user", user.id],
        queryFn: async () => {
            const res = await getUser(user.id);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
    });
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
        <InterceptModal>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="px-5">
                    <UserUpdateForm userId={user.id} />
                </div>
            </HydrationBoundary>
        </InterceptModal>
    );
}
