import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/action/userAction";
import ShowUser from "@components/user/ShowUser";
import { ArrowLeft, User, Users } from "lucide-react";
import Link from "next/link";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";

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
            <WrapperHeadMain
                icon={<>
                    <Link href="./" className="btn p-1">
                        
                            <ArrowLeft />
                        
                    </Link>
                
                </>}
                pageTitle="Users Management"
                breadcrumbs={[
                    {
                        path: "/portal/admin/users",
                        icon: <Users className="w-4" />,
                        title: "Users Management",
                    },
                    {
                        path: `/portal/admin/users/${id}`,
                        icon: <User className="w-4" />,
                        title: "User Details",
                    },
                ]}
            />
            <div className="w-full md:w-8/10 lg:w-3/4 mx-auto my-5">

                <ShowUser userId={id} />
            </div>
        </HydrationBoundary>
    );
}
