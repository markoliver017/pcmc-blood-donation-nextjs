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
    CircleCheck,
    Command,
    Eye,
    MoreHorizontal,
    Pencil,
    Users,
} from "lucide-react";
import Link from "next/link";
import moment from "moment";
import EventRegistrationStatus from "@components/organizers/EventRegistrationStatus";
import { GiClosedDoors, GiOpenBook } from "react-icons/gi";
import { formatFormalName } from "@lib/utils/string.utils";
import {
    ExclamationTriangleIcon,
    QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { FaExclamation } from "react-icons/fa";
// import parse from "html-react-parser";

export const eventColumns = (setIsLoading) => [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID#" />
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
            <DataTableColumnHeader column={column} title="Event Date" />
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
        accessorKey: "time_schedules",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Participants" />
        ),
        filterFn: "columnFilter",
        size: 50,       // Set column width to 200px
        minSize: 50,    // Optional: set a minimum width
        maxSize: 50,
        cell: ({ getValue }) => {
            const time_schedules = getValue();


            return (
                <ul className="list text-right max-w-42">
                    {time_schedules.map((sched) => (

                        <li key={sched.id}>
                            <span className="italic text-slate-500">{sched.formatted_time}</span>
                            {" - "}<b>{sched?.donors?.length}</b>
                        </li>

                    ))}
                    <li className="font-semibold">Total - {time_schedules.reduce((acc, sched) => acc + sched?.donors?.length, 0)}</li>

                </ul>
            );
        },
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
                    <div className="space-x-2 space-y-1">
                        <div className="badge p-2 font-semibold text-xs badge-success">
                            <CircleCheck className="h-4" />
                            {status}
                        </div>
                    </div>
                );
            } else if (status == "FOR APPROVAL") {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-warning">
                        <QuestionMarkCircledIcon className="h-4" />
                        {status}
                    </div>
                );
            } else {
                return (
                    <div className="badge p-2 font-semibold text-xs badge-error">
                        <FaExclamation className="h-3" /> {status}
                    </div>
                );
            }
        },
    },
    {
        accessorKey: "registration_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Registration" />
        ),
        filterFn: "columnFilter",
        cell: ({ row }) => {
            const data = row.original;

            let regStatusBadge = (
                <div className="badge p-2 font-semibold text-xs badge-warning">
                    <ExclamationTriangleIcon />{" "}
                    {formatFormalName(data.registration_status)}
                </div>
            );
            if (data.registration_status == "closed") {
                regStatusBadge = (
                    <div className="badge p-2 font-semibold text-xs badge-error">
                        <GiClosedDoors />{" "}
                        {formatFormalName(data.registration_status)}
                    </div>
                );
            }
            if (data.registration_status == "ongoing") {
                regStatusBadge = (
                    <div className="badge p-2 font-semibold text-xs badge-primary">
                        <GiOpenBook />{" "}
                        {formatFormalName(data.registration_status)}
                    </div>
                );
            }
            return <div className="space-x-2 space-y-1">{regStatusBadge}</div>;
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

                        <Link href={`/portal/hosts/events/${data.id}`}>
                            <DropdownMenuItem className="btn btn-ghost btn-neutral space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                            </DropdownMenuItem>
                        </Link>
                        <Link href={`/portal/hosts/events/${data.id}/participants`}>
                            <DropdownMenuItem className="btn btn-ghost btn-neutral space-x-2">
                                <Users className="w-4 h-4" />
                                <span>See Donors</span>
                            </DropdownMenuItem>
                        </Link>
                        {data.status == "for approval" ? (
                            <Link href={`/portal/hosts/events/${data.id}/edit`}>
                                <DropdownMenuItem className="flex items-center space-x-2">
                                    <Pencil className="w-4 h-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                            </Link>
                        ) : (
                            ""
                        )}

                        {data.status == "approved" ? (
                            <DropdownMenuItem>
                                <EventRegistrationStatus
                                    data={data}
                                    setIsLoading={setIsLoading}
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
