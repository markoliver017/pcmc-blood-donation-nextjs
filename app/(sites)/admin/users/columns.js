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
import Image from "next/image";
export function getColumns(handleEdit) {
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
            id: "avatar_url",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Avatar" />
            ),
            cell: ({ row }) => {
                const data = row.original;
                const avatar_url = data.File?.url || "/default_avatar.png";
                return (
                    <Image
                        src={avatar_url || "/default_avatar.png"}
                        className="rounded-4xl"
                        width={50}
                        height={50}
                        alt="Avatar"
                    />
                );
            },
        },
        {
            accessorKey: "full_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "gender",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Gender" />
            ),
            filterFn: "columnFilter",
            cell: ({ getValue }) => {
                const value = getValue();
                return (
                    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                );
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            filterFn: "columnFilter",
        },
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

                            <DropdownMenuItem
                                className="flex items-center space-x-2"
                                onClick={() => handleEdit(report)}
                            >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                            </DropdownMenuItem>
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
