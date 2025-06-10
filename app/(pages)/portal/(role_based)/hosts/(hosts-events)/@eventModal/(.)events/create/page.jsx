import InterceptModal from "@components/layout/InterceptModal";
import { getAgencyId } from "@/action/eventAction";
import { Agency } from "@lib/models";
import CreateEventForm from "@components/events/CreateEventForm";

export default async function Page() {
    const agency_id = await getAgencyId();
    if (!agency_id) throw "Agency not found or inactive.";

    const agency = await Agency.findByPk(agency_id);
    if (!agency) throw "Agency not found or inactive.";

    return (
        <InterceptModal>
            <CreateEventForm agency={agency.get({ plain: true })} />
        </InterceptModal>
    );
}
