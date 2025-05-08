import { getUser } from "@/action/userAction";
import UserUpdateForm from "./UserUpdateForm";

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
        <div className="w-full h-full md:w-1/2 lg:w-3/4 mx-auto shadow-lg">
            <UserUpdateForm fetchRoles={fetchRoles()} user={getUser(id)} />
        </div>
    );
}
