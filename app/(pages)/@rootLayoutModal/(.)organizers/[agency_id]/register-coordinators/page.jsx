import { fetchAgency } from "@/action/agencyAction";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CoordinatorRegisterPage from "@/(pages)/organizers/[agency_id]/register-coordinators/CoordinatorRegisterPage";
import InterceptModal from "@components/layout/InterceptModal";

export default async function page({ params }) {
    const { agency_id } = await params;
    const agency = await fetchAgency(agency_id);
    const headerList = await headers();
    const pathname = headerList.get("x-current-path");

    if (!agency) {
        redirect("/organizers");
    }

    return (
        <InterceptModal>
            <CoordinatorRegisterPage agency={agency} agency_id={agency_id} />
        </InterceptModal>
    );
}
