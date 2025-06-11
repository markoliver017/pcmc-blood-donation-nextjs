// import UsersList from "./UsersList";

import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import UsersList from "./UsersList";
import { Users } from "lucide-react";

export default async function Page() {
    return (
        <>
            <WrapperHeadMain
                icon={<Users />}
                pageTitle="Users Management"
                breadcrumbs={[
                    {
                        path: "/portal/admin/users",
                        icon: <Users className="w-4" />,
                        title: "Users Management",
                    },
                ]}
            />
            <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg space-y-3 p-2 md:p-5">
                <UsersList />
            </div>
        </>
    );
}
