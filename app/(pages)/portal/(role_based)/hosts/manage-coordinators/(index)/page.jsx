import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Users2, Users2Icon } from "lucide-react";

import Container from "./Container";

export default function Page() {
    return (
        <>
            <WrapperHeadMain
                icon={<Users2Icon />}
                pageTitle="List of Coordinators"
                breadcrumbs={[
                    {
                        path: "/portal/admin/coordinators",
                        icon: <Users2 className="w-4" />,
                        title: "Manage Coordinators",
                    },
                ]}
            />
            <Container />
        </>
    );
}
