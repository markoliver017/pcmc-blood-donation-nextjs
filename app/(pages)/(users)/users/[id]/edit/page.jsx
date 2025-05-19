import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import UserUpdateForm from "./UserUpdateForm";
import Link from "next/link";
import { X } from "lucide-react";

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
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link href="/users" className="mb-3 absolute top-5 right-4">
                    <button className="btn btn-circle btn-warning w-max p-3">
                        <span className="hidden sm:inline-block">Cancel</span> <X />
                    </button>
                </Link>
                <UserUpdateForm />
            </div>
        </HydrationBoundary>
    );
}
