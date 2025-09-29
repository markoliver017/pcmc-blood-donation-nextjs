"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Users2Icon } from "lucide-react";
import Skeleton from "@components/ui/skeleton";
import { getVerifiedCoordinators } from "@/action/coordinatorAction";
import { Card } from "@components/ui/card";
import { DataTable } from "@components/coordinators/Datatable";
import { adminCoordinatorColumns } from "@components/coordinators/adminCoordinatorColumns";
import { getAllAgencyOptions } from "@/action/adminEventAction";

export default function CoordinatorList() {
    const queryClient = useQueryClient();
    const {
        data: coordinators,
        error,
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ["verified-coordinators"],
        queryFn: getVerifiedCoordinators,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        cacheTime: 2 * 60 * 1000, // Cache persists for 2 minute
    });

    const {
        data: agencyOptions,
        error: errorAgency,
        isLoading: isLoadingAgency,
    } = useQuery({
        queryKey: ["all-agency-options"],
        queryFn: async () => {
            const res = await getAllAgencyOptions();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    if (isLoading || isLoadingAgency || isFetching) return <Skeleton />;

    if (error || errorAgency)
        return <div>Error: {error?.message || errorAgency?.message}</div>;

    return (
        <div>
            {coordinators.length === 0 ? (
                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 ">
                    <Users2Icon className="w-12 h-12 mb-4 text-primary" />
                    <h2 className="text-xl font-semibold">
                        No Agency Coordinators Yet
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Verified coordinators will appear here.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="justify-end hidden md:flex">
                        <button
                            className="btn btn-circle btn-warning"
                            onClick={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["verified-coordinators"],
                                })
                            }
                        >
                            <RefreshCcw className="h-4" />
                        </button>
                    </div>
                    <DataTable
                        columns={adminCoordinatorColumns}
                        data={coordinators}
                        isLoading={isLoading}
                        agencyOptions={agencyOptions}
                    />
                </>
            )}
        </div>
    );
}
