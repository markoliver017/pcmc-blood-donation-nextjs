"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    Building,
    Calendar,

    Droplet,
    UserCircle,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import Skeleton_user from "@components/ui/Skeleton_user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { getAppointmentById } from "@/action/adminEventAction";

import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import AppointmentDonorProfileTabForm from "@components/admin/AppointmentDonorProfileTabForm";
import SideComponent from "./SideComponent";
import { MdOutlineBloodtype } from "react-icons/md";

export default function TabsComponent({ appointmentId }) {
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

    if (isLoading) return <Skeleton_user />;

    const schedule = appointment?.time_schedule;
    const event = schedule?.event;
    const donor = appointment?.donor;
    const user = donor?.user;

    return (
        <>
            <WrapperHeadMain
                icon={<Calendar />}
                pageTitle={`Appointment Details - ${user?.full_name || user?.name
                    }`}
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
            <div className="w-full h-full md:w-95/100 mx-auto p-2 grid grid-cols-1 md:grid-cols-4 gap-2">

                {/* Side panel: Event Details */}
                <SideComponent appointment={appointment} />
                {/* Right Panel: Main Content Area */}
                <Card className="col-span-1 md:col-span-3 bg-gray-100 p-2">
                    <CardHeader className="text-2xl font-bold hidden">
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent id="form-modal" className="p-0">
                        <Tabs defaultValue="donor-profile" className="p-2">
                            <TabsList className="flex flex-wrap">
                                {/* <TabsTrigger
                                    value="user-profile"
                                    title="User Profile"
                                >
                                    <User2Icon />
                                    <span className="hidden md:inline-block">
                                        User Profile
                                    </span>
                                </TabsTrigger> */}
                                <TabsTrigger
                                    value="donor-profile"
                                    title="Donor's Profile"

                                >
                                    <div className="flex items-center gap-1 px-3 ring-offset-1 rounded-t-lg hover:ring">

                                        <UserCircle />
                                        <span className="hidden md:inline-block">
                                            Donor's Profile
                                        </span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="blood-type"
                                    title="Blood Type"
                                >
                                    <div className="flex items-center gap-1 px-3 ring-offset-1 rounded-t-lg hover:ring">
                                        <MdOutlineBloodtype className="h-6 w-6" />
                                        <span className="hidden md:inline-block">
                                            Blood Type
                                        </span>
                                    </div>
                                </TabsTrigger>


                            </TabsList>
                            <TabsContent className="p-2" value="donor-profile">
                                <AppointmentDonorProfileTabForm donor={donor} />
                            </TabsContent>
                            {/* 
                    <TabsContent className="p-2" value="blood-type">
                        <BloodTypeTabForm
                            donor={{
                                id: userData?.donor?.id,
                                blood_type_id: userData?.donor?.blood_type_id,
                                is_bloodtype_verified:
                                    userData?.donor?.is_bloodtype_verified,
                            }}
                        />
                    </TabsContent>
                    <TabsContent value="user-credentials">
                        <UserChangePassword userQuery={userQuery} />
                    </TabsContent>
                    <TabsContent value="agency-details">
                        <UpdateAgencyProfile
                            agency={agency}
                            isReadOnly={true}
                        />
                    </TabsContent> */}
                        </Tabs>
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
