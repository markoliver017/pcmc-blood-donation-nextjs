"use client";
import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";
import { formatFormalName } from "@lib/utils/string.utils";

import { Pen } from "lucide-react";
import Link from "next/link";
import CustomAvatar from "@components/reusable_components/CustomAvatar";

export const ListOfAgenciesColumns = [
    // {
    //     accessorKey: "id",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="ID#" />
    //     ),
    //     filterFn: "columnFilter",
    // },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Agency/Company Name"
            />
        ),
        filterFn: "columnFilter",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex flex-col justify-center items-center">
                    <CustomAvatar
                        avatar={data.file_url || "/default_company_avatar.png"}
                        className="w-16 h-16"
                    />
                    <span>{data.name}</span>
                </div>
            );
        },
    },
    {
        // id: "date_reported",
        accessorKey: "head.email",
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
        id: "actions",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Action" />
        ),
        cell: ({ row }) => {
            const data = row.original;

            return (
                <Link
                    className="btn btn-outline btn-accent hover:btn-neutral hover:text-blue-400"
                    href={`/register/donors/${data.name}`}
                >
                    <Pen className="w-2 h-2" />
                    <span>Register</span>
                </Link>
            );
        },
    },
];
