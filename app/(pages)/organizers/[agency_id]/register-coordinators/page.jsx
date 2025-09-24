import { fetchAgency } from "@/action/agencyAction";

import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Building, HomeIcon, User } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BiBuildings } from "react-icons/bi";
import { ToastContainer } from "react-toastify";
import CoordinatorRegisterPage from "./CoordinatorRegisterPage";

export default async function page({ params }) {
    const { agency_id } = await params;
    const agency = await fetchAgency(agency_id);
    const headerList = await headers();
    const pathname = headerList.get("x-current-path");

    if (!agency) {
        redirect("/organizers");
    }

    return (
        <>
            <ToastContainer />
            <WrapperHeadMain
                icon={<User />}
                pageTitle="Coordinator Registration"
                breadcrumbs={[
                    {
                        path: "/",
                        icon: <HomeIcon className="w-4" />,
                        title: "Home",
                    },
                    {
                        path: "/organizers",
                        icon: <BiBuildings className="w-4" />,
                        title: "Agencies",
                    },
                    {
                        path: pathname,
                        icon: <Building className="w-4" />,
                        title: `${agency.name} Registration`,
                    },
                ]}
            />
            <div className="w-full h-full xl:w-8/10 2xl:w-7/10 mx-auto p-1 sm:p-5 relative">
                <CoordinatorRegisterPage
                    agency={agency}
                    agency_id={agency_id}
                />
            </div>
        </>
    );
}
