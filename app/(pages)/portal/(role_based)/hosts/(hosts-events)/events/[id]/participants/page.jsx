import ListParticipants from "./ListParticipants";

export default async function page({ params }) {
    const { id } = await params;


    return (
        <div>
            <ListParticipants eventId={id} />
        </div>
    )
}
