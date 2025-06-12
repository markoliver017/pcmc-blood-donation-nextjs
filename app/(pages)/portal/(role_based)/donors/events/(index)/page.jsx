
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { CalendarCheck } from "lucide-react";
import BloodDriveEvents from "./BloodDriveEvents";

export default function Page() {

    return (
        <>
            <WrapperHeadMain
                icon={<CalendarCheck />}
                pageTitle="Blood Drives"
                breadcrumbs={[
                    {
                        path: "/portal/donor/events",
                        icon: <CalendarCheck className="w-4" />,
                        title: "Blood Drives",
                    },
                ]}
            />

            <div className="p-2 md:p-5">
                <BloodDriveEvents />
            </div>
        </>
    );
}

