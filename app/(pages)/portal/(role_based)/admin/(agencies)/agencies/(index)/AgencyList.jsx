"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Building2, Plus, RefreshCcw } from "lucide-react";
import { DataTable } from "./Datatable";
import { columns } from "./columns";
import Skeleton from "@components/ui/skeleton";
import {
    fetchAgencyByStatus,
    fetchVerifiedAgencies,
} from "@/action/agencyAction";
import { Card } from "@components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import ForApprovalAgencyList from "./ForApprovalAgencyList";

export default function AgencyList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "approved";

    const handleTabChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const queryClient = useQueryClient();
    const {
        data: agencies,
        error,
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ["verified-agencies"],
        queryFn: fetchVerifiedAgencies,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        cacheTime: 2 * 60 * 1000, // Cache persists for 2 minute
    });

    const {
        data: forApprovalAgencies,
        isLoading: forApprovalAgencyIsFetching,
    } = useQuery({
        queryKey: ["agencies", "for approval"],
        queryFn: async () => fetchAgencyByStatus("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });

    if (isLoading || isFetching) return <Skeleton />;

    if (error) return <div>Error: {error.message}</div>;

    const approvedAgencies = agencies.filter(
        (agency) => agency.status === "activated"
    );
    const rejectedAgencies = agencies.filter(
        (agency) => agency.status === "rejected"
    );

    return (
        <div className="relative">
            <div className="hidden justify-between mb-5">
                <Link
                    href="./agencies/create"
                    className="btn btn-lg btn-accent"
                >
                    <Plus /> Create
                </Link>
            </div>
            <button
                className="btn btn-circle btn-warning absolute top-[1] right-5"
                onClick={() =>
                    queryClient.invalidateQueries({
                        queryKey: ["verified-agencies"],
                    })
                }
            >
                <RefreshCcw className="h-4" />
            </button>

            <Tabs
                defaultValue={currentTab}
                onValueChange={handleTabChange}
                className="mt-2 px-1 md:px-5"
            >
                <TabsList>
                    <TabsTrigger value="approved">
                        <span className="text-green-600 text-lg font-semibold px-5">
                            Approved ({approvedAgencies.length})
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="for-approval">
                        <span className="text-warning text-lg font-semibold px-5">
                            For Approval ({forApprovalAgencies.length})
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        <span className="text-error text-lg font-semibold px-5">
                            Rejected ({rejectedAgencies.length})
                        </span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="approved">
                    {approvedAgencies.length === 0 ? (
                        <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 ">
                            <Building2 className="w-12 h-12 mb-4 text-primary" />
                            <h2 className="text-xl font-semibold">
                                No Approved Partner Agencies Yet
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Once an agency is verified, it will appear here.
                            </p>
                        </Card>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={approvedAgencies}
                            isLoading={isLoading}
                        />
                    )}
                </TabsContent>
                <TabsContent value="rejected">
                    {approvedAgencies.length === 0 ? (
                        <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 ">
                            <Building2 className="w-12 h-12 mb-4 text-primary" />
                            <h2 className="text-xl font-semibold">
                                No Rejected Partner Agencies
                            </h2>
                            <p className="text-gray-500 mt-2">
                                All rejected agencies will appear here.
                            </p>
                        </Card>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={rejectedAgencies}
                            isLoading={isLoading}
                        />
                    )}
                </TabsContent>
                <TabsContent value="for-approval">
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                        <ForApprovalAgencyList
                            avatarClassName="md:w-[150px] md:h-[150px]"
                            agencies={forApprovalAgencies}
                            isFetching={forApprovalAgencyIsFetching}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
