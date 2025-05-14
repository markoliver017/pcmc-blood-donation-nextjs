"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, RefreshCcw } from "lucide-react";
import { DataTable } from "./Datatable";
import { columns } from "./columns";
import Skeleton from "@components/ui/skeleton";
import { fetchAgencies } from "@/action/agencyAction";

export default function AgencyList() {
    const queryClient = useQueryClient();
    const {
        data: agencies,
        error,
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ["agencies"],
        queryFn: fetchAgencies,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        cacheTime: 2 * 60 * 1000, // Cache persists for 2 minute
    });

    if (isLoading || isFetching) return <Skeleton />;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="space-x-5">
                <Link href="/agencies/create" className="btn btn-neutral">
                    <Plus /> Create
                </Link>
                <button
                    className="btn btn-circle btn-secondary"
                    onClick={() =>
                        queryClient.invalidateQueries({
                            queryKey: ["agencies"],
                        })
                    }
                >
                    <RefreshCcw />
                </button>
            </div>
            <DataTable
                columns={columns}
                data={agencies}
                isLoading={isLoading}
            />
        </div>
    );
}
