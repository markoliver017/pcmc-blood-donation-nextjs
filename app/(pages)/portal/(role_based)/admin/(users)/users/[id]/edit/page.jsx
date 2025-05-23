import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import UserUpdateForm from "@components/user/UserUpdateForm";
import Link from "next/link";
import { X } from "lucide-react";
import { fetchRoles } from "@/action/roleAction";
import { auth } from "@lib/auth";

export default async function Page() {
    const session = await auth();
    const { user } = session;
    if (!user) throw "No Authenticated users found!";

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

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link href="../" className="mb-3 absolute top-5 right-4">
                    <button className="btn btn-circle btn-warning w-max p-3">
                        <span className="hidden sm:inline-block">Cancel</span>{" "}
                        <X />
                    </button>
                </Link>
                <UserUpdateForm userId={user.id} />
            </div>
        </HydrationBoundary>
    );
}
