"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Building2, Plus, RefreshCcw } from "lucide-react";
import { DataTable } from "./Datatable";
import { columns } from "./columns";
import Skeleton from "@components/ui/skeleton";
import { fetchVerifiedAgencies } from "@/action/agencyAction";
import { Card } from "@components/ui/card";

export default function AgencyList() {
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

    if (isLoading || isFetching) return <Skeleton />;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="flex justify-between mb-5">
                <Link
                    href="./agencies/create"
                    className="btn btn-lg btn-accent"
                >
                    <Plus /> Create
                </Link>
                <button
                    className="btn btn-circle btn-warning"
                    onClick={() =>
                        queryClient.invalidateQueries({
                            queryKey: ["verified-agencies"],
                        })
                    }
                >
                    <RefreshCcw className="h-4" />
                </button>
            </div>

            {agencies.length === 0 ? (
                <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 ">
                    <Building2 className="w-12 h-12 mb-4 text-primary" />
                    <h2 className="text-xl font-semibold">
                        No Partner Agencies Yet
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Once an agency is verified, it will appear here.
                    </p>
                </Card>
            ) : (
                <DataTable
                    columns={columns}
                    data={agencies}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
