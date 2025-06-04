"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Building, Users2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AdminDonorClient({ children, approval }) {
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
        pathname == "/portal/admin/donors" ||
        pathname == "/portal/hosts/donors"
    ) {
        return (
            <>
                <WrapperHeadMain
                    icon={<Building />}
                    pageTitle={
                        currentTab == "all"
                            ? "List of Donors"
                            : "Donors for Approval"
                    }
                    breadcrumbs={[
                        {
                            path: "/portal/admin/donors",
                            icon: <Users2 className="w-4" />,
                            title: "Manage Donors",
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
