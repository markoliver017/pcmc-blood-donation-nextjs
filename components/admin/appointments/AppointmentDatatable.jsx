"use client";
import React, { use, useEffect, useMemo, useState } from "react";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import { DataTablePagination } from "@components/reusable_components/DataTablePagination";
import { DataTableViewOptions } from "@components/reusable_components/DataTableViewOptions";
import { Calendar, Droplet, Filter, Send, User, UserCog2 } from "lucide-react";
import MultiSelect from "@components/reusable_components/MultiSelect";

import Skeleton from "@components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getBloodTypes } from "@/action/bloodTypeAction";
import Skeleton_line from "@components/ui/skeleton_line";
import { MdBloodtype } from "react-icons/md";
import moment from "moment";
import { BiBuildings } from "react-icons/bi";
import { toast } from "sonner";

export function AppointmentDatatable({
    columns,
    data,
    isLoading,
    eventOptions,
    agencyOptions,
    selectedStatus,
}) {
    const { data: bloodTypes, isLoading: bloodTypesIsLoading } = useQuery({
        queryKey: ["blood_types"],
        queryFn: getBloodTypes,
    });

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({
        id: false,
        donor_date_of_birth: false,
    });
    const [rowSelection, setRowSelection] = useState({});

    // Reset row selection when selectedStatus changes
    useEffect(() => {
        setRowSelection({});
    }, [selectedStatus]);

    // console.log("rolesssOptions", roleOptions);
    const table = useReactTable({
        data,
        columns,
        // manualPagination: true,
        // pageCount: 4,
        // rowCount: 18,
        autoResetPageIndex: false,
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
            rowSelection,
        },
        onGlobalFilterChange: setGlobalFilter,
        filterFns: {
            //for multi-filter
            columnFilter: (row, columnId, filterValue) => {
                if (filterValue.length === 0) return true;
                return filterValue.includes(row.getValue(columnId));
            },
        },
    });

    const getSelectedRows = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        return selectedRows.map((row) => row.original);
    };

    const handleSelectedEmail = () => {
        const selectedRows = getSelectedRows();
        const emails = selectedRows
            .map((row) => row.donor?.user?.email)
            .filter(Boolean);

        if (emails.length > 0) {
            const subject = "Blood Donation Event";
            const body = `Hello,
                \n\nWe would like to inform you about the upcoming blood donation drive.
                `;

            const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
                emails.join(",")
            )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                body
            )}`;

            window.open(gmailUrl, "_blank"); // open Gmail compose in new tab
        } else {
            toast.error("No participants selected");
        }
    };

    if (bloodTypesIsLoading) {
        return <Skeleton_line />;
    }

    return (
        <div className="p-2">
            {isLoading ? (
                <Skeleton className="w-full h-80 rounded-xl" />
            ) : (
                <>
                    <div className="flex flex-wrap items-center gap-2 py-2">
                        <button
                            className="btn flex-none w-full md:w-auto rounded-full"
                            onClick={handleSelectedEmail}
                        >
                            <Send className="w-4" /> Send Mail
                        </button>

                        <input
                            placeholder="Search all .."
                            // value={{globalFilter}}
                            onChange={(e) =>
                                table.setGlobalFilter(e.target.value)
                            }
                            className="flex-1 p-2 input-sm bg-slate-50 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                        />

                        <div className="justify-end pr-2 min-w-[300px] overflow-x-auto">
                            <div className="flex space-x-2">
                                <label className="dark:text-slate-400 flex items-center space-x-1">
                                    <Filter className="h-4 w-4" />
                                </label>
                                <MultiSelect
                                    options={
                                        agencyOptions.map((agency) => ({
                                            label: agency.name,
                                            value: agency.name,
                                            number: data.filter(
                                                (row) =>
                                                    row?.donor?.agency?.name ==
                                                    agency?.name
                                            ).length,
                                        })) || []
                                    }
                                    onValueChange={(selectedOptions) => {
                                        table
                                            .getColumn("donor_agency_name")
                                            ?.setFilterValue(selectedOptions);
                                    }}
                                    value={
                                        table
                                            .getColumn("donor_agency_name")
                                            ?.getFilterValue() ?? []
                                    }
                                    placeholder={
                                        <>
                                            {
                                                <BiBuildings className="h-3 w-3" />
                                            }{" "}
                                            <span className="hidden md:block">
                                                Agencies
                                            </span>
                                        </>
                                    }
                                    className="text-slate-700 bg-slate-100 hover:bg-white"
                                    animation={2}
                                    maxCount={1}
                                />
                                <MultiSelect
                                    options={
                                        eventOptions.map((event) => ({
                                            label: `${event.title} - ${moment(
                                                event.date
                                            ).format("MMM DD, YYYY")}`,
                                            value: event.title,
                                            number: data.filter(
                                                (row) =>
                                                    row?.time_schedule?.event
                                                        ?.title == event?.title
                                            ).length,
                                        })) || []
                                    }
                                    onValueChange={(selectedOptions) => {
                                        table
                                            .getColumn(
                                                "time_schedule_event_title"
                                            )
                                            ?.setFilterValue(selectedOptions);
                                    }}
                                    value={
                                        table
                                            .getColumn(
                                                "time_schedule_event_title"
                                            )
                                            ?.getFilterValue() ?? []
                                    }
                                    placeholder={
                                        <>
                                            {<Calendar className="h-3 w-3" />}{" "}
                                            <span className="hidden md:block">
                                                Events
                                            </span>
                                        </>
                                    }
                                    className="text-slate-700 bg-slate-100 hover:bg-white"
                                    animation={2}
                                    maxCount={1}
                                />

                                <MultiSelect
                                    options={
                                        bloodTypes.map((type) => ({
                                            label: type.blood_type,
                                            value: type.blood_type,
                                            number: data.filter(
                                                (row) =>
                                                    row.donor?.blood_type
                                                        ?.blood_type ==
                                                    type?.blood_type
                                            ).length,
                                        })) || []
                                    }
                                    onValueChange={(selectedOptions) => {
                                        table
                                            .getColumn(
                                                "donor_blood_type_blood_type"
                                            )
                                            ?.setFilterValue(selectedOptions);
                                    }}
                                    value={
                                        table
                                            .getColumn(
                                                "donor_blood_type_blood_type"
                                            )
                                            ?.getFilterValue() ?? []
                                    }
                                    placeholder={
                                        <>
                                            {
                                                <MdBloodtype className="h-3 w-3" />
                                            }{" "}
                                            <span className="hidden md:block">
                                                Blood Type
                                            </span>
                                        </>
                                    }
                                    className="text-slate-700 bg-slate-100 hover:bg-white"
                                    animation={2}
                                    maxCount={1}
                                />

                                <MultiSelect
                                    options={[
                                        {
                                            label: "male",
                                            value: "male",
                                            number: data.filter(
                                                (row) =>
                                                    row?.donor?.user?.gender ==
                                                    "male"
                                            ).length,
                                        },
                                        {
                                            label: "female",
                                            value: "female",
                                            number: data.filter(
                                                (row) =>
                                                    row?.donor?.user?.gender ==
                                                    "female"
                                            ).length,
                                        },
                                    ]}
                                    onValueChange={(selectedOptions) => {
                                        table
                                            .getColumn("donor_user_gender")
                                            ?.setFilterValue(selectedOptions);
                                    }}
                                    value={
                                        table
                                            .getColumn("donor_user_gender")
                                            ?.getFilterValue() ?? []
                                    }
                                    placeholder={
                                        <>
                                            {<User className="h-3 w-3" />}{" "}
                                            <span className="hidden md:block">
                                                Sex
                                            </span>
                                        </>
                                    }
                                    variant="inverted"
                                    className="text-slate-700 bg-slate-100 hover:bg-white"
                                    animation={2}
                                    maxCount={1}
                                />
                                <DataTableViewOptions table={table} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md max-w-screen overflow-x-scroll">
                        <Table className="dark:bg-slate-700 dark:text-slate-200">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                className="dark:text-yellow-200"
                                                key={header.id}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="dark:text-slate-300"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center dark:text-slate-300"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <DataTablePagination table={table} />
                    </div>
                </>
            )}
        </div>
    );
}
