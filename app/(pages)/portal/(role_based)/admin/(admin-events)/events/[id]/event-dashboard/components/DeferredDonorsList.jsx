"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
    Search,
    User,
    Droplets,
    Building,
    Eye,
    XCircle,
    AlertTriangle,
    Clock,
    FileText,
} from "lucide-react";
import moment from "moment";

export default function DeferredDonorsList({ eventId, appointments }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all"); // all, deferred, no_show

    const filteredAppointments = appointments.filter((appointment) => {
        const donorName = appointment.donor?.user?.name?.toLowerCase() || "";
        const bloodType =
            appointment.donor?.blood_type?.blood_type?.toLowerCase() || "";
        const agencyName = appointment.donor?.agency?.name?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            donorName.includes(search) ||
            bloodType.includes(search) ||
            agencyName.includes(search);

        if (filterType === "all") return matchesSearch;
        if (filterType === "deferred")
            return matchesSearch && appointment.status === "deferred";
        if (filterType === "no_show")
            return matchesSearch && appointment.status === "no show";

        return matchesSearch;
    });

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
            <Badge className={`text-xs ${config.color}`}>{config.text}</Badge>
        );
    };

    const getDeferralTypeBadge = (eligibilityStatus) => {
        const config = {
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

    const handleViewDetails = (appointment) => {
        // TODO: Navigate to detailed view
        console.log("View details for:", appointment.id);
    };

    const getDeferredCount = () => {
        return appointments.filter((a) => a.status === "deferred").length;
    };

    const getNoShowCount = () => {
        return appointments.filter((a) => a.status === "no show").length;
    };

    if (!appointments || appointments.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">
                            No Deferred or No-Show Donors
                        </h3>
                        <p className="text-sm">
                            All donors have successfully completed their
                            appointments.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-medium text-red-800 dark:text-red-200">
                                    Deferred Donors
                                </h3>
                                <p className="text-sm text-red-600 dark:text-red-300">
                                    {getDeferredCount()} donors deferred
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <XCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                                    No-Show Donors
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {getNoShowCount()} donors didn't show
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2">
                    <Button
                        variant={filterType === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("all")}
                    >
                        All ({appointments.length})
                    </Button>
                    <Button
                        variant={
                            filterType === "deferred" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setFilterType("deferred")}
                    >
                        Deferred ({getDeferredCount()})
                    </Button>
                    <Button
                        variant={
                            filterType === "no_show" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setFilterType("no_show")}
                    >
                        No Show ({getNoShowCount()})
                    </Button>
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by donor name, blood type, or agency..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Donors List */}
            <div className="space-y-3">
                {filteredAppointments.map((appointment) => {
                    const isDeferred = appointment.status === "deferred";
                    const isNoShow = appointment.status === "no show";

                    return (
                        <Card
                            key={appointment.id}
                            className={`hover:shadow-md transition-shadow duration-200 ${
                                isDeferred
                                    ? "border-red-200 dark:border-red-800"
                                    : "border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Donor Avatar */}
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                isDeferred
                                                    ? "bg-red-100 dark:bg-red-900"
                                                    : "bg-gray-100 dark:bg-gray-800"
                                            }`}
                                        >
                                            <User
                                                className={`h-6 w-6 ${
                                                    isDeferred
                                                        ? "text-red-600"
                                                        : "text-gray-600"
                                                }`}
                                            />
                                        </div>

                                        {/* Donor Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium truncate">
                                                    {appointment.donor?.user
                                                        ?.name ||
                                                        "Unknown Donor"}
                                                </h4>
                                                {getStatusBadge(
                                                    appointment.status
                                                )}
                                                {appointment.physical_exam &&
                                                    appointment.physical_exam
                                                        .eligibility_status &&
                                                    appointment.physical_exam.eligibility_status.includes(
                                                        "DEFERRED"
                                                    ) &&
                                                    getDeferralTypeBadge(
                                                        appointment
                                                            .physical_exam
                                                            .eligibility_status
                                                    )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Droplets className="h-3 w-3" />
                                                    <span>
                                                        {appointment.donor
                                                            ?.blood_type
                                                            ?.blood_type ||
                                                            "Not specified"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Building className="h-3 w-3" />
                                                    <span>
                                                        {appointment.donor
                                                            ?.agency?.name ||
                                                            "Unknown Agency"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {appointment
                                                            .time_schedule
                                                            ?.formatted_time ||
                                                            "No time scheduled"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleViewDetails(appointment)
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            <FileText className="h-3 w-3" />
                                            <span className="hidden sm:inline">
                                                Details
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                // TODO: Navigate to donor details
                                                console.log(
                                                    "View donor details:",
                                                    appointment.id
                                                );
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Deferral Details */}
                                {isDeferred && appointment.physical_exam && (
                                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                                        <h5 className="text-sm font-medium mb-2 text-red-700 dark:text-red-300">
                                            Deferral Information
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="font-medium">
                                                    Deferral Type:
                                                </span>
                                                <span className="ml-1">
                                                    {appointment.physical_exam
                                                        .eligibility_status ===
                                                    "TEMPORARILY-DEFERRED"
                                                        ? "Temporary"
                                                        : "Permanent"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    Deferral Date:
                                                </span>
                                                <span className="ml-1">
                                                    {appointment.physical_exam
                                                        .created_at
                                                        ? moment(
                                                              appointment
                                                                  .physical_exam
                                                                  .created_at
                                                          ).format(
                                                              "MMM DD, YYYY"
                                                          )
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        {appointment.physical_exam
                                            .deferral_reason && (
                                            <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">
                                                <span className="font-medium">
                                                    Reason:
                                                </span>{" "}
                                                {
                                                    appointment.physical_exam
                                                        .deferral_reason
                                                }
                                            </div>
                                        )}
                                        {appointment.physical_exam.remarks && (
                                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                                                <span className="font-medium">
                                                    Medical Notes:
                                                </span>{" "}
                                                {
                                                    appointment.physical_exam
                                                        .remarks
                                                }
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* No Show Details */}
                                {isNoShow && (
                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                        <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            No Show Information
                                        </h5>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">
                                                Scheduled Time:
                                            </span>
                                            <span className="ml-1">
                                                {appointment.time_schedule
                                                    ?.formatted_time ||
                                                    "Not specified"}
                                            </span>
                                        </div>
                                        {appointment.comments && (
                                            <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded text-xs">
                                                <span className="font-medium">
                                                    Notes:
                                                </span>{" "}
                                                {appointment.comments}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground text-center">
                Showing {filteredAppointments.length} of {appointments.length}{" "}
                deferred/no-show donors
            </div>
        </div>
    );
}
