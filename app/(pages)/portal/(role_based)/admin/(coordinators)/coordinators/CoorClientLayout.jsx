"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { usePathname } from "next/navigation";

export default function CoorClientLayout({ children, approval }) {
    const pathname = usePathname();

    if (pathname == "/portal/admin/coordinators") {
        return (
            <>
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="for-approval">
                            For Approval
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">{children}</TabsContent>
                    <TabsContent value="for-approval">{approval}</TabsContent>
                </Tabs>
            </>
        );
    }
    return <>{children}</>;
}
