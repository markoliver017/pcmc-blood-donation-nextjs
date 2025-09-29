"use client";
import { getUsers } from "@/action/userAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Link from "next/link";
import { Plus, RefreshCcw } from "lucide-react";
import { DataTable } from "./Datatable";
import { columns } from "./columns";
import Skeleton_user from "@components/ui/Skeleton_user";

export default function UsersList() {
    const queryClient = useQueryClient();
    const {
        data: users,
        error,
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        cacheTime: 2 * 60 * 1000, // Cache persists for 2 minute
    });

    if (isLoading || isFetching) return <Skeleton_user />;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="flex justify-between">
                <Link
                    href="./users/create"
                    className="btn btn-sm md:btn-lg btn-neutral dark:btn-accent"
                >
                    <Plus /> Create
                </Link>
                <button
                    className="btn btn-circle btn-warning hidden md:block"
                    onClick={() =>
                        queryClient.invalidateQueries({ queryKey: ["users"] })
                    }
                >
                    <RefreshCcw className="h-4" />
                </button>
            </div>
            <DataTable columns={columns} data={users} isLoading={isLoading} />
        </div>
    );
}
