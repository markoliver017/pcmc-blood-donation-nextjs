"use client";
import React from "react";
import { Button } from "@components/ui/button";
import {
    Dialog,
    DialogContentNoX,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { User, Droplets, Building, Clock, X, IdCard, File } from "lucide-react";

import { getAppointmentById } from "@/action/adminEventAction";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@components/ui/skeleton";

import { Badge } from "@components/ui/badge";
import DonorAppointmentTabComponent from "./DonorAppointmentTabComponent";
import { Card, CardContent } from "@components/ui/card";
import { useModalToastContainer } from "@lib/hooks/useModalToastContainer";
import Image from "next/image";

export default function AppointmentManagementModal({
    isOpen,
    onClose,
    appointmentId,
    eventId,
}) {
    const { data: appointment, isLoading } = useQuery({
        queryKey: ["appointment", appointmentId],
        queryFn: async () => {
            const res = await getAppointmentById(appointmentId);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    useModalToastContainer();
    if (isLoading) return <Skeleton />;

    const donor = appointment?.donor;
    const user = donor?.user;
    const schedule = appointment?.time_schedule;

    const getStatusBadge = (status) => {
        const statusConfig = {
            registered: {
                color: "bg-blue-100 text-blue-800",
                text: "REGISTERED",
            },
            examined: {
                color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                text: "EXAMINED",
            },
            collected: {
                color: "bg-green-100 text-green-800",
                text: "COLLECTED",
            },
            cancelled: { color: "bg-red-100 text-red-800", text: "CANCELLED" },
            deferred: { color: "bg-red-100 text-red-800", text: "DEFERRED" },
            "no show": { color: "bg-red-100 text-red-800", text: "NO SHOW" },
        };

        const config = statusConfig[status] || {
            color: "bg-gray-100 text-gray-800",
            text: status?.toUpperCase() || "UNKNOWN",
        };

        return (
            <div className={`text-xs badge p-4 ${config.color}`}>
                {config.text}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContentNoX
                onInteractOutside={(event) => event.preventDefault()}
                className="max-w-7xl h-[90vh] overflow-hidden flex flex-col md:px-5 px-2"
            >
                <DialogHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-semibold dark:text-white">
                                Manage Appointment
                            </DialogTitle>
                            <DialogDescription className="dark:text-slate-400">
                                Manage appointment for{" "}
                                {user?.name || "Unknown Donor"}
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            tabIndex={-1}
                            onClick={onClose}
                            className="h-8 w-8 p-0 dark:text-white"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex flex-col flex-1 min-h-0">
                    {/* Appointment Overview Card */}
                    <Card className="mb-4 flex-shrink-0">
                        <CardContent className="md:p-4 p-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 relative bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        {user?.image ? (
                                            <Image
                                                src={
                                                    user?.image ||
                                                    "/avatar 2.png"
                                                }
                                                alt={user?.name}
                                                className="rounded-full"
                                                fill
                                                unoptimized={
                                                    process.env
                                                        .NEXT_PUBLIC_NODE_ENV ===
                                                    "production"
                                                }
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {user?.name || "Unknown Donor"}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <IdCard className="h-3 w-3" />
                                                <span>
                                                    {donor?.donor_reference_id ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Droplets className="h-3 w-3" />
                                                <span>
                                                    {donor?.blood_type
                                                        ?.blood_type ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Building className="h-3 w-3" />
                                                <span>
                                                    {donor?.agency?.name ||
                                                        "Unknown Agency"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <File className="h-3 w-3" />
                                                <span>
                                                    {appointment?.appointment_reference_id ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {schedule?.formatted_time ||
                                                        "No time scheduled"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {getStatusBadge(appointment.status)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Tabs */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <DonorAppointmentTabComponent
                            appointment={appointment}
                        />
                    </div>
                </div>
            </DialogContentNoX>
        </Dialog>
    );
}
