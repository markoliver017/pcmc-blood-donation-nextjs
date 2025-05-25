// import { Checkbox } from "@components/ui/checkbox";
import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";
import { formatFormalName } from "@lib/utils/string.utils";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { CheckIcon, Command, Eye, MoreHorizontal, XIcon } from "lucide-react";
import Link from "next/link";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import VerifyAgency from "./VerifyAgency";
import RejectDialog from "./RejectDialog";
export const columns = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID#" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Agency/Company Name"
            />
        ),
        filterFn: "columnFilter",
        cell: ({ getValue }) => (
            <span className="font-bold text-lg text-center block">
                {getValue()}
            </span>
        ),
    },
    {
        accessorKey: "file_url",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Avatar" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <CustomAvatar
                    avatar={data.file_url || "/default_company_avatar.png"}
                    className="w-16 h-16"
                />
            );
        },
    },

    {
        accessorKey: "head.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency Head" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            return <div className="flex items-center">{data.head.name}</div>;
        },
        filterFn: "columnFilter",
    },
    {
        // id: "date_reported",
        accessorKey: "agency_email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue }) => (
            <a className="link link-primary" href={`mailto:${getValue()}`}>
                {getValue()}
            </a>
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "contact_number",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact Number" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Address" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "barangay",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Barangay" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "city_municipality",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="City/Municipality" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "province",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Area" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "organization_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Org. Type" />
        ),
        cell: ({ getValue }) => <>{formatFormalName(getValue())}</>,
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
            if (status == "activated") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-success">
                        {status.toUpperCase()}
                    </div>
                );
            }
            if (status == "deactivated") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-warning">
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
                <div className="badge p-2 font-semibold text-xs badge-primary text-nowrap">
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

                        <DropdownMenuItem className="flex items-center justify-center space-x-2">
                            <Link
                                className="btn btn-block btn-primary hover:btn-neutral hover:text-blue-400"
                                href={`./agencies/${data.id}`}
                            >
                                <Eye className="w-4 h-4" />
                                <span>Show</span>
                            </Link>
                        </DropdownMenuItem>

                        {status == "for approval" ? (
                            <>
                                <DropdownMenuItem className="space-x-2 flex justify-between">
                                    <VerifyAgency
                                        agencyData={{
                                            id: data.id,
                                            status: "activated",
                                        }}
                                        label="Approve"
                                        className="btn btn-block btn-success"
                                        formClassName="w-full"
                                        icon={<CheckIcon />}
                                    />
                                </DropdownMenuItem>
                                <div className="px-2 flex justify-between">
                                    <RejectDialog
                                        agencyId={data.id}
                                        className="w-full btn-error"
                                    />
                                </div>
                            </>
                        ) : (
                            ""
                        )}
                        {status == "activated" ? (
                            <DropdownMenuItem className="space-x-2">
                                <VerifyAgency
                                    agencyData={{
                                        id: data.id,
                                        status: "deactivated",
                                    }}
                                    label="Deactivate"
                                    className="btn btn-block btn-warning hover:text-warning"
                                    formClassName="w-full"
                                    icon={<XIcon />}
                                />
                            </DropdownMenuItem>
                        ) : (
                            ""
                        )}
                        {status == "deactivated" ? (
                            <DropdownMenuItem className="space-x-2">
                                <VerifyAgency
                                    agencyData={{
                                        id: data.id,
                                        status: "activated",
                                    }}
                                    label="Activate"
                                    className="btn btn-block btn-success"
                                    formClassName="w-full"
                                    icon={<CheckIcon />}
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
