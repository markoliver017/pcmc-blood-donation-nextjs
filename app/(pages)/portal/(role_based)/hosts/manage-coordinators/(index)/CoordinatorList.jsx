"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Users2Icon } from "lucide-react";
import Skeleton from "@components/ui/skeleton";
import { Card } from "@components/ui/card";
import { DataTable } from "@components/coordinators/Datatable";
import { hostCoordinatorColumns } from "@components/coordinators/hostCoordinatorColumns";
import { getAllAgencyOptions } from "@/action/adminEventAction";

export default function CoordinatorList({ coordinators_query }) {
    const queryClient = useQueryClient();

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

    if (
        coordinators_query.isLoading ||
        coordinators_query.isFetching ||
        isLoadingAgency
    )
        return <Skeleton />;

    if (coordinators_query.error || errorAgency)
        return (
            <div>
                Error: {coordinators_query.error.message || errorAgency.message}
            </div>
        );

    // return <pre>{JSON.stringify(coordinators, null, 2)}</pre>;
    return (
        <div>
            {coordinators_query.data.length === 0 ? (
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
                        data={coordinators_query.data}
                        isLoading={coordinators_query.isLoading}
                        agencyOptions={agencyOptions}
                    />
                </>
            )}
        </div>
    );
}
