"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Search, Filter, X } from "lucide-react";

export default function AuditTrailFilters({ 
    filters, 
    onFiltersChange, 
    onSearchChange,
    search,
    isLoading = false 
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFilterChange = (key, value) => {
        // Don't send "All" values to the server
        const newFilters = { ...filters };
        if (value === "All" || value === "") {
            delete newFilters[key];
        } else {
            newFilters[key] = value;
        }
        console.log("newFilters", newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        onFiltersChange({});
        onSearchChange("");
    };

    const hasActiveFilters = Object.values(filters).some(value => 
        value !== undefined && value !== "" && value !== null
    ) || search;

    return (
        <Card className="mb-6">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters & Search
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Clear All
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? "Hide" : "Show"} Filters
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Search Bar - Always Visible */}
            <CardContent className="pt-0">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search in details, stack trace, or user information..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                        // disabled={isLoading}
                    />
                </div>

                {/* Advanced Filters - Expandable */}
                {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                        {/* Date Range */}
                        <div className="space-y-2">
                            <Label htmlFor="date-from">Date From</Label>
                            <Input
                                id="date-from"
                                type="date"
                                value={filters.date_from || ""}
                                onChange={(e) => handleFilterChange("date_from", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date-to">Date To</Label>
                            <Input
                                id="date-to"
                                type="date"
                                value={filters.date_to || ""}
                                onChange={(e) => handleFilterChange("date_to", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Controller Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="controller">Controller</Label>
                            <Select
                                value={filters.controller || "All"}
                                onValueChange={(value) => handleFilterChange("controller", value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Controllers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Controllers</SelectItem>
                                    <SelectItem value="login">Login</SelectItem>
                                    <SelectItem value="logout">Logout</SelectItem>
                                    <SelectItem value="users">Users</SelectItem>
                                    <SelectItem value="agencies">Agencies</SelectItem>
                                    <SelectItem value="events">Events</SelectItem>
                                    <SelectItem value="appointments">Appointments</SelectItem>
                                    <SelectItem value="blood_collections">Blood Collections</SelectItem>
                                    <SelectItem value="announcements">Announcements</SelectItem>
                                    <SelectItem value="audit_trails">Audit Trails</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="action">Action</Label>
                            <Select
                                value={filters.action || "All"}
                                onValueChange={(value) => handleFilterChange("action", value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Actions</SelectItem>
                                    <SelectItem value="CREATE">Create</SelectItem>
                                    <SelectItem value="READ">Read</SelectItem>
                                    <SelectItem value="UPDATE">Update</SelectItem>
                                    <SelectItem value="DELETE">Delete</SelectItem>
                                    <SelectItem value="LOGIN">Login</SelectItem>
                                    <SelectItem value="LOGOUT">Logout</SelectItem>
                                    <SelectItem value="SUCCESS">Success</SelectItem>
                                    <SelectItem value="ERROR">Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Error Status Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="error-status">Error Status</Label>
                            <Select
                                value={filters.is_error === undefined ? "All" : filters.is_error.toString()}
                                onValueChange={(value) => {
                                    if (value === "All") {
                                        handleFilterChange("is_error", undefined);
                                    } else {
                                        handleFilterChange("is_error", value === "true");
                                    }
                                }}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Status</SelectItem>
                                    <SelectItem value="false">Success Only</SelectItem>
                                    <SelectItem value="true">Errors Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* User Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="user">User (Email)</Label>
                            <Input
                                id="user"
                                placeholder="Enter user email..."
                                value={filters.user_email || ""}
                                onChange={(e) => handleFilterChange("user_email", e.target.value)}
                                // disabled={isLoading}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 