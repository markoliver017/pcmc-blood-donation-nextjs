import InterceptModal from "@components/layout/InterceptModal";
import NewOrganizerForm from "@components/organizers/NewOrganizerForm";

export default function page() {
    return (
        <InterceptModal>
            <NewOrganizerForm role_name="Agency Administrator" />
        </InterceptModal>
    );
}
