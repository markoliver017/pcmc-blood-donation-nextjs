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
import { Check, Command, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { formatFormalName } from "@lib/utils/string.utils";
import moment from "moment";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

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
                    <span>{getValue()}</span>{" "}
                    {isVerified ? (
                        <div className="badge badge-success p-1 rounded-full">
                            <Check className="h-4 w-4" />
                        </div>
                    ) : (
                        <div className="badge badge-warning p-1 rounded-full">
                            <QuestionMarkCircledIcon className="h-4 w-4" />
                        </div>
                    )}
                </>
            );
        },
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
            const blood_type = getValue();
            const data = row.original;
            const isVerified = data?.donor?.is_bloodtype_verified;
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
    // {
    //     accessorKey: "patient_name",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Patient Name" />
    //     ),
    //     cell: ({ getValue }) => <span>{getValue() || "N/A"}</span>,
    //     filterFn: "columnFilter",
    // },
    //     {
    //     accessorKey: "donor_type",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Donor Type" />
    //     ),
    //     cell: ({ getValue }) => <span>{formatFormalName(getValue())}</span>,
    //     filterFn: "columnFilter",
    // },

    // {
    //     accessorKey: "collection_method",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Collection Method" />
    //     ),
    //     cell: ({ getValue }) => <span>{formatFormalName(getValue())}</span>,
    //     filterFn: "columnFilter",
    // },
    // {
    //     accessorKey: "comments",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Remarks" />
    //     ),
    //     filterFn: "columnFilter",
    // },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
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
            if (status == "donated") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-success">
                        {status.toUpperCase()}
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
