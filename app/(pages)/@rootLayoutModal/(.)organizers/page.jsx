import InterceptModal from "@components/layout/InterceptModal";
import AgencyListCardForDonor from "@components/organizers/AgencyListCardForDonor";

export default function page() {
    return (
        <InterceptModal>
            <AgencyListCardForDonor />
        </InterceptModal>
    );
}
