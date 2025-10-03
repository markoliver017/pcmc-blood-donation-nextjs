"use client";
import React, { useRef } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { UserCircle, Text, UserSearch, UserCogIcon } from "lucide-react";

import { MdOutlineBloodtype } from "react-icons/md";
import { GiBlood } from "react-icons/gi";
import { IoInformationCircle } from "react-icons/io5";
import EventDashboardDonorProfileForm from "./EventDashboardDonorProfileForm";
import EventDashboardBloodTypeForm from "./EventDashboardBloodTypeForm";

import EventDashboardAppointmentForm from "./EventDashboardAppointmentForm";
import AppointmentPhysicalExamTabForm from "@components/admin/appointments/AppointmentPhysicalExamTabForm";
import ScrollToTop from "@components/ui/scroll-to-top";
import BloodCollectionTabForm from "@components/admin/appointments/BloodCollectionTabForm";
import { FaQuestionCircle } from "react-icons/fa";
import EventScreeningQuestionaire from "./EventScreeningQuestionaire";

export default function DonorAppointmentTabComponent({ appointment }) {
    const basicInfoRef = useRef(null);
    const bloodTypeRef = useRef(null);
    const appointmentInfoRef = useRef(null);
    const physicalExamRef = useRef(null);
    const screeningQuestionairesRef = useRef(null);
    const bloodCollectionRef = useRef(null);

    const donor = appointment?.donor;
    const eventId = appointment?.event_id;

    return (
        <Tabs
            defaultValue="donor-profile"
            className="flex-1 min-h-0 flex flex-col"
        >
            <TabsList className="md:mb-4 mb-2">
                <TabsTrigger
                    value="donor-profile"
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                    title="Donor Profile"
                >
                    <div className="flex-items-center">
                        <UserCircle className="h-4 w-4" />
                        <span className="hidden md:inline-block">
                            Donor Profile
                        </span>
                    </div>
                </TabsTrigger>
                <TabsTrigger
                    value="blood-donation-details"
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                    title="Blood Donation Details"
                >
                    <div className="flex-items-center">
                        <Text className="h-4 w-4" />
                        <span className="hidden md:inline-block">
                            Blood Donation Details
                        </span>
                    </div>
                </TabsTrigger>
            </TabsList>

            {/* Donor Profile Tab */}
            <TabsContent value="donor-profile" className="flex-1 min-h-0 flex ">
                {/* Vertical Sub Tabs */}
                <Tabs
                    defaultValue="basic-info"
                    className="flex md:gap-2 gap-1 flex-1 min-h-0"
                >
                    <TabsList className="flex flex-col max-w-max max-h-60 rounded-lg border p-2">
                        <TabsTrigger
                            value="basic-info"
                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                            title="User Profile"
                        >
                            <UserCogIcon className="h-4 w-4" />
                            <span className="hidden lg:inline-block">
                                User Profile
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="blood-type"
                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md dark:text-slate-300"
                            title="Blood Type"
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
                        className="flex-1 border rounded-lg shadow-sm overflow-y-auto relative"
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
                        className="flex-1 border rounded-lg shadow-sm overflow-y-auto relative"
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
                    className="flex md:gap-2 gap-1 flex-1 min-h-0"
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
                                Screening Response
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
                                    ?.eligibility_status !== "ACCEPTED" || false
                            }
                            className="flex items-center justify-center gap-2 p-2 w-full border-b data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:font-bold px-4 py-2 rounded-md disabled:opacity-50 dark:text-slate-300"
                        >
                            <GiBlood className="h-4 w-4" />
                            <span className="hidden lg:flex flex-col">
                                Blood Collection
                                {appointment?.physical_exam
                                    ?.eligibility_status !== "ACCEPTED" && (
                                    <sup className="italic text-xs text-red-500">
                                        (
                                        {appointment?.physical_exam
                                            ?.eligibility_status ||
                                            "Pending Exam"}
                                        )
                                    </sup>
                                )}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Sub Tab Content */}
                    <TabsContent
                        value="appointment-info"
                        className="flex-1 border rounded-lg bg-white dark:bg-inherit shadow-sm overflow-y-auto relative"
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
                        className="flex-1 border rounded-lg bg-white dark:bg-inherit shadow-sm overflow-y-auto relative"
                        ref={screeningQuestionairesRef}
                    >
                        <EventScreeningQuestionaire
                            appointmentId={appointment.id}
                        />
                        <ScrollToTop
                            containerRef={screeningQuestionairesRef}
                            position="bottom-center"
                            size="sm"
                            variant="outline"
                            className="bg-blue-200/90 backdrop-blur-sm border-gray-200 hover:bg-blue-300/80 dark:hover:bg-blue-600/80 dark:bg-blue-500/90 dark:border-blue-300"
                        />
                    </TabsContent>
                    <TabsContent
                        value="physical-exam"
                        className="flex-1 border rounded-lg bg-white dark:bg-inherit shadow-sm overflow-y-auto relative"
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
                        className="flex-1 border rounded-lg bg-white dark:bg-inherit shadow-sm overflow-y-auto relative"
                        ref={bloodCollectionRef}
                    >
                        <BloodCollectionTabForm appointment={appointment} />
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
    );
}
