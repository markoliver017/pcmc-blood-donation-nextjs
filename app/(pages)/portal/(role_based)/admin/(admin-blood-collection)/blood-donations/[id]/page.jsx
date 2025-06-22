import TabsComponent from "./TabsComponent";

export default async function Page({ params }) {
    const { id } = await params;

    return <TabsComponent appointmentId={id} />;
}
