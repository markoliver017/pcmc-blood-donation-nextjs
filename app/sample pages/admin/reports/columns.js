// import { Checkbox } from "@components/ui/checkbox";
import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { Command, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
export function getColumns() {
    return [
        {
            id: "actions",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Action" />
            ),
            cell: ({ row }) => {
                const report = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="flex items-center space-x-2">
                                <Command className="w-3 h-3" />
                                <span>Actions</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <Link href={`/admin/reports/${report.id}`}>
                                <DropdownMenuItem className="flex items-center space-x-2">
                                    <Eye className="w-4 h-4" />
                                    <span>Show</span>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            id: "medication_error_date",
            accessorKey: "error_date",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Medication Error Date"
                />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID#" />
            ),
            filterFn: "columnFilter",
        },
        {
            id: "date_reported",
            accessorKey: "report_date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Date Reported" />
            ),
            filterFn: "columnFilter",
        },
        {
            id: "error_type",
            accessorKey: "error_type.name",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Medication Error Type"
                />
            ),
            cell: ({ row }) => {
                const data = row.original;
                const errorType = data.error_type.name;
                const otherErrorType = data.other_error_type;
                if (errorType === "Others" && otherErrorType) {
                    return (
                        <div>
                            {errorType} <i>({otherErrorType})</i>
                        </div>
                    );
                } else {
                    return <div className="flex items-center">{errorType}</div>;
                }
            },
            filterFn: "columnFilter",
        },

        {
            accessorKey: "patient_sex",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Patient Sex" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "patient_weight",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Patient Weight" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "patient_height",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Patient Height" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "exact_prescription",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Exact Prescription"
                />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "incident_description",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Incident Description"
                />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "workplace_environment",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Workplace Environment"
                />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "patient_condition",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Patient Condition"
                />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "immediate_actions",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Immediate Action"
                />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "corrective_actions",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Corrective Action"
                />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "preventive_actions",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Preventive Action"
                />
            ),
            filterFn: "columnFilter",
        },

        // {
        //     accessorKey: 'patient_sex',
        //     header: ({ column }) => (
        //         <DataTableColumnHeader column={column} title="Patient Sex" />
        //     ),
        //     cell: ({ row }) => {
        //         const data = row.original;
        //         return <div className="flex items-center">{data.email}</div>;
        //     },
        // },
    ];
}
