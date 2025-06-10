"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { CalendarCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function HostEventClient({ children, approval }) {
    const pathname = usePathname();

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "all";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (
        pathname == "/portal/admin/events" ||
        pathname == "/portal/hosts/events"
    ) {
        return (
            <>
                <WrapperHeadMain
                    icon={<CalendarCheck />}
                    pageTitle="Blood Drives"
                    breadcrumbs={[
                        {
                            path: "/portal/hosts/events",
                            icon: <CalendarCheck className="w-4" />,
                            title: "Blood Drives",
                        },
                    ]}
                />
                <Tabs
                    defaultValue={currentTab}
                    onValueChange={handleTabChange}
                    className="p-5"
                >
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
