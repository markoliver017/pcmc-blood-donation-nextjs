"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import {
    Search,
    Filter,
    Download,
    Eye,
    MoreHorizontal,
    ArrowUpDown,
    Calendar,
    User,
    Droplets,
    Building,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

export default function EventDashboardDataTable({ appointments, eventId }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [bloodTypeFilter, setBloodTypeFilter] = useState("all");
    const [agencyFilter, setAgencyFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // Get unique values for filters
    const bloodTypes = useMemo(() => {
        const types = [
            ...new Set(
                appointments
                    .map((a) => a.donor?.blood_type?.blood_type)
                    .filter(Boolean)
            ),
        ];
        return types.sort();
    }, [appointments]);

    const agencies = useMemo(() => {
        const ags = [
            ...new Set(
                appointments.map((a) => a.donor?.agency?.name).filter(Boolean)
            ),
        ];
        return ags.sort();
    }, [appointments]);

    // Filter and sort appointments
    const filteredAndSortedAppointments = useMemo(() => {
        let filtered = appointments.filter((appointment) => {
            const donorName =
                appointment.donor?.user?.name?.toLowerCase() || "";
            const bloodType = appointment.donor?.blood_type?.blood_type || "";
            const agencyName = appointment.donor?.agency?.name || "";
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                donorName.includes(search) ||
                bloodType.toLowerCase().includes(search) ||
                agencyName.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "all" || appointment.status === statusFilter;
            const matchesBloodType =
                bloodTypeFilter === "all" || bloodType === bloodTypeFilter;
            const matchesAgency =
                agencyFilter === "all" || agencyName === agencyFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesBloodType &&
                matchesAgency
            );
        });

        // Sort appointments
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "name":
                    aValue = a.donor?.user?.name || "";
                    bValue = b.donor?.user?.name || "";
                    break;
                case "bloodType":
                    aValue = a.donor?.blood_type?.blood_type || "";
                    bValue = b.donor?.blood_type?.blood_type || "";
                    break;
                case "agency":
                    aValue = a.donor?.agency?.name || "";
                    bValue = b.donor?.agency?.name || "";
                    break;
                case "status":
                    aValue = a.status || "";
                    bValue = b.status || "";
                    break;
                case "time":
                    aValue = a.time_schedule?.formatted_time || "";
                    bValue = b.time_schedule?.formatted_time || "";
                    break;
                default:
                    aValue = a.donor?.user?.name || "";
                    bValue = b.donor?.user?.name || "";
            }

            if (sortOrder === "asc") {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

        return filtered;
    }, [
        appointments,
        searchTerm,
        statusFilter,
        bloodTypeFilter,
        agencyFilter,
        sortBy,
        sortOrder,
    ]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            registered: { color: "badge-primary", text: "REGISTERED" },
            examined: { color: "badge-warning", text: "EXAMINED" },
            collected: { color: "badge-success", text: "COLLECTED" },
            cancelled: { color: "badge-error", text: "CANCELLED" },
            "no show": { color: "badge-error", text: "NO SHOW" },
            deferred: { color: "badge-warning", text: "DEFERRED" },
        };

        const config = statusConfig[status] || {
            color: "badge-secondary",
            text: status.toUpperCase(),
        };

        return (
            <badge className={`badge px-2 text-xs ${config.color}`}>
                {config.text}
            </badge>
        );
    };

    const getEligibilityBadge = (eligibilityStatus) => {
        if (!eligibilityStatus) return null;

        const config = {
            ACCEPTED: { color: "badge-success", text: "ELIGIBLE" },
            "TEMPORARILY-DEFERRED": {
                color: "badge-warning",
                text: "TEMPORARY",
            },
            "PERMANENTLY-DEFERRED": { color: "badge-error", text: "PERMANENT" },
        };

        const statusConfig = config[eligibilityStatus] || {
            color: "badge-secondary",
            text: "UNKNOWN",
        };

        return (
            <Badge className={`text-xs ${statusConfig.color}`}>
                {statusConfig.text}
            </Badge>
        );
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    // const handleExport = () => {
    //     // TODO: Implement export functionality
    //     console.log("Export data");
    // };

    const handleViewDetails = (appointment) => {
        // TODO: Navigate to appointment details
        console.log("View details:", appointment.id);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setBloodTypeFilter("all");
        setAgencyFilter("all");
    };

    const hasActiveFilters =
        searchTerm ||
        statusFilter !== "all" ||
        bloodTypeFilter !== "all" ||
        agencyFilter !== "all";

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>All Appointments</CardTitle>
                    {/* <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            className="flex items-center gap-1"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div> */}
                </div>
            </CardHeader>
            <CardContent>
                {/* Filters */}
                <div className="space-y-4 mb-6">
                    {/* Search and Clear Filters */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by donor name, blood type, or agency..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    {/* Filter Options */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Status
                            </label>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="registered">
                                        Registered
                                    </SelectItem>
                                    <SelectItem value="examined">
                                        Examined
                                    </SelectItem>
                                    <SelectItem value="collected">
                                        Collected
                                    </SelectItem>
                                    <SelectItem value="deferred">
                                        Deferred
                                    </SelectItem>
                                    <SelectItem value="no show">
                                        No Show
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Blood Type
                            </label>
                            <Select
                                value={bloodTypeFilter}
                                onValueChange={setBloodTypeFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Blood Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Blood Types
                                    </SelectItem>
                                    {bloodTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Agency
                            </label>
                            <Select
                                value={agencyFilter}
                                onValueChange={setAgencyFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Agencies" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Agencies
                                    </SelectItem>
                                    {agencies.map((agency) => (
                                        <SelectItem key={agency} value={agency}>
                                            {agency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Results
                            </label>
                            <div className="text-sm text-muted-foreground">
                                {filteredAndSortedAppointments.length} of{" "}
                                {appointments.length} appointments
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("name")}
                                        className="flex items-center gap-1 h-auto p-0 font-medium"
                                    >
                                        Donor Name
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("bloodType")}
                                        className="flex items-center gap-1 h-auto p-0 font-medium"
                                    >
                                        Blood Type
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("agency")}
                                        className="flex items-center gap-1 h-auto p-0 font-medium"
                                    >
                                        Agency
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("status")}
                                        className="flex items-center gap-1 h-auto p-0 font-medium"
                                    >
                                        Status
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("time")}
                                        className="flex items-center gap-1 h-auto p-0 font-medium"
                                    >
                                        Scheduled Time
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>Eligibility</TableHead>
                                <TableHead>Collection</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedAppointments.map(
                                (appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {appointment.donor?.user
                                                            ?.name || "Unknown"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        ID: {appointment.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Droplets className="h-3 w-3" />
                                                {appointment.donor?.blood_type
                                                    ?.blood_type ||
                                                    "Not specified"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Building className="h-3 w-3" />
                                                {appointment.donor?.agency
                                                    ?.name || "Unknown"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(appointment.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {appointment.time_schedule
                                                    ?.formatted_time ||
                                                    "Not scheduled"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {appointment.physical_exam &&
                                                getEligibilityBadge(
                                                    appointment.physical_exam
                                                        .eligibility_status
                                                )}
                                        </TableCell>
                                        <TableCell>
                                            {appointment.blood_collection ? (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span className="text-xs">
                                                        {
                                                            appointment
                                                                .blood_collection
                                                                .volume
                                                        }
                                                        ml
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        disabled
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                appointment
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        View Schedule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Export Details
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Empty State */}
                {filteredAndSortedAppointments.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-muted-foreground">
                            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium mb-2">
                                No appointments found
                            </h3>
                            <p className="text-sm">
                                {hasActiveFilters
                                    ? "Try adjusting your filters to see more results."
                                    : "No appointments have been registered for this event yet."}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
