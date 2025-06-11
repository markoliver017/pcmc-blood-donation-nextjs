import AgencyListCardForCoordinator from "@components/organizers/AgencyListCardForCoordinator";
import React from "react";

export default function Page() {
    return (
        <div className="flex flex-col items-center w-full p-5">
            <div className="w-full lg:9/10 xl:w-3/4">
                <AgencyListCardForCoordinator />
            </div>
        </div>
    );
}
