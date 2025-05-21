import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/action/userAction";
import ShowUser from "./ShowUser";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-full md:w-8/10 lg:w-3/4 mx-auto">
                <div className="mb-2">
                    <Link href="./">
                        <Button>
                            <ArrowLeft />
                            Back
                        </Button>
                    </Link>
                </div>
                <ShowUser userId={id} />
            </div>
        </HydrationBoundary>
    );
}
