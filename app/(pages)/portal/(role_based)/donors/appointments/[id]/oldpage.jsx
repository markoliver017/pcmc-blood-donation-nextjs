import AppointmentComponent from "./AppointmentComponent";

export default async function Page({ params }) {
    const { id } = await params;
    return (
        <>
            <AppointmentComponent id={id} />
        </>
    )
}
