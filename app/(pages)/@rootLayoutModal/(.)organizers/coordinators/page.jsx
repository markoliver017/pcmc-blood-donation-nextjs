import InterceptModal from "@components/layout/InterceptModal";
import AgencyListCardForCoordinator from "@components/organizers/AgencyListCardForCoordinator";

export default function page() {
    return (
        <InterceptModal>
            <AgencyListCardForCoordinator />
        </InterceptModal>
    );
}
