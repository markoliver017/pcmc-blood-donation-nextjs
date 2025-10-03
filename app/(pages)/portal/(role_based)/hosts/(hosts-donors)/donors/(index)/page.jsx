import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Building, Users } from "lucide-react";
import Container from "./Container";

export default function Page() {
    return (
        <>
            <WrapperHeadMain
                icon={<Building />}
                pageTitle="List of Donors"
                breadcrumbs={[
                    {
                        path: "/portal/admin/donors",
                        icon: <Users className="w-4" />,
                        title: "Manage Donors",
                    },
                ]}
            />
            <Container />
        </>
    );
}
