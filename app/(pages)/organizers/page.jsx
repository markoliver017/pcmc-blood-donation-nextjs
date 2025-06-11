import AgencyListCardForDonor from "@components/organizers/AgencyListCardForDonor";
import React from "react";

export default function OrganizerPage() {
    return (
        <div className="flex flex-col items-center w-full p-5">
            <div className="w-full lg:9/10 xl:w-3/4">
                <AgencyListCardForDonor />
            </div>
        </div>
    );
}
