"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Users2Icon } from "lucide-react";
import Skeleton from "@components/ui/skeleton";
import { Card } from "@components/ui/card";
import { DataTable } from "@components/coordinators/Datatable";
import { hostCoordinatorColumns } from "@components/coordinators/hostCoordinatorColumns";
import { getVerifiedCoordinatorsByAgency } from "@/action/hostCoordinatorAction";

export default function CoordinatorList() {
    const queryClient = useQueryClient();
    const {
        data: coordinators,
        error,
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ["verified-coordinators"],
        queryFn: getVerifiedCoordinatorsByAgency,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        cacheTime: 2 * 60 * 1000, // Cache persists for 2 minute
    });

    if (isLoading || isFetching) return <Skeleton />;

    if (error) return <div>Error: {error.message}</div>;

    // return <pre>{JSON.stringify(coordinators, null, 2)}</pre>;
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
                    <div className="flex justify-end">
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
                        columns={hostCoordinatorColumns}
                        data={coordinators}
                        isLoading={isLoading}
                    />
                </>
            )}
        </div>
    );
}
