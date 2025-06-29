import TabsComponent from "./TabsComponent";

export default async function Page({ params }) {
    const { donor_id } = await params;
    return <TabsComponent donorId={donor_id} />;
}
