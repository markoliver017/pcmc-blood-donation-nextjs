"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Users2Icon } from "lucide-react";
import Skeleton from "@components/ui/skeleton";
import { Card } from "@components/ui/card";

import { DataTable } from "@components/donors/Datatable";
import { adminDonorColumns } from "@components/donors/adminDonorColumns";

export default function DonorList({ donors, isLoading, error }) {
    const queryClient = useQueryClient();

    if (isLoading) return <Skeleton />;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="relative">
            {donors.length === 0 ? (
                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 ">
                    <Users2Icon className="w-12 h-12 mb-4 text-primary" />
                    <h2 className="text-xl font-semibold">
                        No Agency donors yet
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Verified donors will appear here.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="absolute top-[-50px] right-2">
                        <button
                            className="btn btn-circle btn-warning"
                            onClick={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["verified-donors"],
                                })
                            }
                        >
                            <RefreshCcw className="h-4" />
                        </button>
                    </div>
                    <DataTable
                        columns={adminDonorColumns}
                        data={donors}
                        isLoading={isLoading}
                    />
                </>
            )}
        </div>
    );
}
