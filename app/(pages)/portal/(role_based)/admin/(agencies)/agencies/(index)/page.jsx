import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import AgencyList from "./AgencyList";
import { BiBuildings } from "react-icons/bi";

export default async function AgenciesPage() {
    return (
        <>
            <WrapperHeadMain
                icon={<BiBuildings />}
                pageTitle="Agencies Management"
                breadcrumbs={[
                    {
                        path: "/portal/admin/agencies",
                        icon: <BiBuildings className="w-4" />,
                        title: "Agencies Management",
                    },
                ]}
            />
            <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg space-y-3">
                <AgencyList />
            </div>
        </>
    );
}
