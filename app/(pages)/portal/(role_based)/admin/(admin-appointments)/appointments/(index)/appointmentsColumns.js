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
import StatusBadge from "@components/ui/StatusBadge";

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
        accessorKey: "donor.user.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue, row }) => {
            const data = row.original;
            const isVerified = data.donor.is_data_verified;
            return (
                <>
                    {isVerified ? (
                        <div className="flex-items-center p-2 font-bold rounded-full">
                            {getValue()}{" "}
                            <MdCheckCircleOutline className="h-4 w-4 text-green-500" />
                        </div>
                    ) : (
                        <div className="flex-items-center p-2 font-bold rounded-full">
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
        accessorKey: "donor.user.email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "donor.agency.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "time_schedule.event.title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Event Title" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "time_schedule.event.date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
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
            const data = row.original;
            const isVerified = data.donor.is_bloodtype_verified;
            return (
                <>
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
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        filterFn: "columnFilter",
        cell: ({ row }) => {
            const status = row.original.status;
            return <StatusBadge status={status} />;
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
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
