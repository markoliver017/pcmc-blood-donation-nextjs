"use client";
// import { Checkbox } from "@components/ui/checkbox";
import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";
import Image from "next/image";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@components/ui/dropdown-menu";
// import { Button } from "@components/ui/button";
// import { Check, Command, Eye, MoreHorizontal } from "lucide-react";
// import Link from "next/link";
import { formatFormalName } from "@lib/utils/string.utils";

// import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

// function calculateAge(dateOfBirth) {
//     const today = new Date();
//     const birthDate = new Date(dateOfBirth);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//     }
//     return age;
// }

export const donorCollectionColumns = [
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
        cell: ({ getValue }) => {
            const imageSrc = getValue();
            return (
                <Image
                    src={imageSrc || "/default_avatar.png"}
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
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue }) => {
            return (
                <>
                    <span>{getValue()}</span>{" "}
                </>
            );
        },
        filterFn: "columnFilter",
    },
    {
        accessorKey: "user.gender",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sex" />
        ),
        cell: ({ getValue }) => {
            return (
                <>
                    <span>{formatFormalName(getValue())}</span>{" "}
                </>
            );
        },
        filterFn: "columnFilter",
    },
    {
        accessorKey: "agency.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },

    {
        accessorKey: "blood_type.blood_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Blood Type" />
        ),
        cell: ({ getValue, row }) => {
            const blood_type = getValue();
            const data = row.original;
            const isVerified = data?.is_bloodtype_verified;
            if (blood_type) {
                return (
                    <>
                        {isVerified ? (
                            <div className="badge badge-success p-2 rounded-full">
                                {formatFormalName(blood_type)}
                            </div>
                        ) : (
                            <div className="badge badge-warning p-2 rounded-full">
                                {formatFormalName(blood_type)}
                            </div>
                        )}
                    </>
                );
            }
            return "Not Specified";
        },
        filterFn: "columnFilter",
    },
    {
        accessorKey: "blood_collections",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Total Blood Donations"
            />
        ),
        cell: ({ getValue }) => {
            const blood_collections = getValue();
            console.log("blood_collections", blood_collections);
            return (
                <span className="block text-center text-lg font-bold w-32">
                    {Array.isArray(blood_collections)
                        ? blood_collections.length
                        : 0}
                </span>
            );
        },
        filterFn: "columnFilter",
    },
    // {
    //     accessorKey: "remarks",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Remarks" />
    //     ),
    //     cell: ({ getValue }) => <span>{getValue()}</span>,
    //     filterFn: "columnFilter",
    // },

    // {
    //     id: "actions",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Action" />
    //     ),
    //     cell: ({ row }) => {
    //         const data = row.original;

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel className="flex items-center space-x-2">
    //                         <Command className="w-3 h-3" />
    //                         <span>Actions</span>
    //                     </DropdownMenuLabel>
    //                     <DropdownMenuSeparator />

    //                     <Link href={`/portal/admin/appointments/${data.id}`}>
    //                         <DropdownMenuItem className="flex items-center space-x-2">
    //                             <Eye className="w-4 h-4" />
    //                             <span>Show</span>
    //                         </DropdownMenuItem>
    //                     </Link>
    //                     {/* <Link href={`/portal/admin/users/${data.id}/edit`}>
    //                         <DropdownMenuItem className="flex items-center space-x-2">
    //                             <Pencil className="w-4 h-4" />
    //                             <span>Edit</span>
    //                         </DropdownMenuItem>
    //                     </Link> */}
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];
