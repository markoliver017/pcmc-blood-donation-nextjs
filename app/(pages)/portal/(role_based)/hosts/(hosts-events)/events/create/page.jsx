import React from "react";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { CalendarCheck, CalendarPlus } from "lucide-react";
import { getAgencyId } from "@/action/hostEventAction";
import { Agency } from "@lib/models";
import CreateEventForm from "@components/events/CreateEventForm";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";

export default async function page() {
    const agency_id = await getAgencyId();
    if (!agency_id) throw "Agency not found or inactive.";

    const agency = await Agency.findByPk(agency_id);
    if (!agency) throw "Agency not found or inactive.";

    return (
        <>
            <WrapperHeadMain
                icon={
                    <Link href="/portal/hosts/events">
                        <BiArrowBack />
                    </Link>
                }
                pageTitle="Blood Drives"
                breadcrumbs={[
                    {
                        path: "/portal/hosts/events",
                        icon: <CalendarCheck className="w-4" />,
                        title: "List of Events",
                    },
                    {
                        path: "/portal/hosts/events/create",
                        icon: <CalendarPlus className="w-4" />,
                        title: "New Blood Donation Event",
                    },
                ]}
            />
            <div className="p-1 md:px-5">
                <CreateEventForm agency={agency.get({ plain: true })} />
            </div>
        </>
    );
}
