import { Suspense } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { getRole } from "@/action/registerAction";
import Skeleton from "@components/ui/skeleton";
import NewUserForm from "../../../../../components/user/NewUserBasicInfoForm";
import { auth } from "@lib/auth";

import { QueryClient } from "@tanstack/react-query";

import { fetchluzonDemographics } from "@/action/locationAction";

import { ListOfAgenciesTable } from "@components/donors/ListOfAgenciesTable";
import { ListOfAgenciesColumns } from "@components/donors/ListOfAgenciesColumns";

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
            <div className="w-full h-full 2xl:w-9/10 mx-auto relative">
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
                        <NewUserForm role={getRole("Donor")} />
                    </>
                ) : (
                    <>
                        <h1></h1>
                        <ListOfAgenciesTable columns={ListOfAgenciesColumns} />
                    </>
                )}
            </div>
        </Suspense>
    );
}
