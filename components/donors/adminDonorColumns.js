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
import { Command, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import { formatFormalName } from "@lib/utils/string.utils";

function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const adminDonorColumns = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID#" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "user.image",
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
        accessorKey: "user.full_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Full Name" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "agency.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency Name" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "user.email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        filterFn: "columnFilter",
    },
    {
        id: "blood_type",
        accessorKey: "blood_type.blood_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Blood Type" />
        ),
        cell: ({ getValue }) => {
            const bloodType = getValue("blood_type");
            return <b>{bloodType}</b>;
        },
        filterFn: "columnFilter",
    },
    {
        accessorKey: "user.gender",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sex" />
        ),
        cell: ({ getValue }) => formatFormalName(getValue()),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "contact_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "date_of_birth",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date of Birth" />
        ),
        cell: ({ row }) => {
            const dateOfBirth = row.getValue("date_of_birth");
            return <div>{moment(dateOfBirth).format("MMMM D, YYYY")} </div>;
        },
        filterFn: "columnFilter",
    },
    {
        id: "age",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Age" />
        ),
        cell: ({ row }) => {
            const dateOfBirth = row.getValue("date_of_birth");
            const age = calculateAge(dateOfBirth);
            return <div>{age} years old</div>;
        },
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
            if (status == "ACTIVATED") {
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

                        <Link href={`/portal/admin/donors/${data.id}`}>
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
