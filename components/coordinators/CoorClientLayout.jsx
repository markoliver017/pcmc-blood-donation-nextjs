"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Users2, Users2Icon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CoorClientLayout({ children, approval }) {
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
        pathname == "/portal/admin/coordinators" ||
        pathname == "/portal/hosts/manage-coordinators"
    ) {
        return (
            <>
                <WrapperHeadMain
                    icon={<Users2Icon />}
                    pageTitle={
                        currentTab == "all"
                            ? "List of Coordinators"
                            : "Coordinators for Approval"
                    }
                    breadcrumbs={[
                        {
                            path: "/portal/admin/coordinators?tab=for-approval",
                            icon: <Users2 className="w-4" />,
                            title: "Manage Coordinators",
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
