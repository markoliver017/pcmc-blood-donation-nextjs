"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
    Search,
    Clock,
    User,
    Droplets,
    Building,
    Eye,
    CheckCircle,
    XCircle,
    Expand,
    EyeClosed,
} from "lucide-react";
import moment from "moment";
import UpdateStatusModal from "./UpdateStatusModal";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

export default function PendingDonorsList({
    eventId,
    appointments,
    onManageAppointment,
    roleName,
}) {
    const router = useRouter();
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
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">
                            No Pending Donors
                        </h3>
                        <p className="text-sm">
                            All registered donors have been examined or there
                            are no registrations yet.
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
                    {filteredAppointments.map((appointment) => (
                        <Card
                            key={appointment.id}
                            className="hover:shadow-md transition-shadow duration-200"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Donor Avatar */}
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>

                                        {/* Donor Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-medium truncate">
                                                    {appointment.donor?.user
                                                        ?.name ||
                                                        "Unknown Donor"}
                                                </h4>
                                                {getStatusBadge(
                                                    appointment.status
                                                )}
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
                                    {roleName === "Admin" && (
                                        <div className="flex items-center gap-2">
                                            {/* <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    appointment,
                                                    "cancelled"
                                                )
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            <XCircle className="h-3 w-3" />
                                            <span className="hidden sm:inline">
                                                Cancel
                                            </span>
                                        </Button> */}
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        appointment,
                                                        "no show"
                                                    )
                                                }
                                                className="flex items-center gap-1 bg-warning"
                                            >
                                                <XCircle className="h-3 w-3" />
                                                <span className="hidden sm:inline">
                                                    Mark as No Show
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    onManageAppointment(
                                                        appointment
                                                    )
                                                }
                                                className="flex items-center gap-1 bg-blue-500"
                                            >
                                                <Settings className="h-3 w-3" />
                                                <span className="hidden sm:inline">
                                                    Manage
                                                </span>
                                            </Button>
                                            {/* <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                // TODO: Navigate to donor details
                                                router.push(
                                                    `/portal/admin/appointments/${appointment.id}`
                                                );
                                                console.log(
                                                    "View donor details:",
                                                    appointment.id
                                                );
                                            }}
                                        >
                                            <Expand className="h-4 w-4" />
                                        </Button> */}
                                        </div>
                                    )}
                                </div>

                                {/* Additional Info */}
                                {appointment.comments && (
                                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                                        <span className="font-medium">
                                            Comments:
                                        </span>{" "}
                                        {appointment.comments}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground text-center">
                    Showing {filteredAppointments.length} of{" "}
                    {appointments.length} pending donors
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
