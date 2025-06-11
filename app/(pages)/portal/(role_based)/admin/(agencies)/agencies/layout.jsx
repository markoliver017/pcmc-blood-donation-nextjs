import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import React from "react";
import { BiBuildings } from "react-icons/bi";

export default function AgenciesLayout({ children, approval }) {
    return (
        <>
            <WrapperHeadMain
                icon={<BiBuildings />}
                pageTitle="Agencies Management"
                breadcrumbs={[
                    {
                        path: "/portal/admin/agencies",
                        icon: <BiBuildings className="w-4" />,
                        title: "Agencies Management",
                    },
                ]}
            />
            <Tabs defaultValue="all" className="p-5">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="for-approval">For Approval</TabsTrigger>
                </TabsList>
                <TabsContent value="all">{children}</TabsContent>
                <TabsContent value="for-approval">{approval}</TabsContent>
            </Tabs>
        </>
    );
}
