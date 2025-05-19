import { Suspense } from "react";
import UserCreateForm from "./UserCreateForm";
import UserLoading from "../UserLoading";
import { X } from "lucide-react";
import Link from "next/link";

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
            <div className="w-full h-full md:w-1/2 lg:w-3/4 mx-auto">
                <Link href="/users" className="mb-3 fixed right-10">
                    <button className="btn btn-circle btn-warning w-max p-3">
                        Cancel <X />
                    </button>
                </Link>
                <UserCreateForm fetchRoles={fetchRoles()} />
            </div>
        </Suspense>
    );
}
