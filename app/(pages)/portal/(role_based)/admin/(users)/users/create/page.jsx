import { Suspense } from "react";
import UserCreateForm from "./UserCreateForm";

import { UserPlus, Users, X } from "lucide-react";
import Link from "next/link";
import Skeleton_user from "@components/ui/Skeleton_user";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";

const fetchRoles = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const url = new URL(`/api/roles`, process.env.NEXT_PUBLIC_DOMAIN);
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    return await response.json();
};

export default function Page() {
    return (
        <Suspense fallback={<Skeleton_user />}>
            <WrapperHeadMain
                icon={<Users />}
                pageTitle="Users Management"
                breadcrumbs={[
                    {
                        path: "/portal/admin/users",
                        icon: <Users className="w-4" />,
                        title: "Users Management",
                    },
                    {
                        path: "/portal/admin/users/create",
                        icon: <UserPlus className="w-4" />,
                        title: "New Account",
                    },
                ]}
            />
            <div className="w-full h-full my-2 md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link
                    href="/portal/admin/users"
                    className="mb-3 absolute top-5 right-4"
                >
                    <button
                        className="btn btn-circle btn-warning w-max p-3"
                        tabIndex={-1}
                    >
                        <span className="hidden sm:inline-block">Cancel</span>{" "}
                        <X />
                    </button>
                </Link>
                <UserCreateForm fetchRoles={fetchRoles()} />
            </div>
        </Suspense>
    );
}
