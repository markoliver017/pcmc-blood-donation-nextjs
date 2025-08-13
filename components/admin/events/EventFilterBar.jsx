"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFilterSchema } from "@lib/zod/eventFilterSchema";
import { Form, FormField, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getSingleStyle } from "@/styles/select-styles";
import { useTheme } from "next-themes";
import { Calendar, Search, Filter, X, Expand } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAllAgencies } from "@action/agencyAction";
import Skeleton from "@components/ui/skeleton";

import dynamic from "next/dynamic";
import { BiCollapse } from "react-icons/bi";
const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});

export default function EventFilterBar({
    onChange,
    defaultValues,
    statusOptions,
}) {
    const { resolvedTheme } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    const form = useForm({
        resolver: zodResolver(eventFilterSchema),
        defaultValues: defaultValues || {
            search: "",
            dateRange: { from: null, to: null },
            agency_id: "",
        },
    });

    // Fetch all agencies for admin
    const { data: agencies, isLoading: isLoadingAgencies } = useQuery({
        queryKey: ["agencies"],
        queryFn: async () => {
            const res = await fetchAllAgencies();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    // Debounced onChange handler
    useEffect(() => {
        const subscription = form.watch((value) => {
            const timeoutId = setTimeout(() => {
                onChange?.(value);
            }, 300);
            return () => clearTimeout(timeoutId);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, onChange]);

    const handleClear = () => {
        form.reset({
            search: "",
            dateRange: { from: null, to: null },
            agency_id: "",
        });
        onChange?.(form.getValues());
    };

    const hasActiveFilters =
        form.watch("search") ||
        form.watch("agency_id") ||
        form.watch("dateRange.from") ||
        form.watch("dateRange.to");

    if (isLoadingAgencies) return <Skeleton />;

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex flex-wrap sm:items-center sm:justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Filters
                    </h3>
                    {hasActiveFilters && (
                        <span className="badge badge-primary badge-sm px-2">
                            Active
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClear}
                        >
                            <X className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Clear All</span>
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <BiCollapse /> : <Expand />}
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-6"
                >
                    {/* Search */}
                    <div>
                        <FormField
                            control={form.control}
                            name="search"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <Input
                                            {...field}
                                            placeholder="Search by title, status, agency, or location..."
                                            className="pl-10"
                                        />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Expandable Filters */}
                    {isExpanded && (
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 border-t pt-6 border-neutral-200 dark:border-neutral-700">
                            {/* Date Range */}
                            <FormField
                                control={form.control}
                                name="dateRange"
                                render={({ field }) => (
                                    <FormItem>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Event Date Range
                                        </label>
                                        <div className="flex flex-wrap justify-center items-center gap-2">
                                            <Input
                                                type="date"
                                                value={
                                                    field.value?.from
                                                        ? new Date(
                                                              field.value.from
                                                          )
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const date = e.target.value
                                                        ? new Date(
                                                              e.target.value
                                                          )
                                                        : null;
                                                    field.onChange({
                                                        ...field.value,
                                                        from: date,
                                                    });
                                                }}
                                                className="text-sm"
                                            />
                                            <span className="text-neutral-400">
                                                to
                                            </span>
                                            <Input
                                                type="date"
                                                value={
                                                    field.value?.to
                                                        ? new Date(
                                                              field.value.to
                                                          )
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const date = e.target.value
                                                        ? new Date(
                                                              e.target.value
                                                          )
                                                        : null;
                                                    field.onChange({
                                                        ...field.value,
                                                        to: date,
                                                    });
                                                }}
                                                className="text-sm"
                                            />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Agency Select */}
                            <FormField
                                control={form.control}
                                name="agency_id"
                                render={({
                                    field: { onChange, value, name, ref },
                                }) => {
                                    const agencyOptions = agencies.map(
                                        (agency) => ({
                                            value: agency?.id,
                                            label: agency?.name,
                                        })
                                    );
                                    const selectedOption =
                                        agencyOptions.find(
                                            (option) => option.value === value
                                        ) || null;

                                    return (
                                        <FormItem>
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                                Agency
                                            </label>
                                            <CreatableSelectNoSSR
                                                name={name}
                                                ref={ref}
                                                placeholder="Select agency"
                                                value={selectedOption}
                                                onChange={(selected) =>
                                                    onChange(
                                                        selected
                                                            ? selected.value
                                                            : null
                                                    )
                                                }
                                                isValidNewOption={() => false}
                                                options={agencyOptions}
                                                styles={getSingleStyle(
                                                    resolvedTheme
                                                )}
                                                className="text-sm"
                                                isClearable
                                            />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
}
