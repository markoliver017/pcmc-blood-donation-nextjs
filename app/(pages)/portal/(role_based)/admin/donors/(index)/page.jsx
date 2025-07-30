"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import DonorList from "./DonorList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Building, Users2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ForApprovalDonorList from "./ForApprovalDonorList";
import { getVerifiedDonors } from "@/action/donorAction";
import { useQuery } from "@tanstack/react-query";

export default function DonorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "all";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const {
        data: donors,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["verified-donors"],
        queryFn: getVerifiedDonors,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        cacheTime: 2 * 60 * 1000, // Cache persists for 2 minute
    });

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
                    <TabsTrigger value="all">
                        All ({donors?.length})
                    </TabsTrigger>
                    <TabsTrigger value="for-approval">For Approval</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg space-y-3">
                        <DonorList
                            donors={donors}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="for-approval">
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                        <ForApprovalDonorList />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
