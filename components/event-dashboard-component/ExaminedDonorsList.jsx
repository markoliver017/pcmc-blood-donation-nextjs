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
    XCircle,
    Activity,
    AlertTriangle,
} from "lucide-react";
import UpdateStatusModal from "./UpdateStatusModal";

export default function ExaminedDonorsList({ eventId, appointments, onManageAppointment, roleName }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleStatusUpdate = (appointment, newStatus) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const getEligibilityBadge = (eligibilityStatus) => {
        const config = {
            ACCEPTED: { color: "badge-success", text: "ELIGIBLE" },
            "TEMPORARILY-DEFERRED": {
                color: "badge-warning",
                text: "TEMPORARILY DEFERRED",
            },
            "PERMANENTLY-DEFERRED": {
                color: "badge-error",
                text: "PERMANENTLY DEFERRED",
            },
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

    if (!appointments || appointments.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">
                            No Examined Donors
                        </h3>
                        <p className="text-sm">
                            No donors have completed physical examination yet.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-4">
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
                    {filteredAppointments.map((appointment) => {
                        const isEligible =
                            appointment.physical_exam?.eligibility_status ===
                            "ACCEPTED";
                        const hasCollection = appointment.blood_collection;

                        return (
                            <Card
                                key={appointment.id}
                                className="hover:shadow-md transition-shadow duration-200"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            {/* Donor Avatar */}
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${isEligible
                                                    ? "bg-green-100 dark:bg-green-900"
                                                    : "bg-red-100 dark:bg-red-900"
                                                    }`}
                                            >
                                                <User
                                                    className={`h-6 w-6 ${isEligible
                                                        ? "text-green-600"
                                                        : "text-red-600"
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
                                                        getEligibilityBadge(
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
                                                                ?.agency
                                                                ?.name ||
                                                                "Unknown Agency"}
                                                        </span>
                                                    </div>
                                                    {appointment.physical_exam && (
                                                        <div className="flex items-center gap-1">
                                                            <Activity className="h-3 w-3" />
                                                            <span>
                                                                BP:{" "}
                                                                {appointment
                                                                    .physical_exam
                                                                    .blood_pressure ||
                                                                    "N/A"}{" "}
                                                                | HR:{" "}
                                                                {appointment
                                                                    .physical_exam
                                                                    .pulse_rate ||
                                                                    "N/A"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            {roleName === "Admin" &&
                                                isEligible && !hasCollection && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                appointment,
                                                                "collected"
                                                            )
                                                        }
                                                        className="flex items-center gap-1"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span className="hidden sm:inline">
                                                            Mark Collected
                                                        </span>
                                                    </Button>
                                                )
                                            }
                                            {!isEligible && (
                                                <div className="flex items-center gap-1 text-xs text-red-600">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    <span>Deferred</span>
                                                </div>
                                            )}
                                            {hasCollection && (
                                                <div className="flex items-center gap-1 text-xs text-green-600">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span>Collected</span>
                                                </div>
                                            )}
                                            {roleName === "Admin" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        onManageAppointment(appointment)
                                                    }
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Examination Details */}
                                    {appointment.physical_exam && (
                                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                            <h5 className="text-sm font-medium mb-2">
                                                Examination Results
                                            </h5>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                                <div>
                                                    <span className="font-medium">
                                                        Blood Pressure:
                                                    </span>{" "}
                                                    {appointment.physical_exam
                                                        .blood_pressure ||
                                                        "N/A"}
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Pulse Rate:
                                                    </span>{" "}
                                                    {appointment.physical_exam
                                                        .pulse_rate || "N/A"}
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Hemoglobin:
                                                    </span>{" "}
                                                    {appointment.physical_exam
                                                        .hemoglobin_level ||
                                                        "N/A"}
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Weight:
                                                    </span>{" "}
                                                    {appointment.physical_exam
                                                        .weight || "N/A"}{" "}
                                                    kg
                                                </div>
                                            </div>
                                            {appointment.physical_exam
                                                .deferral_reason && (
                                                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                                                        <span className="font-medium text-red-700 dark:text-red-300">
                                                            Deferral Reason:
                                                        </span>{" "}
                                                        {
                                                            appointment
                                                                .physical_exam
                                                                .deferral_reason
                                                        }
                                                    </div>
                                                )}
                                            {appointment.physical_exam
                                                .remarks && (
                                                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                                                        <span className="font-medium text-blue-700 dark:text-blue-300">
                                                            Remarks:
                                                        </span>{" "}
                                                        {
                                                            appointment
                                                                .physical_exam
                                                                .remarks
                                                        }
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                    {/* Collection Info */}
                                    {appointment.blood_collection && (
                                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                                            <h5 className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                                                Blood Collection
                                            </h5>
                                            <div className="text-xs">
                                                <span className="font-medium">
                                                    Volume:
                                                </span>{" "}
                                                {
                                                    appointment.blood_collection
                                                        .volume
                                                }
                                                ml
                                                {appointment.blood_collection
                                                    .remarks && (
                                                        <span className="ml-4">
                                                            <span className="font-medium">
                                                                Remarks:
                                                            </span>{" "}
                                                            {
                                                                appointment
                                                                    .blood_collection
                                                                    .remarks
                                                            }
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground text-center">
                    Showing {filteredAppointments.length} of{" "}
                    {appointments.length} examined donors
                </div>
            </div>

            {/* Status Update Modal */}
            {selectedAppointment && (
                <UpdateStatusModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedAppointment(null);
                    }}
                    appointment={selectedAppointment}
                    eventId={eventId}
                />
            )}
        </>
    );
}
