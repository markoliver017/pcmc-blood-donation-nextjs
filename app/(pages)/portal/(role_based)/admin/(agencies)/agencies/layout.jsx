import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import React from "react";

export default function AgenciesLayout({ children, approval }) {

    return (
        <>
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="for-approval">For Approval</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    {children}
                </TabsContent>
                <TabsContent value="for-approval">
                    {approval}
                </TabsContent>
            </Tabs>
        </>
    );
}
