"use client";
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
import Link from "next/link";
import { formatFormalName } from "@lib/utils/string.utils";
import { MdBloodtype, MdCheckCircleOutline } from "react-icons/md";
import { Mail, Command, Eye, MoreHorizontal } from "lucide-react";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

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
        accessorKey: "user.email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue }) => {
            return (
                <>
                    <span className="flex-items-center"><Mail className="w-3" /> {getValue()}</span>{" "}
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
                            <div className="btn btn-ghost p-2 font-bold rounded-full">
                                {blood_type}{" "}
                                <MdCheckCircleOutline className="h-4 w-4 text-green-500" />
                            </div>
                        ) : (
                            <div className="btn btn-ghost p-2 font-bold rounded-full">
                                {blood_type}{" "}
                                <QuestionMarkCircledIcon className="h-4 w-4 text-warning" />
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
        cell: ({ getValue, row }) => {
            const blood_collections = getValue();
            const data = row.original;
            const prevCount = Number(data?.blood_history?.previous_donation_count || 0);
            const donationCount = Number(Array.isArray(blood_collections) ? blood_collections.length : 0) + prevCount;

            const prevVolume = Number(data?.blood_history?.previous_donation_volume || 0);
            const donationVolume = (Array.isArray(blood_collections) ? blood_collections.reduce((acc, collection) => acc + Number(collection?.volume), 0) : 0) + prevVolume;

            return (
                <span className="btn text-center text-xl font-bold border-0 rounded-2xl text-red-500 text-shadow-lg/25 text-shadow-red-400 ">
                    <span>{donationCount}
                    </span>
                    <span className="text-base font-semibold italic">
                        ({donationVolume} ml)
                    </span>
                    <MdBloodtype className="text-xs" />
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
                        <Button variant="outline" className="h-8 w-8 p-0">
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

                        <Link href={`/portal/admin/blood-collections/${data.id}`}>
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>More Details</span>
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
