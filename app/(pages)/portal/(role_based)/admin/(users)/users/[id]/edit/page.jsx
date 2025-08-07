import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import UserUpdateForm from "@components/user/UserUpdateForm";
import Link from "next/link";
import { ArrowLeft, User, UserPen, Users, X } from "lucide-react";
import { fetchRoles } from "@/action/roleAction";
import { auth } from "@lib/auth";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { getUser } from "@/action/userAction";

export default async function Page({ params }) {
    const { id } = await params;

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
            <WrapperHeadMain
                icon={
                    <>
                        <Link href="../" className="btn p-1">
                            <ArrowLeft />
                        </Link>
                    </>
                }
                pageTitle="Users Management"
                breadcrumbs={[
                    {
                        path: "/portal/admin/users",
                        icon: <Users className="w-4" />,
                        title: "Users Management",
                    },
                    {
                        path: `/portal/admin/users/${id}/edit`,
                        icon: <UserPen className="w-4" />,
                        title: "User Details",
                    },
                ]}
            />
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative my-5">
                <UserUpdateForm userId={id} />
            </div>
        </HydrationBoundary>
    );
}
