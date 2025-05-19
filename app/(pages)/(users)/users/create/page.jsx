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
            <div className="w-full h-full md:w-8/10 2xl:w-3/4 mx-auto relative">
                <Link href="/users" className="mb-3 absolute top-5 right-4">
                    <button className="btn btn-circle btn-warning w-max p-3">
                        <span className="hidden sm:inline-block">Cancel</span> <X />
                    </button>
                </Link>
                <UserCreateForm fetchRoles={fetchRoles()} />
            </div>
        </Suspense>
    );
}
