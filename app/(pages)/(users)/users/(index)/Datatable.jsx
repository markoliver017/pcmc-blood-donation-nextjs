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
import { Filter, User, UserCog2 } from "lucide-react";
import MultiSelect from "@components/reusable_components/MultiSelect";

import Skeleton from "@components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const fetchRoles = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const url = new URL(`/api/roles`, process.env.NEXT_PUBLIC_DOMAIN);
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    return await response.json();
};

export function DataTable({ columns, data, isLoading }) {
    const { data: roles } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const res = await fetchRoles();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minute
        cacheTime: 10 * 60 * 1000, // Cache persists for 10 minute
    });
    // console.log("rolesss", roles);
    // console.log("datassss", data);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({
        id: false,
        report_date: false,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [roleOptions, setRoleOptions] = useState([]);

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

    useEffect(() => {
        if (roles && roles.length > 0) {
            setRoleOptions(() => {
                return roles.map((role) => ({
                    id: role.id,
                    label: role.role_name,
                    value: role.role_name,
                    number: data.filter(
                        (row) => row.role.role_name == role.role_name
                    ).length,
                }));
            });
            // table.getAllColumns().forEach((column) => {
            //     column.setFilterValue(undefined);
            // });
        }
    }, [roles]);

    const getSelectedRows = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        return selectedRows.map((row) => row.original);
    };

    function getVisibleKeys() {
        return columns
            .filter((col) => {
                const accesorKey = col?.accessorKey?.replaceAll(".", "_");
                return accesorKey && columnVisibility[accesorKey] !== false;
            })
            .map((col) => col.accessorKey);
    }

    function getVisibleData(data) {
        // Flatten columns with accessorKey only
        const visibleKeys = getVisibleKeys();

        return data.map((row) => {
            const filteredRow = {};
            visibleKeys.forEach((key) => {
                const keys = key.split(".");
                let value = row;
                for (const k of keys) {
                    if (value && k in value) {
                        value = value[k];
                    } else {
                        value = null;
                        break;
                    }
                }
                filteredRow[key] = value;
            });
            return filteredRow;
        });
    }

    const visibleData = useMemo(
        () => getVisibleData(data, columns, columnVisibility),
        [data, columns, columnVisibility]
    );

    return (
        <div className="p-2">
            {isLoading ? (
                <Skeleton className="w-full h-80 rounded-xl" />
            ) : (
                <>
                    <div className="flex items-center py-2 space-x-2">
                        <input
                            placeholder="Search all .."
                            // value={{globalFilter}}
                            onChange={(e) =>
                                table.setGlobalFilter(e.target.value)
                            }
                            className="p-2 input-sm flex-none bg-slate-50 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                        />

                        <div className="flex-1 flex justify-end pr-2">
                            <div className="flex space-x-2">
                                <label className="dark:text-slate-400 flex items-center space-x-1">
                                    <Filter className="h-4 w-4" />
                                </label>
                                <MultiSelect
                                    options={roleOptions || []}
                                    onValueChange={(selectedOptions) => {
                                        console.log(
                                            "selectedOptions",
                                            selectedOptions
                                        );
                                        console.log(
                                            `table.getColumn("role")`,
                                            table.getColumn("role_role_name")
                                        );
                                        table
                                            .getColumn("role_role_name")
                                            ?.setFilterValue(selectedOptions);
                                    }}
                                    value={
                                        table
                                            .getColumn("role_role_name")
                                            ?.getFilterValue() ?? []
                                    }
                                    placeholder={
                                        <>
                                            {<UserCog2 className="h-3 w-3" />}{" "}
                                            <span>Role Name</span>
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
                                                (row) => row.gender == "male"
                                            ).length,
                                        },
                                        {
                                            label: "female",
                                            value: "female",
                                            number: data.filter(
                                                (row) => row.gender == "female"
                                            ).length,
                                        },
                                    ]}
                                    onValueChange={(selectedOptions) => {
                                        console.log(
                                            "selectedOptions",
                                            selectedOptions
                                        );
                                        console.log(
                                            `table.getColumn("gender")`,
                                            table.getColumn("gender")
                                        );
                                        table
                                            .getColumn("gender")
                                            ?.setFilterValue(selectedOptions);
                                    }}
                                    value={
                                        table
                                            .getColumn("gender")
                                            ?.getFilterValue() ?? []
                                    }
                                    placeholder={
                                        <>
                                            {<User className="h-3 w-3" />}{" "}
                                            <span>Sex</span>
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
