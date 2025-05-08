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

export function getColumns(setSelectedData) {
    return [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={
        //                 table.getIsAllPageRowsSelected() ||
        //                 (table.getIsSomePageRowsSelected() && "indeterminate")
        //             }
        //             onCheckedChange={(value) =>
        //                 table.toggleAllPageRowsSelected(!!value)
        //             }
        //             aria-label="Select all"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Select row"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID#" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "request_date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Report Date" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "company",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Company/Agency" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "profession",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Profession" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "purpose",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Purpose" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            filterFn: "columnFilter",
            cell: ({ row }) => {
                const data = row.original;
                const status = data.status;
                if (status == "approved") {
                    return (
                        <div className="badge p-2 font-semibold text-xs badge-success">
                            {status.toUpperCase()}
                        </div>
                    );
                }
                if (status == "rejected") {
                    return (
                        <div className="badge p-2 font-semibold text-xs badge-error">
                            {status.toUpperCase()}
                        </div>
                    );
                }
                return (
                    <div className="badge p-2 font-semibold text-xs badge-primary">
                        {status.toUpperCase()}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Action" />
            ),
            cell: ({ row }) => {
                const data = row.original;

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

                            {/* <Link href={`/admin/reports/${report.id}`}> */}
                            <DropdownMenuItem
                                onClick={() => setSelectedData(data)}
                                className="flex items-center space-x-2"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Show</span>
                            </DropdownMenuItem>
                            {/* </Link> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
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
