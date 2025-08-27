import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/action/userAction";
import { auth } from "@lib/auth";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { User } from "lucide-react";

import DonorProfilePage from "@components/donors/DonorProfilePage";
import { MdDashboard } from "react-icons/md";

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

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WrapperHeadMain
                icon={<User />}
                pageTitle="Profile"
                breadcrumbs={[
                    {
                        path: "/portal",
                        icon: <MdDashboard className="w-4" />,
                        title: "Dashboard",
                    },
                    {
                        path: "/portal/admin/profile",
                        icon: <User className="w-4" />,
                        title: "Account Information",
                    },
                ]}
            />
            <div className="w-full lg:w-9/10 mx-auto p-1 md:p-5">
                <DonorProfilePage user={user} />
            </div>
        </HydrationBoundary>
    );
}
