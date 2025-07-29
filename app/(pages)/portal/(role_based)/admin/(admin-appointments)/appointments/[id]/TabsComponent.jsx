"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Calendar, CircleChevronLeft, UserSearch } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import Skeleton_user from "@components/ui/Skeleton_user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { getAppointmentById } from "@/action/adminEventAction";

import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import SideComponent from "./SideComponent";
import { useRouter } from "next/navigation";
import AppointmentStatusTabForm from "@components/admin/appointments/AppointmentStatusTabForm";
import { IoInformationCircle } from "react-icons/io5";
import AppointmentPhysicalExamTabForm from "@components/admin/appointments/AppointmentPhysicalExamTabForm";
import { GiBlood } from "react-icons/gi";
import BloodCollectionTabForm from "@components/admin/appointments/BloodCollectionTabForm";
import DonorAppointmentTabComponent from "@components/event-dashboard-component/DonorAppointmentTabComponent";
import Link from "next/link";

export default function TabsComponent({ appointmentId }) {
    const router = useRouter();
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

    if (isLoading)
        return (
            <div className="p-5">
                <Skeleton_user />
            </div>
        );

    const donor = appointment?.donor;
    const user = donor?.user;

    return (
        <>
            <WrapperHeadMain
                icon={
                    <button
                        onClick={() => router.back()}
                        className="hover:ring-1 p-2 rounded-full"
                    >
                        <CircleChevronLeft />
                    </button>
                }
                pageTitle={
                    <>Appointment Details - {user?.full_name || user?.name}</>
                }
                breadcrumbs={[
                    {
                        path: "/portal/admin/appointments",
                        icon: <Calendar className="w-4" />,
                        title: "Appointments",
                    },
                    {
                        path: `/portal/admin/appointments/${appointmentId}`,
                        icon: <InfoCircledIcon className="w-4" />,
                        title: "Appointment Details",
                    },
                ]}
            />
            <div className="w-full md:w-95/100 mx-auto py-2 grid grid-cols-1 lg:grid-cols-4 gap-2 pb-10">
                {/* Side panel: Event Details */}
                <SideComponent appointment={appointment} />
                {/* Right Panel: Main Content Area */}
                <Card className="col-span-1 sm:col-span-3 bg-gray-100 p-2 relative">
                    <CardHeader className="text-2xl font-bold hidden">
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent id="form-modal" className="p-0">
                        <Tabs defaultValue="donor-profile" className="p-2">
                            <TabsContent
                                className="py-2"
                                value="blood-donation-details"
                            >
                                <Tabs
                                    defaultValue="appointment-info"
                                    className="flex flex-wrap gap-2 p-1"
                                >
                                    {/* Vertical Tabs List */}
                                    <TabsList className="flex flex-col max-w-max max-h-60 rounded-lg border p-2">
                                        <TabsTrigger
                                            value="appointment-info"
                                            title="Appointment Information"
                                        >
                                            <div className="flex items-center rounded gap-2 p-2 w-full border-b">
                                                <IoInformationCircle />
                                                <span className="hidden lg:inline-block">
                                                    Appointment Details
                                                </span>
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="physical-exam"
                                            title="Physical Examination"
                                        >
                                            <div className="flex items-center rounded gap-2 p-2 w-full border-b">
                                                <UserSearch />
                                                <span className="hidden lg:inline-block">
                                                    Physical Examination
                                                </span>
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="blood-collection"
                                            disabled={
                                                appointment?.physical_exam
                                                    ?.eligibility_status !==
                                                    "ACCEPTED" || false
                                            }
                                            title="Blood Collection"
                                        >
                                            <div className="flex items-center rounded gap-2 p-2 w-full border-b">
                                                <GiBlood />
                                                <span className="hidden lg:inline-block">
                                                    Blood Collection
                                                </span>
                                            </div>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Tab Panels */}
                                    <div className="flex-1 border rounded-lg p-2 bg-white dark:bg-inherit shadow-sm">
                                        <TabsContent value="appointment-info">
                                            <AppointmentStatusTabForm
                                                appointment={appointment}
                                            />
                                        </TabsContent>
                                        <TabsContent value="physical-exam">
                                            <AppointmentPhysicalExamTabForm
                                                appointment={appointment}
                                            />
                                        </TabsContent>
                                        <TabsContent value="blood-collection">
                                            <BloodCollectionTabForm
                                                appointment={appointment}
                                            />
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </TabsContent>
                        </Tabs>
                        <DonorAppointmentTabComponent
                            appointment={appointment}
                        />

                        {/* <div>
                            <h1>Appointment Data</h1>
                            <pre>{JSON.stringify(appointment, null, 3)}</pre>
                        </div> */}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
