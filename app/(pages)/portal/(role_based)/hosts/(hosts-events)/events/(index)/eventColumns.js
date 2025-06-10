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
import moment from "moment";
import parse from "html-react-parser";

export const eventColumns = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID#" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        filterFn: "columnFilter",
    },

    {
        accessorKey: "from_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date Started" />
        ),
        cell: ({ getValue }) => moment(getValue()).format("MMM DD, YYYY"),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "to_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date Ended" />
        ),
        cell: ({ getValue }) => moment(getValue()).format("MMM DD, YYYY"),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "requester.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Organizer" />
        ),
        cell: ({ getValue }) => getValue(),
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
            const status = data.status.toUpperCase();
            if (status == "APPROVED") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-success">
                        {status}
                    </div>
                );
            } else if (status == "FOR APPROVAL") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-warning">
                        {status}
                    </div>
                );
            } else {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-error">
                        {status}
                    </div>
                );
            }
        },
    },

    // {
    //     accessorKey: "description",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Description" />
    //     ),
    //     cell: ({ getValue }) => parse(getValue()),
    //     filterFn: "columnFilter",
    // },

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

                        <Link href={`/portal/hosts/events/${data.id}`}>
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>Show</span>
                            </DropdownMenuItem>
                        </Link>
                        {/* <Link href={`/portal/admin/users/${data.id}/edit`}>
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        </Link> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
