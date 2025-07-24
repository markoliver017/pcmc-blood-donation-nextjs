"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Button } from "@components/ui/button";
import { Search, X, Calendar } from "lucide-react";
import { debounce } from "lodash";

export default function EventFilterBar({ onChange, defaultValues = {}, statusOptions = [] }) {
    const [filters, setFilters] = useState(defaultValues);

    // Apply filters with debounce
    // const debouncedOnChange = debounce((newFilters) => {
    //     onChange(newFilters);
    // }, 1000);

    // Update filters when defaultValues change
    useEffect(() => {
        setFilters(defaultValues);
    }, [defaultValues]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onChange(newFilters);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({});
        onChange({});
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search field */}
                <div>
                    <Label className="text-sm font-medium">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            className="pl-8"
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                        {filters.search && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => handleFilterChange('search', '')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Date range picker */}
                <div>
                    <Label className="text-sm font-medium">Date Range</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={filters.dateRange?.from || ''}
                            onChange={(e) => {
                                const from = e.target.value ? e.target.value : null;
                                const newRange = {
                                    ...filters.dateRange || {},
                                    from
                                };
                                handleFilterChange('dateRange', newRange);
                            }}
                            className="text-sm"
                        />
                        <span className="text-neutral-400">to</span>
                        <Input
                            type="date"
                            value={filters.dateRange?.to || ''}
                            onChange={(e) => {
                                const to = e.target.value ? e.target.value : null;
                                const newRange = {
                                    ...filters.dateRange || {},
                                    to
                                };
                                handleFilterChange('dateRange', newRange);
                            }}
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* Status filter */}
                <div>
                    <Label className="text-sm font-medium">Registration Status</Label>
                    <Select
                        value={filters.registration_status || ''}
                        onValueChange={(value) => handleFilterChange('registration_status', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Clear filters button */}
            {Object.keys(filters).length > 0 && (
                <div className="flex justify-end mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}