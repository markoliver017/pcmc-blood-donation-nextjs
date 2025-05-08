import { Suspense } from "react";
import UserCreateForm from "./UserCreateForm";
import UserLoading from "../UserLoading";

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
        <Suspense fallback={<UserLoading />}>
            <div className="w-full h-full md:w-1/2 lg:w-3/4 mx-auto shadow-lg">
                <UserCreateForm fetchRoles={fetchRoles()} />
            </div>
        </Suspense>
    );
}
