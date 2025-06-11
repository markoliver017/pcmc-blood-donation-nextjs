import React from "react";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { CalendarCheck, CalendarPlus } from "lucide-react";
import { getAgencyId } from "@/action/hostEventAction";
import { Agency } from "@lib/models";
import CreateEventForm from "@components/events/CreateEventForm";

export default async function page() {
    const agency_id = await getAgencyId();
    if (!agency_id) throw "Agency not found or inactive.";

    const agency = await Agency.findByPk(agency_id);
    if (!agency) throw "Agency not found or inactive.";

    return (
        <>
            <WrapperHeadMain
                icon={<CalendarCheck />}
                pageTitle="Blood Drives"
                breadcrumbs={[
                    {
                        path: "/portal/hosts/events",
                        icon: <CalendarCheck className="w-4" />,
                        title: "Blood Drives",
                    },
                    {
                        path: "/portal/hosts/events/create",
                        icon: <CalendarPlus className="w-4" />,
                        title: "Create New Blood Donation Event",
                    },
                ]}
            />
            <CreateEventForm agency={agency.get({ plain: true })} />
        </>
    );
}
