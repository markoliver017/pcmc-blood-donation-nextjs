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

const getColumns = (handleUpdate) => [
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
        cell: ({ row }) => format(new Date(row.original.date), "MMM dd, yyyy"),
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
            return (
                <button onClick={() => handleUpdate(row.original.id)}>
                    Update
                </button>
            );
        },
    },
];

export default function BloodRequestList({ handleUpdate }) {
    const { data: response, isLoading } = useQuery({
        queryKey: ["blood-requests"],
        queryFn: fetchBloodRequests,
    });

    const requests = response?.success ? response.data : [];

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

    const columns = getColumns(handleUpdate);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <DataTable columns={columns} data={requests} />
        </div>
    );
}
