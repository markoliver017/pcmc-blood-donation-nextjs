"use client";
import { getUsers } from "@/action/userAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserLoading from "../UserLoading";
import Link from "next/link";
import { Plus, RefreshCcw } from "lucide-react";
import { DataTable } from "./Datatable";
import { columns } from "./columns";

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

    if (isLoading || isFetching) return <UserLoading />;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="space-x-5">
                <Link href="/users/create" className="btn btn-neutral">
                    <Plus /> Create
                </Link>
                <button
                    className="btn btn-circle btn-secondary"
                    onClick={() =>
                        queryClient.invalidateQueries({ queryKey: ["users"] })
                    }
                >
                    <RefreshCcw />
                </button>
            </div>
            <DataTable columns={columns} data={users} isLoading={isLoading} />
            {/* <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => (
                        <tr key={user.id}>
                            <td>{i + 1}</td>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link
                                    className="btn btn-link"
                                    href={`/users/${user.id}`}
                                >
                                    Show
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    );
}
