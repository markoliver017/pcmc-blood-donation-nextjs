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
import {
    CheckIcon,
    Command,
    Eye,
    MoreHorizontal,
    Pencil,
    XIcon,
} from "lucide-react";
import Link from "next/link";
import moment from "moment";
import VerifyEvent from "@components/events/VerifyEvent";
import RejectEvent from "@components/events/RejectEvent";
// import parse from "html-react-parser";

export const eventColumns = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID#" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "agency.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency" />
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
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
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
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date Created" />
        ),
        cell: ({ getValue }) => moment(getValue()).format("MMM DD, YYYY"),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "validator.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified by" />
        ),
        cell: ({ getValue }) => getValue(),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "editor.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated by" />
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
            const status = data.status;

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

                        <Link href={`/portal/admin/events/${data.id}`}>
                            <DropdownMenuItem className="space-x-2 btn btn-ghost btn-primary">
                                <Eye className="w-4 h-4" />
                                <span>Show</span>
                            </DropdownMenuItem>
                        </Link>
                        <Link href={`/portal/admin/events/${data.id}/edit`}>
                            <DropdownMenuItem className="space-x-2 btn btn-ghost btn-warning">
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        </Link>
                        {status == "for approval" ? (
                            <>
                                <DropdownMenuItem className="space-x-2 flex justify-between">
                                    <VerifyEvent
                                        eventData={{
                                            id: data.id,
                                            status: "approved",
                                        }}
                                        label="Approve"
                                        className="btn btn-ghost btn-success"
                                        formClassName="w-full"
                                        icon={<CheckIcon />}
                                    />
                                </DropdownMenuItem>
                                <div className="px-2 flex justify-between">
                                    <RejectEvent
                                        eventId={data.id}
                                        className="w-full btn btn-ghost btn-error"
                                    />
                                </div>
                            </>
                        ) : (
                            ""
                        )}

                        {status == "approved" ? (
                            <DropdownMenuItem className="space-x-2 flex justify-between">
                                <VerifyEvent
                                    eventData={{
                                        id: data.id,
                                        status: "cancelled",
                                    }}
                                    label="Cancel"
                                    className="btn btn-ghost btn-error"
                                    formClassName="w-full"
                                    icon={<XIcon />}
                                />
                            </DropdownMenuItem>
                        ) : (
                            ""
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
