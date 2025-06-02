// import { Checkbox } from "@components/ui/checkbox";
import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { Command, Eye, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

const columnFilterFn = (row, id, filterValue) => {
    if (!filterValue || filterValue.length === 0) return true;
    const roles = row.getValue(id);
    const roleNames = roles.map((role) => role.role_name);
    return filterValue.some((value) => roleNames.includes(value));
};

export const columns = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID#" />
        ),
        filterFn: "columnFilter",
    },
    {
        // id: "date_reported",
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "image",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Avatar" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <Image
                    src={data.image || "/default_avatar.png"}
                    className="flex-none rounded-4xl"
                    width={50}
                    height={50}
                    alt="Logo"
                />
            );
        },
    },

    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Display Name" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "first_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="First Name" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "middle_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Middle Name" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "roles",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ getValue }) => {
            const roles = getValue();
            return (
                <div className="flex flex-col">
                    {roles.map((role, i) => (
                        <span key={i}>{role?.role_name}</span>
                    ))}
                </div>
            );
        },
        filterFn: columnFilterFn,
    },
    {
        accessorKey: "gender",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sex" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "creator.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created by" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        filterFn: "columnFilter",
        cell: ({ row }) => {
            const data = row.original;
            const status = data.is_active;
            if (status) {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-success">
                        Activated
                    </div>
                );
            } else {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-error">
                        Deactivated
                    </div>
                );
            }
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

                        <Link href={`/portal/admin/users/${data.id}`}>
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>Show</span>
                            </DropdownMenuItem>
                        </Link>
                        <Link href={`/portal/admin/users/${data.id}/edit`}>
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
