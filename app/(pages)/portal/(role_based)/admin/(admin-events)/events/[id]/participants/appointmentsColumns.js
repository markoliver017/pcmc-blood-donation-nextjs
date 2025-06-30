"use client";
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
import { Cog, Command, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { MdCheckCircleOutline } from "react-icons/md";

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

export const appointmentsColumns = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID#" />
        ),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "donor.user.image",
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
        accessorKey: "donor.user.full_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue, row }) => {
            const data = row.original;
            const isVerified = data.donor.is_data_verified;
            return (
                <>
                    {/* <span>{getValue()}</span>{" "}
                    {isVerified ? (
                        <div className="badge badge-success p-1 rounded-full">
                            <Check className="h-4 w-4" />
                        </div>
                    ) : (
                        <div className="badge badge-warning p-1 rounded-full">
                            <QuestionMarkCircledIcon className="h-4 w-4" />
                        </div>
                    )} */}
                    {isVerified ? (
                        <div className="btn btn-ghost p-2 font-bold rounded-full">
                            {getValue()}{" "}
                            <MdCheckCircleOutline className="h-4 w-4 text-green-500" />
                        </div>
                    ) : (
                        <div className="btn btn-ghost p-2 font-bold rounded-full">
                            {getValue()}{" "}
                            <QuestionMarkCircledIcon className="h-4 w-4 text-red-500" />
                        </div>
                    )}
                </>
            );
        },
        filterFn: "columnFilter",
    },
    {
        accessorKey: "time_schedule.formatted_time",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Time Schedule" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "donor.date_of_birth",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date of Birth" />
        ),
        cell: ({ getValue }) => (
            <span>{moment(getValue()).format("MMM DD, YYYY")}</span>
        ),
        filterFn: "columnFilter",
    },
    {
        id: "age",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Age" />
        ),
        cell: ({ row }) => {
            const dob = row.original?.donor?.date_of_birth;
            const age = dob ? calculateAge(dob) : "N/A";
            return <div>{age} years old</div>;
        },
        filterFn: "columnFilter",
    },
    {
        accessorKey: "donor.user.gender",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sex" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },

    {
        accessorKey: "donor.blood_type.blood_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Blood Type" />
        ),
        cell: ({ getValue, row }) => {
            const blood_type = getValue();
            const data = row.original;
            const isVerified = data?.donor?.is_bloodtype_verified;
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
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Progress status" />
        ),
        filterFn: "columnFilter",
        cell: ({ row }) => {
            const data = row.original;
            const status = data.status;
            if (status == "registered") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-primary">
                        {status.toUpperCase()}
                    </div>
                );
            }
            if (status == "deferred") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-warning">
                        {status.toUpperCase()}
                    </div>
                );
            }
            if (status == "collected") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-success">
                        DONATED
                    </div>
                );
            }
            return (
                <div className="badge p-2 font-semibold text-xs badge-error">
                    {status.toUpperCase()}
                </div>
            );
        },
    },
    {
        accessorKey: "physical_exam",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Physical Examination"
            />
        ),
        filterFn: "columnFilter",
        cell: ({ getValue }) => {
            const exam = getValue();
            if (!exam) {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-secondary">
                        Not Conducted Yet
                    </div>
                );
            }

            if (exam.eligibility_status == "ACCEPTED") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-success">
                        {exam.eligibility_status.toUpperCase()}
                    </div>
                );
            }
            if (exam.eligibility_status == "TEMPORARILY-DEFERRED") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-warning">
                        {exam.eligibility_status.toUpperCase()}
                    </div>
                );
            }
            return (
                <div className="badge p-2 font-semibold text-xs badge-error">
                    {exam.eligibility_status.toUpperCase()}
                </div>
            );
        },
    },
    {
        accessorKey: "blood_collection",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Blood Collection" />
        ),
        filterFn: "columnFilter",
        cell: ({ getValue }) => {
            const collection = getValue();
            if (!collection) {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-secondary">
                        Not Conducted Yet
                    </div>
                );
            }

            if (collection?.volume) {
                return (
                    <div className="badge p-2 font-semibold text-lg">
                        {Number.isInteger(Number(collection?.volume))
                            ? Number(collection?.volume).toString()
                            : Number(collection?.volume).toFixed(2)}{" "}
                        ml
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

                        <Link href={`/portal/admin/appointments/${data.id}`}>
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Cog className="w-4 h-4" />
                                <span>Manage</span>
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
