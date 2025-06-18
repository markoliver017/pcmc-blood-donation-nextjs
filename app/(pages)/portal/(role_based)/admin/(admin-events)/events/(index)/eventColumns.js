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
    CheckIcon,
    Command,
    Eye,
    MoreHorizontal,
    Pencil,
    XIcon,
} from "lucide-react";
import Link from "next/link";
import moment from "moment";
import VerifyEvent from "@components/events/VerifyEvent";
import RejectEvent from "@components/events/RejectEvent";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { formatFormalName } from "@lib/utils/string.utils";
import { GiClosedDoors, GiOpenBook } from "react-icons/gi";
import EventRegistrationStatus from "@components/organizers/EventRegistrationStatus";
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
        accessorKey: "agency.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency" />
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
        size: 50, // Set column width to 200px
        minSize: 50, // Optional: set a minimum width
        maxSize: 50,
        cell: ({ getValue }) => {
            const time_schedules = getValue();

            return (
                <ul className="list text-right max-w-42">
                    {time_schedules.map((sched) => (
                        <li key={sched.id}>
                            <span className="italic text-slate-500">
                                {sched.formatted_time}
                            </span>
                            {" - "}
                            <b>{sched?.donors?.length}</b>
                        </li>
                    ))}
                    <li className="font-semibold">
                        Total -{" "}
                        {time_schedules.reduce(
                            (acc, sched) => acc + sched?.donors?.length,
                            0
                        )}
                    </li>
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
        accessorKey: "validator.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified by" />
        ),
        cell: ({ getValue }) => getValue(),
        filterFn: "columnFilter",
    },
    {
        accessorKey: "editor.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated by" />
        ),
        cell: ({ getValue }) => getValue(),
        filterFn: "columnFilter",
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

                        <Link href={`/portal/admin/events/${data.id}`}>
                            <DropdownMenuItem className="space-x-2 btn btn-ghost btn-primary">
                                <Eye className="w-4 h-4" />
                                <span>Show</span>
                            </DropdownMenuItem>
                        </Link>
                        <Link href={`/portal/admin/events/${data.id}/edit`}>
                            <DropdownMenuItem className="space-x-2 btn btn-ghost btn-warning">
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        </Link>
                        {status == "for approval" ? (
                            <>
                                <DropdownMenuItem className="space-x-2 flex justify-between">
                                    <VerifyEvent
                                        eventData={{
                                            id: data.id,
                                            status: "approved",
                                        }}
                                        label="Approve"
                                        className="btn btn-ghost btn-success"
                                        formClassName="w-full"
                                        icon={<CheckIcon />}
                                    />
                                </DropdownMenuItem>
                                <div className="px-2 flex justify-between">
                                    <RejectEvent
                                        eventId={data.id}
                                        className="w-full btn btn-ghost btn-error"
                                    />
                                </div>
                            </>
                        ) : (
                            ""
                        )}

                        {status == "approved" ? (
                            <>
                                <DropdownMenuItem>
                                    <Link
                                        href={`/portal/admin/events/${data.id}/participants`}
                                    >
                                        <span>View Donors</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <EventRegistrationStatus
                                        data={data}
                                        setIsLoading={setIsLoading}
                                    />
                                </DropdownMenuItem>
                                <DropdownMenuItem className="space-x-2 flex justify-between">
                                    <VerifyEvent
                                        eventData={{
                                            id: data.id,
                                            status: "cancelled",
                                        }}
                                        label="Cancel Blood Drive"
                                        className="btn btn-ghost btn-error w-full"
                                        formClassName="w-full"
                                        icon={<XIcon />}
                                    />
                                </DropdownMenuItem>
                            </>
                        ) : (
                            ""
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
