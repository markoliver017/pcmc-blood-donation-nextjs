import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";
import { CheckCircle, Eye, SquareMenu, XCircle } from "lucide-react";
import SweetAlert from "@components/ui/SweetAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { format } from "date-fns";
import { Badge } from "@components/ui/badge";

export const getColumns = (updateRequestStatus, isApproving, onShowDetails) => {
    return [
        {
            accessorKey: "blood_request_reference_id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID#" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "blood_component",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Component" />
            ),
            cell: ({ row }) => {
                const component = row.original.blood_component;
                return component.charAt(0).toUpperCase() + component.slice(1);
            },
            filterFn: "columnFilter",
        },
        {
            accessorKey: "blood_type.blood_type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Blood Type" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "no_of_units",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Units" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "patient_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Patient Name" />
            ),
            cell: ({ row }) => {
                const donor = row.original.user;
                return donor
                    ? `${donor.first_name} ${donor.last_name}`
                    : row.original.patient_name;
            },
            filterFn: "columnFilter",
        },
        {
            accessorKey: "hospital_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Hospital" />
            ),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Date Needed" />
            ),
            cell: ({ row }) =>
                format(new Date(row.original.date), "MMM dd, yyyy"),
            filterFn: "columnFilter",
        },
        {
            accessorKey: "agency_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Agency" />
            ),
            cell: ({ row }) => {
                // Try to get agency name from donor->agency
                return (
                    row.original.user?.donor?.agency?.name || (
                        <span className="italic text-gray-400">N/A</span>
                    )
                );
            },
            filterFn: "columnFilter",
        },
        {
            accessorKey: "creator.full_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Requested By" />
            ),
            cell: ({ row }) => {
                // Try to get agency name from donor->agency
                return row.original.creator?.full_name;
            },
            filterFn: "columnFilter",
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                const colors = {
                    pending:
                        "bg-slate-100 text-orange-800 dark:bg-slate-900 dark:text-orange-200",
                    fulfilled:
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                    rejected:
                        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                };
                const label = {
                    pending: "Pending",
                    fulfilled: "Approved",
                    rejected: "Rejected",
                };
                return (
                    <Badge
                        variant="outline"
                        className={`${colors[status]} hover:bg-blue-200 dark:hover:bg-blue-600`}
                    >
                        {label[status] || "Unknown"}
                    </Badge>
                );
            },
            filterFn: "columnFilter",
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const id = row.original.id;
                const status = row.original.status;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-min p-0">
                                <span className="sr-only">Open menu</span>
                                <SquareMenu />
                                <span className="block md:hidden">Menus</span>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                                onClick={() => onShowDetails(row.original)}
                            >
                                <Eye className="w-4 h-4" />
                                <span className="hidden md:inline">
                                    Details
                                </span>
                            </DropdownMenuItem>
                            {status === "pending" && (
                                <>
                                    <DropdownMenuItem
                                        size="sm"
                                        disabled={isApproving}
                                        onClick={() => {
                                            SweetAlert({
                                                title: "Approve Blood Request?",
                                                text: "Are you sure you want to mark this blood request as fulfilled? This action will also send a notification to the user who initiated the request.",
                                                icon: "info",
                                                showCancelButton: true,
                                                confirmButtonText:
                                                    "Yes, approve",
                                                cancelButtonText: "No",
                                                onConfirm: () =>
                                                    updateRequestStatus({
                                                        id,
                                                        status: "fulfilled",
                                                    }),
                                            });
                                        }}
                                        className="flex items-center gap-1 bg-green-500 text-white"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="hidden md:inline">
                                            Approve
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        size="sm"
                                        disabled={
                                            status !== "pending" || isApproving
                                        }
                                        onClick={() => {
                                            MySwal.fire({
                                                title: "Reject Blood Request?",
                                                text: "Please provide a reason for rejecting this request.",
                                                icon: "warning",
                                                input: "text", // Add this to show a text input
                                                inputPlaceholder:
                                                    "Enter rejection reason here...",
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return "You need to write a reason!";
                                                    }
                                                },
                                                showCancelButton: true,
                                                confirmButtonText:
                                                    "Yes, reject",
                                                cancelButtonText: "No",
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    const reason = result.value;
                                                    // alert(reason);
                                                    updateRequestStatus({
                                                        id,
                                                        status: "rejected",
                                                        remarks: reason, // Send the reason to your update function
                                                    });
                                                }
                                            });
                                        }}
                                        className="flex items-center gap-1 bg-red-500 text-white"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        <span className="hidden md:inline">
                                            Reject
                                        </span>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};
