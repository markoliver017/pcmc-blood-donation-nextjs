"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@components/ui/badge";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import { fetchBloodRequests } from "@action/bloodRequestAction";
import { DataTable } from "./Datatable";
import { Button } from "@components/ui/button";
import { Eye, Pencil, SquareMenu, XCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import { updateBloodRequestStatus } from "@action/bloodRequestAction";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

const getColumns = (handleUpdate) => {
    const queryClient = useQueryClient();
    const { mutate: cancelRequest, isPending: isCancelling } = useMutation({
        mutationFn: async (id) => {
            const res = await updateBloodRequestStatus({
                id,
                status: "cancelled",
            });
            if (!res.success) throw res;
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
            notify({ message: "Request cancelled successfully" });
        },
        onError: (error) => {
            notify({
                error: true,
                message: error?.message || "Failed to cancel request",
            });
        },
    });
    return [
        {
            accessorKey: "blood_component",
            header: "Component",
            cell: ({ row }) => {
                const component = row.original.blood_component;
                return component.charAt(0).toUpperCase() + component.slice(1);
            },
        },
        {
            accessorKey: "blood_type.blood_type",
            header: "Blood Type",
        },
        {
            accessorKey: "no_of_units",
            header: "Units",
        },
        {
            accessorKey: "patient_name",
            header: "Patient Name",
            cell: ({ row }) => {
                const donor = row.original.user;
                return donor
                    ? `${donor.first_name} ${donor.last_name}`
                    : row.original.patient_name;
            },
        },
        {
            accessorKey: "hospital_name",
            header: "Hospital",
        },
        {
            accessorKey: "date",
            header: "Date Needed",
            cell: ({ row }) =>
                format(new Date(row.original.date), "MMM dd, yyyy"),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                const colors = {
                    pending: "bg-orange-100 text-orange-800",
                    fulfilled: "bg-green-100 text-green-800",
                    expired: "bg-red-100 text-red-800",
                };
                return (
                    <Badge className={colors[status]}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const data = row.original;
                const id = data.id;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-min p-0">
                                <span className="sr-only">Open menu</span>
                                <SquareMenu />
                                <span className="block md:hidden">Menus</span>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdate(id)}
                                className="flex items-center gap-1"
                            >
                                {data.status !== "pending" ? (
                                    <Eye className="w-4 h-4" />
                                ) : (
                                    <Pencil className="w-4 h-4" />
                                )}
                                <span className="hidden md:inline">
                                    {data.status !== "pending"
                                        ? "View"
                                        : "Update"}
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                size="sm"
                                variant="destructive"
                                disabled={
                                    isCancelling || data.status !== "pending"
                                }
                                onClick={() => {
                                    SweetAlert({
                                        title: "Cancel Request?",
                                        text: "Are you sure you want to cancel this blood request? This action cannot be undone.",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "Yes, cancel",
                                        cancelButtonText: "No",
                                        onConfirm: () => cancelRequest(id),
                                    });
                                }}
                                className="flex items-center gap-1"
                            >
                                <XCircle className="w-4 h-4" />
                                <span className="hidden md:inline">Cancel</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};

export default function BloodRequestList({ handleUpdate }) {
    const { data: response, isLoading } = useQuery({
        queryKey: ["blood-requests"],
        queryFn: fetchBloodRequests,
        stale: 0,
    });

    const requests = response?.success ? response.data : [];
    const columns = getColumns(handleUpdate);

    if (isLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (!response?.success) {
        return (
            <div className="text-center py-4 text-red-500">
                {response?.message || "Failed to load requests"}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <DataTable columns={columns} data={requests} />
        </div>
    );
}
