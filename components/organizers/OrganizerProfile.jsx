"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Building, Cog, Phone, User2Icon } from "lucide-react";

// import UserProfileForm from "./UserProfileForm";
// import UserChangePassword from "./UserChangePassword";

import { useQuery } from "@tanstack/react-query";
import UserProfileForm from "@components/profile/UserProfileForm";
import UserChangePassword from "@components/profile/UserChangePassword";
import { getOrganizerProfile } from "@/action/hostCoordinatorAction";

import SessionLogger from "@lib/utils/SessionLogger";
import Skeleton_user from "@components/ui/Skeleton_user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import UpdateAgencyProfile from "@components/profile/UpdateAgencyProfile";
import ProfileContactForm from "@components/coordinators/ProfileContactForm";

export default function OrganizerProfile({ user }) {
    // const { data, status } = useSession();
    // console.log("Organizer profile session status", status);
    // console.log("Organizer profile session data", data);

    const userQuery = useQuery({
        queryKey: ["user", user?.id],
        queryFn: async () => await getOrganizerProfile(user?.id),
    });

    const { data: userData, isLoading } = userQuery;

    if (isLoading === "loading") return <Skeleton_user />;

    const agencyRoles = ["Agency Administrator", "Organizer"];
    const isHavingAgency = agencyRoles.includes(user?.role_name) || false;

    let agency = userData?.headedAgency;
    let isCoordinator = false;
    if (user?.role_name == "Organizer") {
        isCoordinator = true;
        agency = userData?.coordinator?.agency;
    }

    // return <SessionLogger />;
    return (
        <Card className="md:p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                    <div>Update your account.</div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="user-profile" className="p-5">
                    <TabsList className="flex flex-wrap">
                        <TabsTrigger value="user-profile" title="User Profile">
                            <User2Icon />
                            <span className="hidden md:inline-block">
                                User Profile
                            </span>
                        </TabsTrigger>
                        {isCoordinator && (
                            <TabsTrigger
                                value="coordinator-contact"
                                title="Contact Details"
                            >
                                <Phone />
                                <span className="hidden md:inline-block">
                                    Contact Details
                                </span>
                            </TabsTrigger>
                        )}
                        {user.provider == "credentials" && (
                            <TabsTrigger
                                value="user-credentials"
                                title="Account Credentials"
                            >
                                <Cog />
                                <span className="hidden md:inline-block">
                                    Account Credentials
                                </span>
                            </TabsTrigger>
                        )}
                        {isHavingAgency && (
                            <TabsTrigger
                                value="agency-details"
                                title="Agency Details"
                            >
                                <Building />
                                <span className="hidden md:inline-block">
                                    Agency Details
                                </span>
                            </TabsTrigger>
                        )}
                    </TabsList>
                    <TabsContent className="p-2" value="user-profile">
                        <UserProfileForm userQuery={userQuery} />
                    </TabsContent>
                    <TabsContent value="coordinator-contact">
                        <ProfileContactForm
                            coordinator={{
                                id: userData?.coordinator?.id,
                                agency_id: userData?.coordinator?.agency?.id,
                                contact_number:
                                    userData?.coordinator?.contact_number || "",
                            }}
                        />
                    </TabsContent>
                    <TabsContent value="user-credentials">
                        <UserChangePassword userQuery={userQuery} />
                    </TabsContent>
                    <TabsContent value="agency-details">
                        <UpdateAgencyProfile agency={agency} />
                    </TabsContent>
                </Tabs>
                {/* <div>
                    <h1>Agency Data</h1>
                    <pre>{JSON.stringify(userData, null, 3)}</pre>
                    <SessionLogger />
                </div> */}
            </CardContent>
        </Card>
    );
}
