import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/action/userAction";
import { auth } from "@lib/auth";
import { fetchRoles } from "@/action/roleAction";
import UserProfileTabs from "@components/profile/UserProfileTabs";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { User } from "lucide-react";

export default async function Page() {
    const session = await auth();

    const { user } = session;

    console.log("Authenticated user:", user);

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
                icon={<User />}
                pageTitle="Profile"
                breadcrumbs={[
                    {
                        path: "/portal/admin/profile",
                        icon: <User className="w-4" />,
                        title: "Account Information",
                    },
                ]}
            />
            <div className="w-full h-full md:w-8/10 lg:w-3/4 mx-auto p-1 md:p-5">
                <UserProfileTabs userId={user.id} provider={user?.provider} />
            </div>
        </HydrationBoundary>
    );
}
