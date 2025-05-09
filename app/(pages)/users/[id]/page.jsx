import { getUser } from "@/action/userAction";
import { Suspense } from "react";
import UserUpdateForm from "./UserUpdateForm";
import UserLoading from "../UserLoading";

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

    return (
        <Suspense fallback={<UserLoading />}>
            <div className="w-full h-full md:w-1/2 lg:w-3/4 mx-auto shadow-lg">
                <UserUpdateForm
                    fetchRoles={fetchRoles()}
                    fetchUser={getUser(id)}
                />
            </div>
        </Suspense>
    );
}
