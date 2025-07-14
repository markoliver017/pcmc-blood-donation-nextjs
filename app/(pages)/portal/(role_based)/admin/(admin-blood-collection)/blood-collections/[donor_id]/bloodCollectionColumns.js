// import { Checkbox } from "@components/ui/checkbox";
import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";

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

import { format } from "date-fns";
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

export const bloodCollectionColumns = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID#" />
        ),
        filterFn: "columnFilter",
    },
    // {
    //     accessorKey: "donor.user.image",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Avatar" />
    //     ),
    //     cell: ({ getValue }) => {
    //         const imageSrc = getValue();
    //         return (
    //             <Image
    //                 src={imageSrc || "/default_avatar.png"}
    //                 className="flex-none rounded-4xl"
    //                 width={50}
    //                 height={50}
    //                 alt="Logo"
    //             />
    //         );
    //     },
    // },
    {
        accessorKey: "event.date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ getValue }) => <span>{format(getValue(), "PP")}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "event.title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Event Title" />
        ),
        cell: ({ getValue }) => <span>{formatFormalName(getValue())}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "appointment.donor_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Donor Type" />
        ),
        cell: ({ getValue }) => <span>{formatFormalName(getValue())}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "appointment.collection_method",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Collection Method" />
        ),
        cell: ({ getValue }) => <span>{formatFormalName(getValue())}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "exam.blood_pressure",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Blood Pressure" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "exam.pulse_rate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pulse Rate" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "exam.hemoglobin_level",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Hemoglobin Level" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },
    {
        accessorKey: "volume",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Volume" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
        filterFn: "columnFilter",
    },
    // {
    //     accessorKey: "appointment.status",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Appointment Status" />
    //     ),
    //     cell: ({ getValue }) => <span>{formatFormalName(getValue())}</span>,
    //     filterFn: "columnFilter",
    // },
    // {
    //     accessorKey: "exam.eligibility_status",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Eligibility Status" />
    //     ),
    //     cell: ({ getValue }) => <span>{formatFormalName(getValue())}</span>,
    //     filterFn: "columnFilter",
    // },

    // {
    //     accessorKey: "volume",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Volume" />
    //     ),
    //     cell: ({ getValue }) => <span>{getValue() || "N/A"}</span>,
    //     filterFn: "columnFilter",
    // },
    // {
    //     accessorKey: "remarks",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Remarks" />
    //     ),
    //     cell: ({ getValue }) => <span>{getValue()}</span>,
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
