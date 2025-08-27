import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { CalendarCheck } from "lucide-react";
import BloodDriveEvents from "./BloodDriveEvents";
import { MdDashboard } from "react-icons/md";

export default function Page() {
    return (
        <>
            <WrapperHeadMain
                icon={<CalendarCheck />}
                pageTitle="Blood Drives"
                breadcrumbs={[
                    {
                        path: "/portal",
                        icon: <MdDashboard className="w-4" />,
                        title: "Dashboard",
                    },
                    {
                        path: "/portal/donor/events",
                        icon: <CalendarCheck className="w-4" />,
                        title: "Blood Drives",
                    },
                ]}
            />

            <div className="p-1 md:p-5">
                <BloodDriveEvents />
            </div>
        </>
    );
}
