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
    CheckCircle,
    Download,
    FileText,
} from "lucide-react";
import moment from "moment";

export default function CollectedDonorsList({
    eventId,
    appointments,
    onManageAppointment,
    roleName,
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAppointments = appointments.filter((appointment) => {
        const donorName = appointment.donor?.user?.name?.toLowerCase() || "";
        const bloodType =
            appointment.donor?.blood_type?.blood_type?.toLowerCase() || "";
        const agencyName = appointment.donor?.agency?.name?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        return (
            donorName.includes(search) ||
            bloodType.includes(search) ||
            agencyName.includes(search)
        );
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            registered: { color: "badge-primary", text: "REGISTERED" },
            examined: { color: "badge-warning", text: "EXAMINED" },
            collected: { color: "badge-success", text: "COLLECTED" },
            cancelled: { color: "badge-error", text: "CANCELLED" },
            "no show": { color: "badge-error", text: "NO SHOW" },
        };

        const config = statusConfig[status] || {
            color: "badge-secondary",
            text: status.toUpperCase(),
        };

        return (
            <Badge className={`text-xs ${config.color}`}>{config.text}</Badge>
        );
    };

    const handleDownloadCertificate = (appointment) => {
        // TODO: Implement certificate download
        console.log("Download certificate for:", appointment.id);
    };

    const handleViewDetails = (appointment) => {
        // TODO: Navigate to detailed view
        console.log("View details for:", appointment.id);
    };

    if (!appointments || appointments.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        <Droplets className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">
                            No Blood Collections
                        </h3>
                        <p className="text-sm">
                            No blood has been collected from donors yet.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate total blood volume
    const totalVolume = appointments.reduce((total, appointment) => {
        return total + (Number(appointment.blood_collection?.volume) || 0);
    }, 0);

    return (
        <div className="space-y-4">
            {/* Summary Card */}
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                                <Droplets className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-medium text-green-800 dark:text-green-200">
                                    Successful Collections
                                </h3>
                                <p className="text-sm text-green-600 dark:text-green-300">
                                    {appointments.length} donors •{" "}
                                    {totalVolume.toLocaleString()}
                                    ml total volume
                                </p>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                                {totalVolume.toLocaleString()} ml
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-300">
                                Total Blood Volume
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by donor name, blood type, or agency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Donors List */}
            <div className="space-y-3">
                {filteredAppointments.map((appointment) => (
                    <Card
                        key={appointment.id}
                        className="hover:shadow-md transition-shadow duration-200 border-green-200 dark:border-green-800"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    {/* Donor Avatar */}
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-green-600" />
                                    </div>

                                    {/* Donor Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium truncate">
                                                {appointment.donor?.user
                                                    ?.name || "Unknown Donor"}
                                            </h4>
                                            {getStatusBadge(appointment.status)}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                                                    {appointment.donor?.agency
                                                        ?.name ||
                                                        "Unknown Agency"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-600" />
                                                <span className="text-green-600 font-medium">
                                                    {appointment
                                                        .blood_collection
                                                        ?.volume || 0}
                                                    ml collected
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {roleName === "admin" && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleDownloadCertificate(
                                                    appointment
                                                )
                                            }
                                            className="flex items-center gap-1"
                                            disabled
                                        >
                                            <Download className="h-3 w-3" />
                                            <span className="hidden sm:inline">
                                                {/* Certificate */}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onManageAppointment(appointment)
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            <FileText className="h-3 w-3" />
                                            <span className="hidden sm:inline">
                                                Details
                                            </span>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Collection Details */}
                            {appointment.blood_collection && (
                                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                                    <h5 className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                                        Collection Details
                                    </h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                        <div>
                                            <span className="font-medium">
                                                Volume:
                                            </span>{" "}
                                            {
                                                appointment.blood_collection
                                                    .volume
                                            }
                                            ml
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Collection Time:
                                            </span>{" "}
                                            {appointment.blood_collection
                                                .created_at
                                                ? moment(
                                                      appointment
                                                          .blood_collection
                                                          .created_at
                                                  ).format("HH:mm")
                                                : "N/A"}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Collection Date:
                                            </span>{" "}
                                            {appointment.blood_collection
                                                .created_at
                                                ? moment(
                                                      appointment
                                                          .blood_collection
                                                          .created_at
                                                  ).format("MMM DD, YYYY")
                                                : "N/A"}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Status:
                                            </span>
                                            <span className="text-green-600 font-medium ml-1">
                                                Successfully Collected
                                            </span>
                                        </div>
                                    </div>
                                    {appointment.blood_collection.remarks && (
                                        <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">
                                            <span className="font-medium">
                                                Remarks:
                                            </span>{" "}
                                            {
                                                appointment.blood_collection
                                                    .remarks
                                            }
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Examination Summary */}
                            {appointment.physical_exam && (
                                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                                    <span className="font-medium">
                                        Pre-collection Check:
                                    </span>
                                    <span className="ml-1">
                                        BP:{" "}
                                        {appointment.physical_exam
                                            .blood_pressure || "N/A"}{" "}
                                        | HR:{" "}
                                        {appointment.physical_exam.pulse_rate ||
                                            "N/A"}{" "}
                                        | Hb:{" "}
                                        {appointment.physical_exam
                                            .hemoglobin_level || "N/A"}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground text-center">
                Showing {filteredAppointments.length} of {appointments.length}{" "}
                successful collections
            </div>
        </div>
    );
}
