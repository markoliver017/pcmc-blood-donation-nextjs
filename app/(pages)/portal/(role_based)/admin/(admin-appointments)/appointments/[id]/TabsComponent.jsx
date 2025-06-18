"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    Building,
    Calendar,
    Cog,
    Droplet,
    Phone,
    User2Icon,
    UserCheck,
    UserCircle,
    UserIcon,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { getOrganizerProfile } from "@/action/hostCoordinatorAction";
import Skeleton_user from "@components/ui/Skeleton_user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import UpdateAgencyProfile from "@components/profile/UpdateAgencyProfile";
import { getDonorProfile } from "@/action/donorAction";
import { getAppointmentById } from "@/action/adminEventAction";

import UserProfileForm from "@components/profile/UserProfileForm";
import UserChangePassword from "@components/profile/UserChangePassword";
import BloodTypeTabForm from "@components/donors/BloodTypeTabForm";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import parse from "html-react-parser";
import moment from "moment";
import Image from "next/image";
import AppointmentDonorProfileTabForm from "@components/admin/AppointmentDonorProfileTabForm";

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
                pageTitle={`Appointment Details - ${
                    user?.full_name || user?.name
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
                <Card className="p-4 flex flex-col gap-4">
                    <CardHeader className="border-b">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded overflow-hidden border">
                                <Image
                                    src={event?.file_url || "/logo-1.png"}
                                    alt="Event Image"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-semibold">
                                    {event?.title || "Untitled Event"}
                                </CardTitle>
                                <CardDescription className="mt-1 text-sm text-gray-500">
                                    {moment(event?.date).format("MMM DD, YYYY")}{" "}
                                    — {schedule?.formatted_time || "No Time"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="text-sm text-gray-700 dark:text-gray-300">
                        {event?.description ? (
                            <div className="prose">
                                {parse(event.description)}
                            </div>
                        ) : (
                            <p className="italic text-gray-400">
                                No description provided.
                            </p>
                        )}

                        <div className="mt-4 space-y-1">
                            <div className="font-semibold">Organized by:</div>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                                    <Image
                                        src={
                                            donor?.agency?.file_url ||
                                            "/default_company_avatar.png"
                                        }
                                        alt="Agency Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {donor?.agency?.name}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        {donor?.agency?.agency_address}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="font-semibold">Coordinator:</div>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                                    <Image
                                        src={
                                            user?.image || "/default_avatar.png"
                                        }
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {event?.requester?.name}
                                    </div>

                                    <div className="text-gray-500 dark:text-gray-400">
                                        Email: {event?.requester?.email}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        Contact: {donor?.contact_number}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="font-semibold">Donor:</div>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                                    <Image
                                        src={
                                            user?.image || "/default_avatar.png"
                                        }
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {user?.name}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        {donor?.full_address}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        Email: {user?.email}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        Contact: {donor?.contact_number}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                                    <UserCircle />
                                    <span className="hidden md:inline-block">
                                        Donor's Profile
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="blood-type"
                                    title="Blood Type"
                                >
                                    <Droplet />
                                    <span className="hidden md:inline-block">
                                        Blood Type
                                    </span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="agency-details"
                                    title="Agency Details"
                                >
                                    <Building />
                                    <span className="hidden md:inline-block">
                                        Agency Details
                                    </span>
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
