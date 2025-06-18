"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Building, Calendar, Users2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AppointmentTabComponent({ children, approval }) {
    const pathname = usePathname();

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "all";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (pathname == "/portal/admin/appointments") {
        return (
            <>
                <WrapperHeadMain
                    icon={<Calendar />}
                    pageTitle={
                        currentTab == "all"
                            ? "List of Appointments"
                            : "Appointments for Approval"
                    }
                    breadcrumbs={[
                        {
                            path: "/portal/admin/appointments",
                            icon: <Calendar className="w-4" />,
                            title: "Appointments",
                        },
                    ]}
                />
                <Tabs
                    defaultValue={currentTab}
                    onValueChange={handleTabChange}
                    className="px-5"
                >
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="for-approval">
                            For Approval
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="relative">
                        {children}
                    </TabsContent>
                    <TabsContent value="for-approval">{approval}</TabsContent>
                </Tabs>
            </>
        );
    }
    return <>{children}</>;
}
