import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import BloodCollecitionList from "./BloodCollecitionList";
import BloodCollectionDashboard from "@components/admin/blood-collections/BloodCollectionDashboard";
import { MdBloodtype } from "react-icons/md";
import { List } from "lucide-react";

export default function Page() {
    return (
        <>
            <WrapperHeadMain
                icon={<MdBloodtype />}
                pageTitle="Blood Donations"
                breadcrumbs={[
                    {
                        path: "/portal/admin/blood-collections",
                        icon: <List className="w-4 h-4" />,
                        title: "List of Blood Donations",
                    },
                ]}
            />
            <div className="w-full px-1 2xl:px-5 mx-auto mt-2 md:mt-5 space-y-2 md:space-y-6">
                <BloodCollectionDashboard />
                <div className="shadow-lg rounded-lg">
                    <BloodCollecitionList />
                </div>
            </div>
        </>
    );
}
