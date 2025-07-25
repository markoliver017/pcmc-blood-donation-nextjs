"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogContentNoX,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
    User,
    Droplets,
    Building,
    Clock,
    X,
    UserCircle,
    Text,
    UserSearch,
} from "lucide-react";

import { MdOutlineBloodtype } from "react-icons/md";
import { GiBlood } from "react-icons/gi";
import { IoInformationCircle } from "react-icons/io5";
import EventDashboardDonorProfileForm from "./EventDashboardDonorProfileForm";
import EventDashboardBloodTypeForm from "./EventDashboardBloodTypeForm";
import { getAppointmentById } from "@/action/adminEventAction";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@components/ui/skeleton";
import EventDashboardAppointmentForm from "./EventDashboardAppointmentForm";
import AppointmentPhysicalExamTabForm from "@components/admin/appointments/AppointmentPhysicalExamTabForm";
import ScrollToTop from "@components/ui/scroll-to-top";
import BloodCollectionTabForm from "@components/admin/appointments/BloodCollectionTabForm";
import { FaQuestion, FaQuestionCircle } from "react-icons/fa";
import EventScreeningQuestionaire from "./EventScreeningQuestionaire";

export default function AppointmentManagementModal({
    isOpen,
    onClose,
    appointmentId,
    eventId,
}) {
    const basicInfoRef = useRef(null);
    const bloodTypeRef = useRef(null);
    const appointmentInfoRef = useRef(null);
    const physicalExamRef = useRef(null);
    const screeningQuestionairesRef = useRef(null);
    const bloodCollectionRef = useRef(null);

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
            <badge className={`text-xs badge px-2 ${config.color}`}>
                {config.text}
            </badge>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContentNoX
                onInteractOutside={(event) => event.preventDefault()}
                className="max-w-7xl h-[90vh] overflow-hidden flex flex-col"
            >
                <DialogHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-semibold">
                                Manage Appointment
                            </DialogTitle>
                            <DialogDescription>
                                Manage appointment for{" "}
                                {user?.name || "Unknown Donor"}
                            </DialogDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            tabIndex={-1}
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex flex-col flex-1 min-h-0">
                    {/* Appointment Overview Card */}
                    <Card className="mb-4 flex-shrink-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {user?.name || "Unknown Donor"}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {schedule?.formatted_time ||
                                                        "No time scheduled"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(appointment.status)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Tabs */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <Tabs
                            defaultValue="donor-profile"
                            className="flex-1 min-h-0 flex flex-col"
                        >
                            <TabsList className="mb-4">
                                <TabsTrigger
                                    value="donor-profile"
                                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                                >
                                    <div className="flex-items-center">
                                        <UserCircle className="h-4 w-4" />
                                        <span>Donor Profile</span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="blood-donation-details"
                                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-600"
                                >
                                    <div className="flex-items-center">
                                        <Text className="h-4 w-4" />
                                        <span>Blood Donation Details</span>
                                    </div>
                                </TabsTrigger>
                            </TabsList>

                            {/* Donor Profile Tab */}
                            <TabsContent
                                value="donor-profile"
                                className="flex-1 min-h-0 flex flex-col"
                            >
                                {/* Vertical Sub Tabs */}
                                <Tabs
                                    defaultValue="basic-info"
                                    className="flex gap-4 flex-1 min-h-0"
                                >
                                    <TabsList className="flex flex-col max-w-max max-h-60 rounded-lg border p-2">
                                        <TabsTrigger
                                            value="basic-info"
                                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                                        >
                                            <IoInformationCircle className="h-4 w-4" />
                                            <span className="hidden lg:inline-block">
                                                User Profile
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="blood-type"
                                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                                        >
                                            <MdOutlineBloodtype className="h-4 w-4" />
                                            <span className="hidden lg:inline-block">
                                                Blood Type
                                            </span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Sub Tab Content */}
                                    <TabsContent
                                        value="basic-info"
                                        className="flex-1 border rounded-lg p-4 shadow-sm overflow-y-auto relative"
                                        ref={basicInfoRef}
                                    >
                                        <EventDashboardDonorProfileForm
                                            donor={donor}
                                            eventId={eventId}
                                        />
                                        <ScrollToTop
                                            containerRef={basicInfoRef}
                                            position="bottom-center"
                                            size="sm"
                                            variant="outline"
                                            className="bg-blue-200/90 backdrop-blur-sm border-gray-200 hover:bg-blue-300/80 dark:hover:bg-blue-600/80 dark:bg-blue-500/90 dark:border-blue-300"
                                        />
                                    </TabsContent>
                                    <TabsContent
                                        value="blood-type"
                                        className="flex-1 border rounded-lg p-4 shadow-sm overflow-y-auto relative"
                                        ref={bloodTypeRef}
                                    >
                                        <EventDashboardBloodTypeForm
                                            donor={donor}
                                            eventId={eventId}
                                        />
                                        <ScrollToTop
                                            containerRef={bloodTypeRef}
                                            position="bottom-center"
                                            size="sm"
                                            variant="outline"
                                            className="bg-blue-200/90 backdrop-blur-sm border-gray-200 hover:bg-blue-300/80 dark:hover:bg-blue-600/80 dark:bg-blue-500/90 dark:border-blue-300"
                                        />
                                    </TabsContent>
                                </Tabs>
                            </TabsContent>

                            {/* Blood Donation Details Tab */}
                            <TabsContent
                                value="blood-donation-details"
                                className="flex-1 min-h-0 flex flex-col"
                            >
                                <Tabs
                                    defaultValue="appointment-info"
                                    className="flex gap-4 flex-1 min-h-0"
                                >
                                    {/* Vertical Sub Tabs */}
                                    <TabsList className="flex flex-col max-w-max max-h-60 rounded-lg border p-2">
                                        <TabsTrigger
                                            value="appointment-info"
                                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                                        >
                                            <IoInformationCircle className="h-4 w-4" />
                                            <span className="hidden lg:inline-block">
                                                Appointment Details
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="screening-questionaires"
                                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                                        >
                                            <FaQuestionCircle className="h-3 w-3" />
                                            <span className="hidden lg:inline-block">
                                                Screening Questionaire Response
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="physical-exam"
                                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                                        >
                                            <UserSearch className="h-4 w-4" />
                                            <span className="hidden lg:inline-block">
                                                Physical Examination
                                            </span>
                                        </TabsTrigger>

                                        <TabsTrigger
                                            value="blood-collection"
                                            disabled={
                                                appointment?.physical_exam
                                                    ?.eligibility_status !==
                                                    "ACCEPTED" || false
                                            }
                                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md disabled:opacity-50 dark:text-slate-300"
                                        >
                                            <GiBlood className="h-4 w-4" />
                                            <span className="hidden lg:inline-block">
                                                Blood Collection
                                                {appointment?.physical_exam
                                                    ?.eligibility_status !==
                                                    "ACCEPTED" && (
                                                    <sup className="italic text-xs text-red-500">
                                                        (Not Eligible)
                                                    </sup>
                                                )}
                                            </span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Sub Tab Content */}
                                    <TabsContent
                                        value="appointment-info"
                                        className="flex-1 border rounded-lg p-4 bg-white dark:bg-inherit shadow-sm overflow-y-auto relative"
                                        ref={appointmentInfoRef}
                                    >
                                        {appointment && (
                                            <EventDashboardAppointmentForm
                                                appointment={appointment}
                                                eventId={eventId}
                                            />
                                        )}
                                        <ScrollToTop
                                            containerRef={appointmentInfoRef}
                                            position="bottom-center"
                                            size="sm"
                                            variant="outline"
                                            className="bg-blue-200/90 backdrop-blur-sm border-gray-200 hover:bg-blue-300/80 dark:hover:bg-blue-600/80 dark:bg-blue-500/90 dark:border-blue-300"
                                        />
                                    </TabsContent>
                                    <TabsContent
                                        value="screening-questionaires"
                                        className="flex-1 border rounded-lg p-4 bg-white dark:bg-inherit shadow-sm overflow-y-auto relative"
                                        ref={screeningQuestionairesRef}
                                    >
                                        <EventScreeningQuestionaire
                                            appointmentId={appointmentId}
                                        />
                                        <ScrollToTop
                                            containerRef={
                                                screeningQuestionairesRef
                                            }
                                            position="bottom-center"
                                            size="sm"
                                            variant="outline"
                                            className="bg-blue-200/90 backdrop-blur-sm border-gray-200 hover:bg-blue-300/80 dark:hover:bg-blue-600/80 dark:bg-blue-500/90 dark:border-blue-300"
                                        />
                                    </TabsContent>
                                    <TabsContent
                                        value="physical-exam"
                                        className="flex-1 border rounded-lg p-4 bg-white dark:bg-inherit shadow-sm overflow-y-auto relative"
                                        ref={physicalExamRef}
                                    >
                                        <AppointmentPhysicalExamTabForm
                                            appointment={appointment}
                                        />
                                        <ScrollToTop
                                            containerRef={physicalExamRef}
                                            position="bottom-center"
                                            size="sm"
                                            variant="outline"
                                            className="bg-blue-200/90 backdrop-blur-sm border-gray-200 hover:bg-blue-300/80 dark:hover:bg-blue-600/80 dark:bg-blue-500/90 dark:border-blue-300"
                                        />
                                    </TabsContent>
                                    <TabsContent
                                        value="blood-collection"
                                        className="flex-1 border rounded-lg p-4 bg-white dark:bg-inherit shadow-sm overflow-y-auto relative"
                                        ref={bloodCollectionRef}
                                    >
                                        <BloodCollectionTabForm
                                            appointment={appointment}
                                        />
                                        <ScrollToTop
                                            containerRef={bloodCollectionRef}
                                            position="bottom-right"
                                            size="sm"
                                            variant="outline"
                                            className="bg-blue-200/90 backdrop-blur-sm border-gray-200 hover:bg-blue-300/80 dark:hover:bg-blue-600/80 dark:bg-blue-500/90 dark:border-blue-300"
                                        />
                                    </TabsContent>
                                </Tabs>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </DialogContentNoX>
        </Dialog>
    );
}
