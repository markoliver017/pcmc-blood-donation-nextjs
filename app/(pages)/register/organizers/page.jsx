import { Suspense } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { getOrganizerRole } from "@/action/registerAction";
import Skeleton from "@components/ui/skeleton";
import NewUserForm from "../NewUserForm";
import { auth } from "@lib/auth";
import NewOrganizerForm from "./NewOrganizerForm";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { fetchluzonDemographics } from "@/action/locationAction";

export default async function Page() {
    const session = await auth();
    console.log("session in register", session);
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["luzonDemographics"],
        queryFn: fetchluzonDemographics,
    });

    return (
        <Suspense fallback={<Skeleton />}>
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                {!session || !session?.user ? (
                    <>
                        <Link href="/" className="mb-3 absolute top-5 right-4">
                            <button
                                className="btn btn-circle btn-warning w-max p-3"
                                tabIndex={-1}
                            >
                                <span className="hidden sm:inline-block">
                                    Cancel
                                </span>{" "}
                                <X />
                            </button>
                        </Link>
                        <NewUserForm role={getOrganizerRole()} />
                    </>
                ) : (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <NewOrganizerForm admin={session.user} />
                    </HydrationBoundary>
                )}
            </div>
        </Suspense>
    );
}
