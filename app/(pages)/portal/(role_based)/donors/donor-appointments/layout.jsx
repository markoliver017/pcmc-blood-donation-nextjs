import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Calendar } from "lucide-react";
import React from "react";

export default function AgenciesLayout({ children }) {
    return (
        <>
            <WrapperHeadMain
                icon={<Calendar />}
                pageTitle="My Appointments"
                breadcrumbs={[
                    {
                        path: "/portal/donor/donor-appointments",
                        icon: <Calendar className="w-4" />,
                        title: "My Appointments",
                    },
                ]}
            />
            <div className="p-2 md:p-5">{children}</div>
        </>
    );
}
