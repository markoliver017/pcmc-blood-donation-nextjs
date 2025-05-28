import { Building, HomeIcon } from "lucide-react";

import NewOrganizerForm from "@components/organizers/NewOrganizerForm";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";

export default async function Page() {

    return (
        <>
            <WrapperHeadMain
                icon={<Building />}
                pageTitle="Agency Registration"
                breadcrumbs={[
                    { path: "/", icon: <HomeIcon className="w-4" />, title: "Home" },
                    { path: "/organizers/register", icon: <Building className="w-4" />, title: "Agency Registration" },
                ]}
            />
            <div className="w-full h-full xl:w-8/10 2xl:w-7/10 mx-auto p-5 relative">

                <NewOrganizerForm role_name="Agency Administrator" />

            </div>
        </>
    );
}
