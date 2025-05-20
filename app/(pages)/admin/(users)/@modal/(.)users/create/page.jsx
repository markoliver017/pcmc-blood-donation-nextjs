import { Suspense } from "react";
import UserCreateForm from "@/(pages)/admin/(users)/users/create/UserCreateForm";
import UserLoading from "@/(pages)/admin/(users)/users/UserLoading";
import InterceptModal from "@components/layout/InterceptModal";

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
        <InterceptModal>

            <Suspense fallback={<UserLoading />}>
                <div className="w-9/10 mx-auto shadow-lg">
                    <UserCreateForm fetchRoles={fetchRoles()} />
                </div>
            </Suspense>
        </InterceptModal>
    );
}
